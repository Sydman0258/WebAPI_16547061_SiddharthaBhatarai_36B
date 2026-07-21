import https from "https";
import { esewaConfig } from "../config/esewa.config";
import { generateEsewaSignature, generateTransactionUuid } from "../utils/esewa.utils";


export type EsewaStatusResult = {
  productCode: string;
  transactionUuid: string;
  totalAmount: number;
  status: string;
  referenceId: string;
  raw: Record<string, unknown>;
};

export type EsewaPaymentPayload = {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
  esewa_payment_url: string;
};

const parseNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return value;
  }

  const normalized = String(value ?? "").replace(/,/g, "");
  return Number(normalized);
};

const getJson = (url: URL): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      { headers: { Accept: "application/json" } },
      (response) => {
        let body = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {
          const statusCode = response.statusCode || 500;

          let parsed: Record<string, unknown>;
          try {
            parsed = JSON.parse(body);
          } catch {
            reject(new Error("eSewa returned an invalid status response"));
            return;
          }

          if (statusCode < 200 || statusCode >= 300) {
            reject(
              new Error(
                String(
                  parsed.error_message ||
                    parsed.message ||
                    "eSewa status check failed"
                )
              )
            );
            return;
          }

          resolve(parsed);
        });
      }
    );

    request.setTimeout(15000, () => {
      request.destroy(new Error("eSewa status check timed out"));
    });

    request.on("error", reject);
  });
};

export const checkEsewaTransactionStatus = async ({
  transactionUuid,
  totalAmount,
}: {
  transactionUuid: string;
  totalAmount: number;
}): Promise<EsewaStatusResult> => {
  const url = new URL(esewaConfig.statusUrl);

  url.searchParams.set("product_code", esewaConfig.productCode);
  url.searchParams.set("total_amount", Number(totalAmount).toFixed(2));
  url.searchParams.set("transaction_uuid", transactionUuid);

  const raw = await getJson(url);

  return {
    productCode: String(raw.product_code ?? raw.productCode ?? ""),
    transactionUuid: String(
      raw.transaction_uuid ?? raw.transactionUuid ?? ""
    ),
    totalAmount: parseNumber(raw.total_amount ?? raw.totalAmount),
    status: String(raw.status ?? "").toUpperCase(),
    referenceId: String(raw.ref_id ?? raw.refId ?? ""),
    raw,
  };
};

export const initiateEsewaPayment = (
  orderId: string,
  amount: number
): EsewaPaymentPayload => {
  const transactionUuid = generateTransactionUuid(orderId);
  const productCode = esewaConfig.productCode;
  const totalAmount = amount.toFixed(2);
  const taxAmount = "0";
  const productServiceCharge = "0";
  const productDeliveryCharge = "0";

  // Generate signature
  const signature = generateEsewaSignature(totalAmount, transactionUuid, productCode);

const origin = new URL(esewaConfig.returnUrl).origin;

const successUrl = `${origin}/customer/orders/esewa-callback?status=success`;
const failureUrl = `${origin}/customer/orders/esewa-callback?status=failed`;
  return {
    amount: totalAmount,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: productCode,
    product_service_charge: productServiceCharge,
    product_delivery_charge: productDeliveryCharge,
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
    esewa_payment_url: esewaConfig.paymentUrl,
  };
};