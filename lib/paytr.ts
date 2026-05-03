// PayTR iframe API integration helper.
// Docs: https://dev.paytr.com/iframe-api

import crypto from "crypto";

interface CreateTokenInput {
  merchantOid: string;
  email: string;
  amountKurus: number; // PayTR expects amount in kurus (1 TL = 100)
  userName: string;
  userAddress: string;
  userPhone: string;
  basket: Array<[string, string, number]>; // [name, price, qty]
  userIp: string;
  okUrl: string;
  failUrl: string;
  testMode?: "0" | "1";
  currency?: "TL" | "USD" | "EUR";
}

export interface PaytrTokenResult {
  ok: boolean;
  token?: string;
  raw?: any;
  error?: string;
}

export async function createPaytrToken(input: CreateTokenInput): Promise<PaytrTokenResult> {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  const testMode = input.testMode ?? (process.env.PAYTR_TEST_MODE ?? "1");

  if (!merchantId || !merchantKey || !merchantSalt) {
    return { ok: false, error: "Missing PayTR credentials" };
  }

  const userBasket = Buffer.from(JSON.stringify(input.basket)).toString("base64");

  const noInstallment = "0";
  const maxInstallment = "0";
  const currency = input.currency ?? "TL";

  // hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
  const hashStr =
    merchantId +
    input.userIp +
    input.merchantOid +
    input.email +
    String(input.amountKurus) +
    userBasket +
    noInstallment +
    maxInstallment +
    currency +
    testMode;

  const paytrToken = crypto
    .createHmac("sha256", merchantKey)
    .update(hashStr + merchantSalt)
    .digest("base64");

  const form = new URLSearchParams({
    merchant_id: merchantId,
    user_ip: input.userIp,
    merchant_oid: input.merchantOid,
    email: input.email,
    payment_amount: String(input.amountKurus),
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: "1",
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: input.userName,
    user_address: input.userAddress,
    user_phone: input.userPhone,
    merchant_ok_url: input.okUrl,
    merchant_fail_url: input.failUrl,
    timeout_limit: "30",
    currency,
    test_mode: testMode,
  });

  const res = await fetch("https://www.paytr.com/odeme/api/get-token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  const data = await res.json().catch(() => ({}));
  if (data?.status === "success" && data?.token) {
    return { ok: true, token: data.token, raw: data };
  }
  return { ok: false, error: data?.reason || "PayTR token failed", raw: data };
}

// Verify PayTR webhook callback hash.
// hash = merchant_oid + merchant_salt + status + total_amount, hashed with merchant_key (HMAC SHA256, base64)
export function verifyPaytrCallback(params: {
  merchantOid: string;
  status: string;
  totalAmount: string;
  hash: string;
}): boolean {
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  if (!merchantKey || !merchantSalt) return false;

  const hashStr = params.merchantOid + merchantSalt + params.status + params.totalAmount;
  const expected = crypto
    .createHmac("sha256", merchantKey)
    .update(hashStr)
    .digest("base64");

  return expected === params.hash;
}

export const PAYTR_IFRAME_URL = "https://www.paytr.com/odeme/guvenli/";
