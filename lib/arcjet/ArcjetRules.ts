import arcjet, {
  detectBot, fixedWindow, shield, 
  validateEmail
} from "@arcjet/next";

// Available rules may vary from the plan you choose https://arcjet.com/pricing

export const emailValidationAj = arcjet({
  key: process.env.ARCJET_KEY!,
  // About characteristics: https://docs.arcjet.com/architecture/#built-in-characteristics
  characteristics: ["ip.src"],
  rules: [
    validateEmail({
      mode: "LIVE",
      deny: ["DISPOSABLE", "INVALID"]
    })
  ],
});

export const genericValidationAj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    /*
    Not included in free plan: https://docs.arcjet.com/sensitive-info/reference
    Sensitive information detection is not supported in server actions because Next.js does not provide access to the request body.
    You can use the redact utility instead: https://docs.arcjet.com/redact/quick-start
    sensitiveInfo({
      mode: "LIVE",
      deny: ["CREDIT_CARD_NUMBER", "IP_ADDRESS", "PHONE_NUMBER"]
    }),*/
    fixedWindow({
      mode: "LIVE",
      window: '1h',
      max: 100
    }),
    /*slidingWindow({
      mode: "LIVE", 
      interval: 60,
      max: 10, 
    }),*/
  ],
});