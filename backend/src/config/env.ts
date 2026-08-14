import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/civicfix",
  otpSecret: process.env.OTP_SECRET || "civicfix_whatsapp_otp_secure_key_2026",

  geminiApiKey: process.env.GEMINI_API_KEY || "",
  appUrl: process.env.APP_URL || "",

  metaWhatsappToken: process.env.META_WHATSAPP_TOKEN || process.env.WHATSAPP_TOKEN || "",
  metaPhoneNumberId: process.env.META_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  whatsappTemplateName: process.env.WHATSAPP_TEMPLATE_NAME || "civicfix_otp_verification",
  whatsappTemplateLang: process.env.WHATSAPP_TEMPLATE_LANG || "en_US",

  twilioSid: process.env.TWILIO_ACCOUNT_SID || "",
  twilioToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioWhatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || "",

  razorpayKey: process.env.RAZORPAY_KEY || "",
  cloudinaryUrl: process.env.CLOUDINARY_URL || "",

  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
};