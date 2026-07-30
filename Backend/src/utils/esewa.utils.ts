import crypto from "crypto";

export const createEsewaSignature = (
  totalAmount: string,
  transactionUuid: string,
  productCode: string
) => {
  const secretKey = process.env.ESEWA_SECRET_KEY;

  if (!secretKey) {
    throw new Error("ESEWA_SECRET_KEY is missing in .env");
  }

  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

  return crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
};
export const verifyEsewaResponseSignature = (
  payload: Record<string, unknown>
): boolean => {
  const secretKey = process.env.ESEWA_SECRET_KEY;
  const signedFieldNames = String(payload.signed_field_names ?? "");
  const receivedSignature = String(payload.signature ?? "");

  if (!secretKey || !signedFieldNames || !receivedSignature) {
    return false;
  }

  const message = signedFieldNames
    .split(",")
    .map((field) => `${field}=${String(payload[field] ?? "")}`)
    .join(",");

  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(message, "utf8")
    .digest("base64");

  const expected = Buffer.from(expectedSignature, "utf8");
  const received = Buffer.from(receivedSignature, "utf8");

  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received)
  );
};

export const generateEsewaSignature = createEsewaSignature;

export const generateTransactionUuid = (orderId: string) => {
  return `FC-${orderId}-${Date.now()}`;
};

export const createTransactionUuid = generateTransactionUuid;