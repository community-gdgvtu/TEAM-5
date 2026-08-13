export interface SendOtpParams {
  phoneNumber: string;
  countryCode?: string;
  isReturning?: boolean;
  role?: string;
}

export interface SendOtpResult {
  success: boolean;
  maskedPhone: string;
  message: string;
  isReturning?: boolean;
  existingName?: string;
  existingRole?: string;
  devOtp?: string;
  provider?: string;
  errorCode?: string | number;
}

export interface VerifyOtpParams {
  phoneNumber: string;
  countryCode?: string;
  code: string;
  userData?: {
    name?: string;
    email?: string;
    age?: number;
    location?: { city: string; state: string; country: string };
    role?: string;
    supplementaryData?: Record<string, any>;
  };
}

export interface VerifyOtpResult {
  success: boolean;
  token?: string;
  user?: any;
  message: string;
}

export async function sendWhatsAppOtp(params: SendOtpParams): Promise<SendOtpResult> {
  const { phoneNumber, countryCode = "+91", isReturning = false, role = "citizen" } = params;

  try {
    const response = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phoneNumber, countryCode, isReturning, role }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        success: false,
        maskedPhone: data.maskedPhone || `${countryCode} ***** **${phoneNumber.replace(/\D/g, "").slice(-3)}`,
        message: data.error || "Failed to dispatch WhatsApp OTP. Please check your mobile number.",
        provider: data.provider,
        errorCode: data.errorCode,
      };
    }

    return {
      success: true,
      maskedPhone: data.maskedPhone || `${countryCode} ***** **${phoneNumber.replace(/\D/g, "").slice(-3)}`,
      message: "WhatsApp verification code dispatched successfully.",
      isReturning: data.isReturning,
      existingName: data.existingName,
      existingRole: data.existingRole,
      devOtp: data.devOtp,
      provider: data.provider,
    };
  } catch (error: any) {
    return {
      success: false,
      maskedPhone: `${countryCode} ***** **${phoneNumber.replace(/\D/g, "").slice(-3)}`,
      message: error.message || "Network error while contacting WhatsApp API gateway. Please try again.",
    };
  }
}

export async function verifyWhatsAppOtp(params: VerifyOtpParams): Promise<VerifyOtpResult> {
  const { phoneNumber, countryCode = "+91", code, userData } = params;

  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phoneNumber, countryCode, code, userData }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        success: false,
        message: data.error || "Verification failed. Please check your 6-digit code.",
      };
    }

    return {
      success: true,
      token: data.token || `civicfix_session_${Date.now()}`,
      user: data.user,
      message: "WhatsApp number verified successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error during OTP verification. Please try again.",
    };
  }
}