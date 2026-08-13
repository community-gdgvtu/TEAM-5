export interface E164PhoneResult {
  isValid: boolean;
  e164: string;
  countryCode: string;
  nationalDigits: string;
  e164WithoutPlus: string;
  error?: string;
}

/**
 * Standardizes raw mobile input and country code into canonical E.164 international format.
 * E.164 rules:
 * - Must start with '+' followed by 7 to 15 digits total.
 * - Handles leading zeros in national trunk prefixes (e.g. UK "07911..." -> "+447911...").
 * - Handles raw input already containing full E.164 prefix or spaces/dashes.
 */
export function normalizeToE164(rawMobile: string, rawCountryCode: string = "+91"): E164PhoneResult {
  if (!rawMobile || typeof rawMobile !== "string") {
    return {
      isValid: false,
      e164: "",
      countryCode: "",
      nationalDigits: "",
      e164WithoutPlus: "",
      error: "Mobile phone number is required.",
    };
  }

  let ccDigits = rawCountryCode.replace(/\D/g, "");
  if (!ccDigits) ccDigits = "91";
  const formattedCountryCode = `+${ccDigits}`;

  const trimmedMobile = rawMobile.trim();
  let e164 = "";

  if (trimmedMobile.startsWith("+")) {
    const digitsOnly = trimmedMobile.replace(/\D/g, "");
    e164 = `+${digitsOnly}`;
  } else if (trimmedMobile.startsWith("00")) {
    const digitsOnly = trimmedMobile.slice(2).replace(/\D/g, "");
    e164 = `+${digitsOnly}`;
  } else {
    let nationalDigits = trimmedMobile.replace(/\D/g, "");

    if (nationalDigits.startsWith("0") && nationalDigits.length > 5) {
      nationalDigits = nationalDigits.slice(1);
    }

    if (nationalDigits.startsWith(ccDigits) && nationalDigits.length >= ccDigits.length + 7) {
      e164 = `+${nationalDigits}`;
    } else {
      e164 = `+${ccDigits}${nationalDigits}`;
    }
  }

  const digitsOnlyTotal = e164.replace(/\D/g, "");

  if (digitsOnlyTotal.length < 7 || digitsOnlyTotal.length > 15) {
    return {
      isValid: false,
      e164: "",
      countryCode: formattedCountryCode,
      nationalDigits: rawMobile.replace(/\D/g, ""),
      e164WithoutPlus: "",
      error: `Invalid international phone number format (${e164 || rawMobile}). Phone numbers must contain 7 to 15 digits in E.164 format (e.g. +919876543210 or +14155552671).`,
    };
  }

  let nationalDigits = digitsOnlyTotal;
  if (digitsOnlyTotal.startsWith(ccDigits)) {
    nationalDigits = digitsOnlyTotal.slice(ccDigits.length);
  }

  return {
    isValid: true,
    e164,
    countryCode: formattedCountryCode,
    nationalDigits,
    e164WithoutPlus: digitsOnlyTotal,
  };
}

export function maskPhoneNumber(phoneResult: E164PhoneResult): string {
  if (!phoneResult.isValid) return phoneResult.e164 || "Invalid Number";
  const national = phoneResult.nationalDigits;
  if (national.length <= 4) {
    return `${phoneResult.countryCode} *****`;
  }
  const last3 = national.slice(-3);
  return `${phoneResult.countryCode} ***** **${last3}`;
}