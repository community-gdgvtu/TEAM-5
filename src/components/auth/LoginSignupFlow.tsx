import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { Role, UserProfile, LocationData } from "../../types";
import { ROLE_CONFIGS, COUNTRY_CODES } from "../../data/roleConfig";
import { LocationPicker } from "../ui/location-picker";
import AuroraBackground from "../ui/aurora-background";
import CivicosMascot from "./CivicosMascot";
import { sendWhatsAppOtp, verifyWhatsAppOtp } from "../../api/authApi";
import {
  UserCheck,
  Building2,
  HardHat,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Info,
  X,
} from "lucide-react";

const ROLE_ICONS: Record<string, React.ElementType> = {
  citizen: UserCheck,
  organization: Building2,
  worker: HardHat,
  investor: TrendingUp,
};

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const mapGoogleUserToRole = (email: string): { role: Role; reason: string } => {
  const lower = email.toLowerCase();
  if (lower.includes("gov") || lower.includes("municipal") || lower.includes("official") || lower.includes("admin")) {
    return { role: "organization", reason: "Government / Municipal Domain detected" };
  }
  if (lower.includes("worker") || lower.includes("contractor") || lower.includes("build") || lower.includes("infra")) {
    return { role: "worker", reason: "Infrastructure / Contractor Partner domain" };
  }
  if (lower.includes("audit") || lower.includes("vigilance") || lower.includes("inspector") || lower.includes("investor") || lower.includes("fund")) {
    return { role: "investor", reason: "Civic Audit Body / Impact Investor domain" };
  }
  return { role: "citizen", reason: "Standard Active Citizen domain" };
};

export const LoginSignupFlow: React.FC = () => {
  const { t, theme, toggleTheme, language, setLanguage, setCurrentUser } = useApp();

  // Google Auth State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState("");
  const [selectedGoogleProfile, setSelectedGoogleProfile] = useState<{
    name: string;
    email: string;
    avatar: string;
    role: Role;
    reason: string;
  } | null>(null);

  // Form State
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<string>("24");
  const [location, setLocation] = useState<LocationData>({
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
  });
  const [selectedRole, setSelectedRole] = useState<Role>("citizen");

  // Supplementary Fields
  const [organizationRegId, setOrganizationRegId] = useState("");
  const [organizationType, setOrganizationType] = useState("Municipal Corporation");
  const [workerSkillCategory, setWorkerSkillCategory] = useState("Road & Pavement Repairs");
  const [workerLicenseId, setWorkerLicenseId] = useState("");
  const [investorEntityName, setInvestorEntityName] = useState("");
  const [investorKycStatus, setInvestorKycStatus] = useState("Verified Individual");

  // Motion accessibility preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Validation & Error States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSentNotice, setOtpSentNotice] = useState("");
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [returningUserName, setReturningUserName] = useState("");
  const [resendCountdown, setResendCountdown] = useState(45);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Active Aurora background gradient colors based on role selection
  const activeRoleConfig = ROLE_CONFIGS[selectedRole];
  const auroraGradientColors: [string, string] =
    step >= 3 && activeRoleConfig
      ? activeRoleConfig.auroraColors
      : ["rgba(168,85,247,0.25)", "rgba(79,70,229,0.25)"];

  // Real-time phone format validation helper
  const cleanMobileDigits = mobileNumber.replace(/\D/g, "");
  const isValidPhone = cleanMobileDigits.length >= 8 && cleanMobileDigits.length <= 12;

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name.";
    }

    if (!cleanMobileDigits) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!isValidPhone) {
      newErrors.mobileNumber = "Please enter a valid mobile number format.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const numAge = parseInt(age, 10);
    if (isNaN(numAge) || numAge < 18) {
      newErrors.age = "Minimum age requirement is 18 years for civic & financial participation.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!location.city.trim()) {
      newErrors.city = "City is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // One-click demo login — creates a demo Investor account and enters the investor dashboard.
  const handleDemoInvestorLogin = () => {
    const demoUser: UserProfile = {
      id: `usr_demo_investor_${Date.now()}`,
      name: "Global Impact Fund",
      mobile: "9876500004",
      countryCode: "+91",
      email: "invest@esgfund.org",
      age: 30,
      location: { city: "Mumbai", state: "Maharashtra", country: "India" },
      role: "investor",
      verifiedWhatsApp: true,
      createdAt: new Date().toISOString(),
      supplementaryData: {
        investorEntityName: "Global Impact Fund",
        investorKycStatus: "Verified ESG Fund",
      },
    };
    setCurrentUser(demoUser);
  };

  // Check if number exists on server before requesting OTP
  const checkNumberAndProceed = async () => {
    if (!validateStep1()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/check-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: cleanMobileDigits, countryCode }),
      });
      const data = await res.json();

      if (data.exists && data.user) {
        setIsReturningUser(true);
        setReturningUserName(data.user.name);
        if (data.user.role) {
          setSelectedRole(data.user.role);
        }
        // Jump straight to OTP verification (Step 4) for returning users!
        await handleTriggerSendOtp(true);
        setStep(4);
      } else {
        setIsReturningUser(false);
        setStep(2);
      }
    } catch (err) {
      // Fallback
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger Send WhatsApp OTP API
  const handleTriggerSendOtp = async (isReturning = isReturningUser) => {
    setIsSubmitting(true);
    setOtpError(null);
    setDevOtpCode(null);

    try {
      const res = await sendWhatsAppOtp({
        phoneNumber: cleanMobileDigits,
        countryCode,
        isReturning,
        role: selectedRole,
      });

      if (!res.success) {
        setOtpError(res.message || "We couldn't send your code — please check your number and try again.");
        return;
      }

      if (res.devOtp) {
        setDevOtpCode(res.devOtp);
      }

      setOtpSentNotice(res.maskedPhone || `${countryCode} ***** **${cleanMobileDigits.slice(-3)}`);
      setResendCountdown(45);
      setResendAttempts((prev) => prev + 1);
      setOtpDigits(["", "", "", "", "", ""]);
      if (otpInputRefs.current[0]) {
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      setOtpError("We couldn't send your code — please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP Countdown Timer
  useEffect(() => {
    if (step === 4 && resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendCountdown]);

  // Handle OTP digit input auto-advance
  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);
    setOtpError(null);

    // Auto advance focus
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto verify when all 6 digits are typed
    if (newDigits.every((d) => d !== "") && index === 5) {
      handleVerifyOtp(newDigits.join(""));
    }
  };

  // Handle pasting full 6-digit OTP code
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
      handleVerifyOtp(pastedData);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP Server Call
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const fullCode = codeToVerify || otpDigits.join("");
    if (fullCode.length !== 6) {
      setOtpError("Please enter all 6 digits of the code sent to your WhatsApp.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const res = await verifyWhatsAppOtp({
        phoneNumber: cleanMobileDigits,
        countryCode,
        code: fullCode,
        userData: {
          name: fullName,
          email,
          age: parseInt(age, 10) || 24,
          location,
          role: selectedRole,
          supplementaryData: {
            organizationRegId,
            organizationType,
            workerSkillCategory,
            workerLicenseId,
            investorEntityName,
            investorKycStatus,
          },
        },
      });

      if (!res.success || !res.user) {
        setOtpError(res.message || t("otpErrorMismatch"));
        setIsVerifyingOtp(false);
        return;
      }

      setVerificationSuccess(true);
      setTimeout(() => {
        setCurrentUser(res.user as UserProfile);
      }, 1200);
    } catch (err) {
      setOtpError("Connection error while verifying code.");
      setIsVerifyingOtp(false);
    }
  };

  return (
    <AuroraBackground gradientColors={auroraGradientColors} theme={theme} ariaLabel="Civic Fix Auth Shell">
      <div className="w-full max-w-xl mx-auto z-10 flex flex-col items-center">
        {/* Header Bar with Language & Dark/Light Theme Toggle */}
        <div className="w-full flex items-center justify-between mb-6 px-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-900/40">
              CF
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                <span>{t("appTitle")}</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  v2.4
                </span>
              </h1>
              <p className="text-xs text-slate-300 hidden sm:block">{t("appSubtitle")}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="pl-8 pr-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="es">Español</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              title="Toggle Dark / Light Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
            </button>
          </div>
        </div>

        {/* Multi-Step Progress Bar Indicator */}
        <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 mb-6 shadow-xl">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-2.5 px-1">
            <span className="text-purple-300 font-semibold flex items-center space-x-1.5">
              <span>Step {step} of 4:</span>
              <span className="text-white">
                {step === 1 && t("step1Title")}
                {step === 2 && t("step2Title")}
                {step === 3 && t("step3Title")}
                {step === 4 && t("step4Title")}
              </span>
            </span>
            <span className="text-slate-400 text-[11px] font-mono">{step * 25}%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full"
              initial={{ width: "25%" }}
              animate={{ width: `${step * 25}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          <div className="grid grid-cols-4 gap-1 mt-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`text-[10px] font-medium text-center py-1 rounded-md transition-colors ${
                  step === i
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold"
                    : step > i
                    ? "text-emerald-400"
                    : "text-slate-500"
                }`}
              >
                {i === 1 && "1. Details"}
                {i === 2 && "2. Location"}
                {i === 3 && "3. Role"}
                {i === 4 && "4. WhatsApp"}
              </div>
            ))}
          </div>
        </div>

        {/* CIVICOS Mascot AI Guide */}
        <div className="w-full flex justify-end mb-1">
          <CivicosMascot
            currentStep={step}
            isReturningUser={isReturningUser}
            userName={returningUserName}
          />
        </div>

        {/* Main Oscillating Form Card Shell */}
        <motion.div
          className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden"
          animate={
            prefersReducedMotion
              ? { y: 0, rotate: 0 }
              : {
                  y: [-5, 5, -5],
                  rotate: [-0.6, 0.6, -0.6],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          <AnimatePresence mode="wait">
            {/* STEP 1: YOUR DETAILS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <span>{t("step1Title")}</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t("step1Desc")}</p>
                </div>

                {/* Google Quick Sign-In Option */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsGoogleModalOpen(true)}
                    aria-label="Sign in with Google account with automatic role assignment"
                    className="w-full py-2.5 px-4 bg-slate-950/90 hover:bg-slate-900 border border-slate-700/90 hover:border-purple-500/50 text-slate-100 font-medium rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center space-x-2.5 transition-all group cursor-pointer"
                  >
                    <GoogleIcon />
                    <span className="group-hover:text-purple-200 transition-colors">{t("signInWithGoogle")}</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded-full border border-purple-500/30 ml-1">
                      1-Click Auto Role
                    </span>
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className="bg-slate-900 px-3 text-slate-400 font-bold tracking-wider">
                        {t("orDivider")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* One-Click Demo Investor Login */}
                <div>
                  <button
                    type="button"
                    onClick={handleDemoInvestorLogin}
                    className="w-full p-3.5 rounded-xl bg-purple-600/15 border border-purple-500/40 hover:bg-purple-600/25 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">One-Click Demo Login — Investor</div>
                          <div className="text-[11px] text-slate-400">Creates a demo account · skips OTP · opens Investor dashboard</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  </button>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="full-name-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("fullName")} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="full-name-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: "" });
                    }}
                    placeholder={t("fullNamePlaceholder")}
                    aria-label="Full Name"
                    aria-required="true"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "fullname-error" : undefined}
                    className={`w-full px-3.5 py-2.5 bg-slate-950/80 border ${
                      errors.fullName ? "border-rose-500" : "border-slate-700/80"
                    } rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                  />
                  {errors.fullName && (
                    <p id="fullname-error" className="text-xs text-rose-400 mt-1 flex items-center space-x-1" role="alert">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Mobile Number with Country Code Selector & Real-Time Format Validation */}
                <div>
                  <label htmlFor="mobile-number-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("mobileNumber")} <span className="text-rose-400">*</span>
                    <span className="text-slate-400 font-normal ml-2 text-[11px]">
                      (WhatsApp OTP sent here)
                    </span>
                  </label>
                  <div className="flex space-x-2">
                    {/* Country Code Dropdown */}
                    <select
                      id="country-code-select"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Select Country Code for Phone Number"
                      className="px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.country})
                        </option>
                      ))}
                    </select>

                    {/* Mobile Input */}
                    <div className="relative flex-1">
                      <input
                        id="mobile-number-input"
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => {
                          setMobileNumber(e.target.value);
                          if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: "" });
                        }}
                        placeholder="98765 43210"
                        aria-label="Mobile phone number for WhatsApp verification"
                        aria-required="true"
                        aria-invalid={!!errors.mobileNumber}
                        aria-describedby={errors.mobileNumber ? "mobile-error" : "mobile-hint"}
                        className={`w-full px-3.5 py-2.5 bg-slate-950/80 border ${
                          errors.mobileNumber ? "border-rose-500" : "border-slate-700/80"
                        } rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                      />
                      {cleanMobileDigits.length > 0 && (
                        <div className="absolute right-3 top-2.5">
                          {isValidPhone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              Format
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.mobileNumber ? (
                    <p id="mobile-error" className="text-xs text-rose-400 mt-1 flex items-center space-x-1" role="alert">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.mobileNumber}</span>
                    </p>
                  ) : (
                    <p id="mobile-hint" className="text-[11px] text-slate-400 mt-1.5 flex items-center space-x-1">
                      <Smartphone className="w-3 h-3 text-emerald-400" />
                      <span>OTP will be dispatched directly to your WhatsApp app.</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("email")} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder={t("emailPlaceholder")}
                    aria-label="Email address"
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full px-3.5 py-2.5 bg-slate-950/80 border ${
                      errors.email ? "border-rose-500" : "border-slate-700/80"
                    } rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-rose-400 mt-1 flex items-center space-x-1" role="alert">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Age with Minimum 18+ Inline Warning */}
                <div>
                  <label htmlFor="age-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("age")} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="age-input"
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (errors.age) setErrors({ ...errors, age: "" });
                    }}
                    placeholder={t("agePlaceholder")}
                    aria-label="Age in years"
                    aria-required="true"
                    aria-invalid={!!errors.age || parseInt(age, 10) < 18}
                    aria-describedby="age-help"
                    className={`w-full sm:w-36 px-3.5 py-2.5 bg-slate-950/80 border ${
                      errors.age || parseInt(age, 10) < 18 ? "border-amber-500" : "border-slate-700/80"
                    } rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                  />
                  {parseInt(age, 10) < 18 ? (
                    <div id="age-help" className="mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-2">
                      <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{t("ageHelpMessage")}</span>
                    </div>
                  ) : (
                    <p id="age-help" className="text-[11px] text-slate-400 mt-1">
                      Civic Fix requires 18+ for legal accountability and escrow authorizations.
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={checkNumberAndProceed}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Checking Mobile Number...</span>
                      </>
                    ) : (
                      <>
                        <span>{t("continueBtn")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: WHERE YOU'RE BASED */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <span>{t("step2Title")}</span>
                    <Globe className="w-4 h-4 text-indigo-400" />
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t("step2Desc")}</p>
                </div>

                {/* Shared Location Picker Component */}
                <LocationPicker value={location} onChange={setLocation} t={t} />

                {errors.city && <p className="text-xs text-rose-400">{errors.city}</p>}

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-sm flex items-center space-x-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("backBtn")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep2()) setStep(3);
                    }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
                  >
                    <span>{t("continueBtn")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: WHO YOU ARE (ROLE SELECTOR + SUPPLEMENTARY FIELDS) */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <span>{t("step3Title")}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t("step3Desc")}</p>
                </div>

                {/* Visual Role Option Cards with Color Accents & Full ARIA Accessibility */}
                <div
                  role="radiogroup"
                  aria-label="Select your platform role"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {(Object.keys(ROLE_CONFIGS) as Role[]).map((roleKey) => {
                    const cfg = ROLE_CONFIGS[roleKey];
                    const IconComp = ROLE_ICONS[roleKey] || UserCheck;
                    const isSelected = selectedRole === roleKey;

                    return (
                      <motion.button
                        key={roleKey}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        aria-label={`${cfg.title}: ${cfg.shortDesc}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole(roleKey)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedRole(roleKey);
                          }
                        }}
                        className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between relative overflow-hidden cursor-pointer ${
                          isSelected
                            ? `bg-slate-900 border-2 shadow-lg ${cfg.borderColor}`
                            : "bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100"
                        }`}
                        style={{
                          boxShadow: isSelected ? `0 0 20px ${cfg.accentColor}33` : undefined,
                        }}
                      >
                        {/* Top Icon & Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: `${cfg.accentColor}22` }}
                          >
                            <IconComp className="w-4 h-4" style={{ color: cfg.accentColor }} />
                          </div>
                          {isSelected && (
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${cfg.accentColor}33`, color: cfg.accentColor }}
                            >
                              Selected
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-100 text-sm mb-1">{cfg.title}</h3>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{cfg.shortDesc}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Role-Specific Supplementary Fields Expansion */}
                <div className="pt-2">
                  <AnimatePresence mode="wait">
                    {selectedRole === "organization" && (
                      <motion.div
                        key="orgFields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-blue-950/30 border border-blue-900/50 rounded-xl space-y-3"
                      >
                        <div className="text-xs font-semibold text-blue-300">Organization Details:</div>
                        <div>
                          <label htmlFor="org-reg-id" className="block text-xs text-slate-300 mb-1">
                            {t("regIdLabel")}
                          </label>
                          <input
                            id="org-reg-id"
                            type="text"
                            value={organizationRegId}
                            onChange={(e) => setOrganizationRegId(e.target.value)}
                            placeholder="e.g. MC-MUM-2026-99"
                            aria-label="Organization Registration ID"
                            className="w-full px-3 py-2 bg-slate-950 border border-blue-900/60 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="org-type-select" className="block text-xs text-slate-300 mb-1">
                            {t("orgTypeLabel")}
                          </label>
                          <select
                            id="org-type-select"
                            value={organizationType}
                            onChange={(e) => setOrganizationType(e.target.value)}
                            aria-label="Organization Type"
                            className="w-full px-3 py-2 bg-slate-950 border border-blue-900/60 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                          >
                            <option value="Municipal Corporation">Municipal Corporation</option>
                            <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                            <option value="Registered Civic NGO">Registered Civic NGO</option>
                            <option value="Community Resident Welfare Assoc">Resident Welfare Assoc (RWA)</option>
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {selectedRole === "worker" && (
                      <motion.div
                        key="workerFields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-orange-950/30 border border-orange-900/50 rounded-xl space-y-3"
                      >
                        <div className="text-xs font-semibold text-orange-300">Contractor / Worker Profile:</div>
                        <div>
                          <label htmlFor="worker-skill-select" className="block text-xs text-slate-300 mb-1">
                            {t("skillCategoryLabel")}
                          </label>
                          <select
                            id="worker-skill-select"
                            value={workerSkillCategory}
                            onChange={(e) => setWorkerSkillCategory(e.target.value)}
                            aria-label="Worker Skill Category"
                            className="w-full px-3 py-2 bg-slate-950 border border-orange-900/60 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none cursor-pointer"
                          >
                            <option value="Road & Pavement Repairs">Road & Pavement Repairs</option>
                            <option value="Electrical & Streetlight Fixes">Electrical & Streetlight Fixes</option>
                            <option value="Sanitation & Drainage">Sanitation & Drainage</option>
                            <option value="Park Maintenance & Horticulture">Park Maintenance</option>
                            <option value="General Civil Works">General Civil Works</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="worker-license-id" className="block text-xs text-slate-300 mb-1">
                            {t("licenseLabel")}
                          </label>
                          <input
                            id="worker-license-id"
                            type="text"
                            value={workerLicenseId}
                            onChange={(e) => setWorkerLicenseId(e.target.value)}
                            placeholder="e.g. TR-5582910"
                            aria-label="Worker Trade License ID"
                            className="w-full px-3 py-2 bg-slate-950 border border-orange-900/60 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    {selectedRole === "investor" && (
                      <motion.div
                        key="investorFields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-purple-950/30 border border-purple-900/50 rounded-xl space-y-3"
                      >
                        <div className="text-xs font-semibold text-purple-300">Investor / Funder Details:</div>
                        <div>
                          <label htmlFor="investor-entity-id" className="block text-xs text-slate-300 mb-1">
                            {t("entityLabel")}
                          </label>
                          <input
                            id="investor-entity-id"
                            type="text"
                            value={investorEntityName}
                            onChange={(e) => setInvestorEntityName(e.target.value)}
                            placeholder="e.g. Urban Renewal Fund / Individual"
                            aria-label="Investor Entity Name"
                            className="w-full px-3 py-2 bg-slate-950 border border-purple-900/60 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="investor-kyc-select" className="block text-xs text-slate-300 mb-1">
                            {t("kycLabel")}
                          </label>
                          <select
                            id="investor-kyc-select"
                            value={investorKycStatus}
                            onChange={(e) => setInvestorKycStatus(e.target.value)}
                            aria-label="Investor KYC Status"
                            className="w-full px-3 py-2 bg-slate-950 border border-purple-900/60 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none cursor-pointer"
                          >
                            <option value="Verified Individual">Verified Individual Investor</option>
                            <option value="Institutional CSR Fund">Institutional CSR Fund</option>
                            <option value="Civic Impact Angel">Civic Impact Angel</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-sm flex items-center space-x-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("backBtn")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await handleTriggerSendOtp(false);
                      setStep(4);
                    }}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t("sendingOtpBtn")}</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        <span>{t("sendOtpBtn")}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: VERIFY WHATSAPP OTP */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Notice Banner */}
                {isReturningUser ? (
                  <div className="p-3.5 bg-purple-950/40 border border-purple-500/40 rounded-xl flex items-center space-x-3" role="status" aria-live="polite">
                    <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {t("welcomeBack", { name: returningUserName || fullName })}
                      </div>
                      <div className="text-xs text-purple-200">
                        {t("welcomeBackDesc", { role: selectedRole })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                      <span>{t("step4Title")}</span>
                      <motion.div
                        animate={{ scale: [1, 1.12, 1], rotate: [0, 5, 0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      >
                        <Smartphone className="w-5 h-5" />
                      </motion.div>
                    </h2>
                    <p className="text-xs text-slate-300 mt-1" role="status" aria-live="polite">
                      {t("otpSentNotice", { number: otpSentNotice || `${countryCode} ***** **${cleanMobileDigits.slice(-3)}` })}
                    </p>
                  </div>
                )}

                {/* Demo / Sandbox Mode OTP Notification Banner (when no Meta/Twilio API key configured) */}
                {devOtpCode && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-purple-950/70 border border-purple-500/60 rounded-xl flex items-center justify-between text-xs text-purple-200 shadow-lg shadow-purple-950/50"
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
                      <div>
                        <span className="font-bold text-white">Demo Mode Code: </span>
                        <span className="font-mono text-purple-200 font-bold tracking-widest text-sm bg-purple-900/80 px-2 py-0.5 rounded border border-purple-500/40">
                          {devOtpCode}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const digits = devOtpCode.split("");
                        setOtpDigits(digits);
                        handleVerifyOtp(devOtpCode);
                      }}
                      aria-label={`Auto-fill verification code ${devOtpCode}`}
                      className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg text-[11px] shadow transition-all cursor-pointer"
                    >
                      Auto-Fill & Verify
                    </button>
                  </motion.div>
                )}

                {/* OTP Digit Input Boxes */}
                <div className="space-y-3">
                  <label htmlFor="otp-digit-0" className="block text-xs font-semibold text-slate-300 text-center">
                    {t("otpInputLabel")}
                  </label>

                  <div className="flex justify-center items-center space-x-2 sm:space-x-3" role="group" aria-label="6-digit verification code input">
                    {otpDigits.map((digit, idx) => (
                      <motion.input
                        key={idx}
                        id={`otp-digit-${idx}`}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        whileFocus={{ scale: 1.05 }}
                        aria-label={`Digit ${idx + 1} of 6-digit verification code`}
                        className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl font-bold rounded-xl border bg-slate-950/90 text-white focus:outline-none transition-all ${
                          otpError
                            ? "border-rose-500 text-rose-300"
                            : digit
                            ? "border-emerald-500 bg-emerald-950/20 text-emerald-200"
                            : "border-slate-700/80 focus:border-purple-500"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 text-center font-mono">{t("pasteHint")}</p>
                </div>

                {/* Inline Error Message */}
                {otpError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{otpError}</span>
                  </motion.div>
                )}

                {/* Success Banner on Verification */}
                {verificationSuccess && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-sm font-semibold flex items-center justify-center space-x-2"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                    <span>WhatsApp Verified! Entering Dashboard...</span>
                  </motion.div>
                )}

                {/* Resend Logic & Countdown Timer Bar */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    aria-label="Back to step 3 to change role or details"
                    className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Role/Details</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    {resendCountdown > 0 && (
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-purple-500 transition-all duration-1000 ease-linear"
                          style={{ width: `${(resendCountdown / 45) * 100}%` }}
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={resendCountdown > 0 || resendAttempts >= 4 || isSubmitting}
                      onClick={() => handleTriggerSendOtp()}
                      aria-label={
                        resendCountdown > 0
                          ? `Resend OTP code available in ${resendCountdown} seconds`
                          : "Resend WhatsApp OTP code"
                      }
                      className={`font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                        resendCountdown > 0 || resendAttempts >= 4
                          ? "text-slate-500 cursor-not-allowed"
                          : "text-purple-400 hover:text-purple-300"
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
                      <span>
                        {resendCountdown > 0
                          ? `${t("resendIn")} ${resendCountdown}s`
                          : resendAttempts >= 4
                          ? t("resendMaxReached")
                          : t("resendOtp")}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Submit Verification Button */}
                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={isVerifyingOtp || verificationSuccess || otpDigits.join("").length !== 6}
                  aria-label="Verify WhatsApp OTP code"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-purple-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-purple-900/40 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isVerifyingOtp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t("verifyingBtn")}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Enter Platform</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Note */}
        <p className="text-[11px] text-slate-400 mt-6 text-center">
          Civic Fix Community Platform • Secured via WhatsApp OTP & Google Authentication
        </p>
      </div>

      {/* GOOGLE SIGN IN MODAL */}
      <AnimatePresence>
        {isGoogleModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="google-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100 overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                aria-label="Close Google Sign-In dialog"
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl shadow-inner">
                  <GoogleIcon />
                </div>
                <div>
                  <h3 id="google-modal-title" className="text-base font-bold text-white">Sign in with Google</h3>
                  <p className="text-xs text-slate-400">
                    Automatic role mapping based on organizational domain
                  </p>
                </div>
              </div>

              {/* Preset Google Accounts */}
              <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1" role="listbox" aria-label="Select Google account">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Select an Account:
                </p>
                {[
                  {
                    name: "Rahul Sharma",
                    email: "rahul.sharma@gmail.com",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                    role: "citizen" as Role,
                    reason: "Standard Active Citizen Domain",
                  },
                  {
                    name: "Dr. Anita Roy",
                    email: "anita.roy@mumbai.gov.in",
                    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
                    role: "organization" as Role,
                    reason: "Government / Municipal Domain (@mumbai.gov.in)",
                  },
                  {
                    name: "Vikram Construction",
                    email: "contact@vikraminfra.com",
                    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80",
                    role: "worker" as Role,
                    reason: "Infrastructure Partner (@vikraminfra.com)",
                  },
                  {
                    name: "Audit & Vigilance Board",
                    email: "audit@vigilance.gov.in",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
                    role: "investor" as Role,
                    reason: "Civic Audit Body (@vigilance.gov.in)",
                  },
                  {
                    name: "Global Impact Fund",
                    email: "invest@esgfund.org",
                    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
                    role: "investor" as Role,
                    reason: "ESG & Impact Investor Domain (@esgfund.org)",
                  },
                ].map((acc) => {
                  const roleCfg = ROLE_CONFIGS[acc.role];
                  const IconComp = ROLE_ICONS[acc.role] || UserCheck;
                  const isSelected = selectedGoogleProfile?.email === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      aria-label={`Sign in as ${acc.name}, email ${acc.email}`}
                      onClick={() =>
                        setSelectedGoogleProfile({
                          name: acc.name,
                          email: acc.email,
                          avatar: acc.avatar,
                          role: acc.role,
                          reason: acc.reason,
                        })
                      }
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-purple-900/30 border-purple-500 shadow-md"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{acc.name}</p>
                          <p className="text-[11px] text-slate-400">{acc.email}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleCfg.badgeBg} text-white ${roleCfg.borderColor}`}
                        >
                          <IconComp className="w-3 h-3" />
                          <span>{roleCfg.title}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Google Email Input with Realtime Auto-Mapping */}
              <div className="pt-2 border-t border-slate-800">
                <label htmlFor="google-custom-email-input" className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Or Enter Any Google Email:
                </label>
                <div className="flex space-x-2">
                  <input
                    id="google-custom-email-input"
                    type="email"
                    value={googleCustomEmail}
                    onChange={(e) => {
                      const val = e.target.value;
                      setGoogleCustomEmail(val);
                      if (val.trim() && val.includes("@")) {
                        const mapped = mapGoogleUserToRole(val);
                        setSelectedGoogleProfile({
                          name: val.split("@")[0].replace(".", " "),
                          email: val,
                          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
                          role: mapped.role,
                          reason: mapped.reason,
                        });
                      }
                    }}
                    placeholder="e.g. officer@mumbai.gov.in"
                    aria-label="Custom Google Email Address"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              {/* Selected Mapping Summary */}
              {selectedGoogleProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-purple-300 font-semibold text-[11px]">
                      Auto-assigned Role:
                    </span>
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Domain Verified</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-white font-bold text-sm">
                    <span>{ROLE_CONFIGS[selectedGoogleProfile.role]?.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedGoogleProfile.reason}
                  </p>
                </motion.div>
              )}

              {/* Confirm Sign-In Button */}
              <div className="mt-5">
                <button
                  type="button"
                  disabled={!selectedGoogleProfile}
                  onClick={() => {
                    if (selectedGoogleProfile) {
                      const newUser: UserProfile = {
                        id: `usr_g_${Date.now()}`,
                        name: selectedGoogleProfile.name,
                        mobile: "Google Auth",
                        countryCode: "+1",
                        email: selectedGoogleProfile.email,
                        age: 26,
                        location,
                        role: selectedGoogleProfile.role,
                        verifiedWhatsApp: true,
                        createdAt: new Date().toISOString(),
                        supplementaryData: {
                          organizationType: selectedGoogleProfile.role === "organization" ? "Municipal Corporation" : undefined,
                          workerSkillCategory: selectedGoogleProfile.role === "worker" ? "Road & Pavement Repairs" : undefined,
                          investorKycStatus: selectedGoogleProfile.role === "investor" ? "Verified ESG Fund" : undefined,
                        },
                      };
                      setCurrentUser(newUser);
                      setIsGoogleModalOpen(false);
                    }
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <GoogleIcon />
                  <span>
                    {selectedGoogleProfile
                      ? `Continue as ${selectedGoogleProfile.name} (${ROLE_CONFIGS[selectedGoogleProfile.role]?.title})`
                      : "Select an account to continue"}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuroraBackground>
  );
};
