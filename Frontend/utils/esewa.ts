// utils/esewa.ts
interface EsewaCheckoutPayload {
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
}

export const postToEsewa = (payload: EsewaCheckoutPayload) => {
  const { esewa_payment_url, ...formFields } = payload;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = esewa_payment_url;

  Object.entries(formFields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};