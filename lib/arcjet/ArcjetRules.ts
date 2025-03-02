import arcjet, {
  detectBot, fixedWindow, sensitiveInfo, shield, 
  validateEmail
} from "@arcjet/next";

export const emailValidationAj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    validateEmail({
      mode: "LIVE",
      deny: ["DISPOSABLE", "INVALID"]
    })
  ],
});

export const genericValidationAj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    sensitiveInfo({
      mode: "LIVE",
      deny: ["CREDIT_CARD_NUMBER", "IP_ADDRESS", "PHONE_NUMBER"]
    }),
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