export type EsewaEnvironment = "test" | "production";

const environment = (process.env.ESEWA_ENVIRONMENT ||
  "test") as EsewaEnvironment;

const isProduction = environment === "production";

export const esewaConfig = {
  environment,

  productCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",

  paymentUrl:
    process.env.ESEWA_PAYMENT_URL ||
    (isProduction
      ? "https://epay.esewa.com.np/api/epay/main/v2/form"
      : "https://rc-epay.esewa.com.np/api/epay/main/v2/form"),

  statusUrl:
  process.env.ESEWA_STATUS_URL ||
  (isProduction
    ? "https://esewa.com.np/api/epay/transaction/status/"
    : "https://rc.esewa.com.np/api/epay/transaction/status/"),

  returnUrl: (
    process.env.ESEWA_RETURN_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, ""),
};