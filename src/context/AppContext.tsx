import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, Language } from "../types";

const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: "Civic Fix",
    appSubtitle: "Community Issue Resolution & Civic Engagement Platform",
    step1Title: "Your Details",
    step1Desc: "Basic profile information",
    step2Title: "Where You're Based",
    step2Desc: "Location and jurisdiction",
    step3Title: "Who You Are",
    step3Desc: "Select your role on Civic Fix",
    step4Title: "Verify WhatsApp",
    step4Desc: "One-time OTP verification",
    
    fullName: "Full Name",
    fullNamePlaceholder: "e.g. Ananya Sharma",
    mobileNumber: "Mobile Number",
    mobilePlaceholder: "98765 43210",
    email: "Email",
    emailPlaceholder: "ananya@example.com",
    age: "Age",
    agePlaceholder: "25",
    ageHelpMessage: "Must be 18+ for financial contributions, contracts, and escrow responsibilities.",
    
    city: "City",
    state: "State",
    country: "Country",
    searchLocation: "Search City / Municipality...",
    
    citizenTitle: "Citizen",
    citizenDesc: "I live here and want to report or fund local repairs.",
    organizationTitle: "Organization",
    organizationDesc: "Municipal body or civic organization managing public projects.",
    workerTitle: "Worker",
    workerDesc: "Local handyman, contractor, or technician bidding for repairs.",
    investorTitle: "Investor",
    investorDesc: "Individual or entity funding high-impact civic infrastructure.",
    
    regIdLabel: "Organization Registration ID / Govt Code",
    orgTypeLabel: "Organization Type",
    skillCategoryLabel: "Primary Skill Category",
    licenseLabel: "Trade License / Id Proof Number",
    entityLabel: "Investment Entity / Fund Name",
    kycLabel: "KYC Verification Status",
    
    continueBtn: "Continue",
    sendOtpBtn: "Send WhatsApp OTP",
    backBtn: "Back",
    verifyingBtn: "Verifying Code...",
    sendingOtpBtn: "Sending WhatsApp OTP...",
    resendOtp: "Resend OTP",
    resendIn: "Resend available in",
    resendMaxReached: "Maximum resends reached for this number.",
    
    welcomeBack: "Welcome back, {name}",
    welcomeBackDesc: "Verifying your identity on Civic Fix as a {role}",
    otpSentNotice: "We've sent a 6-digit verification code to your WhatsApp at {number}",
    otpInputLabel: "Enter 6-Digit WhatsApp OTP",
    otpErrorMismatch: "That code didn't match — please try again.",
    otpErrorExpired: "The verification code has expired. Please request a new one.",
    pasteHint: "Paste 6-digit code or type directly",
    
    dashboardTitle: "Welcome to Civic Fix",
    verifiedBadge: "WhatsApp Identity Verified",
    logout: "Log Out",

    signInWithGoogle: "Sign in with Google",
    orDivider: "OR",
    googleAuthSuccess: "Signed in with Google as",
    autoMappedRole: "Auto-assigned Role",

    mascotStep1: "Let's start with the basics — this only takes a minute.",
    mascotStep2: "Where are you based? This helps us show you what's happening nearby.",
    mascotStep3: "Tell me who you are so I can set things up right for you.",
    mascotStep4: "Check your WhatsApp — I've sent you a code!",
    mascotWelcomeBack: "Welcome back{name}! Check WhatsApp for your quick 6-digit access code.",
  },
  hi: {
    appTitle: "सिविक फिक्स",
    appSubtitle: "नागरिक समस्या निवारण एवं सहभागिता मंच",
    step1Title: "आपका विवरण",
    step1Desc: "मूल प्रोफ़ाइल जानकारी",
    step2Title: "आपका स्थान",
    step2Desc: "शहर एवं अधिकार क्षेत्र",
    step3Title: "आपकी भूमिका",
    step3Desc: "सिविक फिक्स पर अपनी भूमिका चुनें",
    step4Title: "व्हाट्सएप सत्यापन",
    step4Desc: "वन-टाइम ओटीपी सत्यापन",
    
    fullName: "पूरा नाम",
    fullNamePlaceholder: "उदाहरण: अनन्या शर्मा",
    mobileNumber: "मोबाइल नंबर",
    mobilePlaceholder: "98765 43210",
    email: "ईमेल",
    emailPlaceholder: "ananya@example.com",
    age: "आयु",
    agePlaceholder: "25",
    ageHelpMessage: "वित्तीय योगदान और नागरिक अनुबंधों के लिए आयु 18+ होना आवश्यक है।",
    
    city: "शहर",
    state: "राज्य",
    country: "देश",
    searchLocation: "शहर / नगर पालिका खोजें...",
    
    citizenTitle: "नागरिक",
    citizenDesc: "मैं यहाँ रहता हूँ और स्थानीय मरम्मत की रिपोर्ट या फंडिंग करना चाहता हूँ।",
    organizationTitle: "संस्था / निकाय",
    organizationDesc: "सार्वजनिक परियोजनाओं का प्रबंधन करने वाला नगर निकाय या संगठन।",
    workerTitle: "कार्यकर्ता / ठेकेदार",
    workerDesc: "स्थानीय तकनीशियन, प्लम्बर, या ठेकेदार मरम्मत कार्य हेतु।",
    investorTitle: "निवेशक",
    investorDesc: "नागरिक बुनियादी ढांचे के वित्तपोषण हेतु व्यक्ति या संस्था।",
    
    regIdLabel: "संगठन पंजीकरण आईडी / सरकारी कोड",
    orgTypeLabel: "संगठन का प्रकार",
    skillCategoryLabel: "प्राथमिक कौशल श्रेणी",
    licenseLabel: "व्यापार लाइसेंस / आईडी प्रमाण संख्या",
    entityLabel: "निवेश संस्था / फंड का नाम",
    kycLabel: "केवाईसी सत्यापन स्थिति",
    
    continueBtn: "आगे बढ़ें",
    sendOtpBtn: "व्हाट्सएप ओटीपी भेजें",
    backBtn: "पीछे",
    verifyingBtn: "सत्यापित हो रहा है...",
    sendingOtpBtn: "ओटीपी भेजा जा रहा है...",
    resendOtp: "पुनः ओटीपी भेजें",
    resendIn: "पुनः भेजने का समय",
    resendMaxReached: "अधिकतम पुनः प्रयास पूरे हो चुके हैं।",
    
    welcomeBack: "पुनः स्वागत है, {name}",
    welcomeBackDesc: "सिविक फिक्स पर {role} के रूप में आपकी पहचान का सत्यापन",
    otpSentNotice: "हमने आपके व्हाट्सएप {number} पर 6-अंकों का कोड भेजा है",
    otpInputLabel: "6-अंकों का व्हाट्सएप ओटीपी दर्ज करें",
    otpErrorMismatch: "कोड मेल नहीं खाता — कृपया पुनः प्रयास करें।",
    otpErrorExpired: "ओटीपी कोड की समय सीमा समाप्त हो गई है। नया कोड अनुरोध करें।",
    pasteHint: "6-अंकों का कोड पेस्ट करें या टाइप करें",
    
    dashboardTitle: "सिविक फिक्स में आपका स्वागत है",
    verifiedBadge: "व्हाट्सएप पहचान सत्यापित",
    logout: "लॉग आउट",

    signInWithGoogle: "गूगल से साइन इन करें",
    orDivider: "अथवा",
    googleAuthSuccess: "गूगल के रूप में साइन इन किया गया",
    autoMappedRole: "स्वचालित रूप से असाइन की गई भूमिका",

    mascotStep1: "मूल विवरण से शुरू करते हैं — इसमें केवल एक मिनट लगेगा।",
    mascotStep2: "आप कहाँ स्थित हैं? इससे हमें आपके आस-पास की घटनाएँ दिखाने में मदद मिलती है।",
    mascotStep3: "मुझे बताएं कि आप कौन हैं ताकि मैं आपके लिए सही व्यवस्था कर सकूं।",
    mascotStep4: "अपना व्हाट्सएप देखें — मैंने आपको एक कोड भेजा है!",
    mascotWelcomeBack: "पुनः स्वागत है{name}! 6-अंकों का कोड के लिए अपना व्हाट्सएप देखें।",
  },
  es: {
    appTitle: "Civic Fix",
    appSubtitle: "Plataforma de Resolución de Problemas Cívicos",
    step1Title: "Sus Datos",
    step1Desc: "Información básica del perfil",
    step2Title: "Ubicación",
    step2Desc: "Ciudad y jurisdicción",
    step3Title: "Su Rol",
    step3Desc: "Seleccione su perfil en Civic Fix",
    step4Title: "Verificar WhatsApp",
    step4Desc: "Verificación con código OTP",
    
    fullName: "Nombre Completo",
    fullNamePlaceholder: "ej. Ananya Sharma",
    mobileNumber: "Número de Teléfono",
    mobilePlaceholder: "98765 43210",
    email: "Correo Electrónico",
    emailPlaceholder: "ananya@example.com",
    age: "Edad",
    agePlaceholder: "25",
    ageHelpMessage: "Debe ser mayor de 18 años para contribuciones financieras y contratos.",
    
    city: "Ciudad",
    state: "Estado / Provincia",
    country: "País",
    searchLocation: "Buscar ciudad o municipio...",
    
    citizenTitle: "Ciudadano",
    citizenDesc: "Vivo aquí y quiero reportar o financiar reparaciones locales.",
    organizationTitle: "Organización",
    organizationDesc: "Organismo municipal u organización cívica.",
    workerTitle: "Trabajador / Contratista",
    workerDesc: "Técnico o contratista local para trabajos de reparación.",
    investorTitle: "Inversionista",
    investorDesc: "Entidad o individuo que financia infraestructura cívica.",
    
    regIdLabel: "ID de Registro de Organización",
    orgTypeLabel: "Tipo de Organización",
    skillCategoryLabel: "Categoría de Habilidad",
    licenseLabel: "Número de Licencia o Identificación",
    entityLabel: "Nombre de Fondo de Inversión",
    kycLabel: "Estado de Verificación KYC",
    
    continueBtn: "Continuar",
    sendOtpBtn: "Enviar OTP por WhatsApp",
    backBtn: "Volver",
    verifyingBtn: "Verificando...",
    sendingOtpBtn: "Enviando OTP...",
    resendOtp: "Reenviar OTP",
    resendIn: "Reenviar en",
    resendMaxReached: "Límite de reenvíos alcanzado.",
    
    welcomeBack: "Bienvenido de nuevo, {name}",
    welcomeBackDesc: "Verificando su identidad como {role}",
    otpSentNotice: "Hemos enviado un código de 6 dígitos a su WhatsApp {number}",
    otpInputLabel: "Ingrese el código OTP de 6 dígitos",
    otpErrorMismatch: "El código no coincide. Inténtelo de nuevo.",
    otpErrorExpired: "El código ha expirado. Solicite uno nuevo.",
    pasteHint: "Pegue el código de 6 dígitos o escríbalo",
    
    dashboardTitle: "Bienvenido a Civic Fix",
    verifiedBadge: "WhatsApp Verificado",
    logout: "Cerrar Sesión",

    signInWithGoogle: "Iniciar sesión con Google",
    orDivider: "O",
    googleAuthSuccess: "Sesión iniciada con Google como",
    autoMappedRole: "Rol asignado automáticamente",

    mascotStep1: "Comencemos con los datos básicos — solo tomará un minuto.",
    mascotStep2: "¿Dónde se encuentra? Esto nos ayuda a mostrarle lo que sucede cerca.",
    mascotStep3: "Dígame quién es para configurar todo adecuadamente.",
    mascotStep4: "¡Revise su WhatsApp — le he enviado un código!",
    mascotWelcomeBack: "¡Bienvenido de nuevo{name}! Revise su WhatsApp para su código de 6 dígitos.",
  },
  mr: {
    appTitle: "सिव्हिक फिक्स",
    appSubtitle: "नागरी समस्या निवारण आणि सहभाग मंच",
    step1Title: "तुमचा तपशील",
    step1Desc: "मूलभूत माहिती",
    step2Title: "तुमचे शहर",
    step2Desc: "स्थान आणि कार्यक्षेत्र",
    step3Title: "तुमची भूमिका",
    step3Desc: "सिव्हिक फिक्स वर भूमिका निवडा",
    step4Title: "व्हॉट्सॲप पडताळणी",
    step4Desc: "ओटीपी कोड पडताळणी",
    
    fullName: "पूर्ण नाव",
    fullNamePlaceholder: "उदा. अनन्या शर्मा",
    mobileNumber: "मोबाईल क्रमांक",
    mobilePlaceholder: "98765 43210",
    email: "ईमेल",
    emailPlaceholder: "ananya@example.com",
    age: "वय",
    agePlaceholder: "25",
    ageHelpMessage: "आर्थिक योगदान आणि करारासाठी वय १८+ असणे आवश्यक आहे.",
    
    city: "शहर",
    state: "राज्य",
    country: "देश",
    searchLocation: "शहर शोधा...",
    
    citizenTitle: "नागरिक",
    citizenDesc: "मी येथे राहतो आणि स्थानिक दुरुस्तीची तक्रार किंवा निधी देऊ इच्छितो.",
    organizationTitle: "संस्था",
    organizationDesc: "सार्वजनिक प्रकल्पांचे व्यवस्थापन करणारी महापालिका किंवा संस्था.",
    workerTitle: "कामगार / कंत्राटदार",
    workerDesc: "दुरुस्तीच्या कामासाठी स्थानिक तंत्रज्ञ किंवा कंत्राटदार.",
    investorTitle: "गुंतवणूकदार",
    investorDesc: "नागरी पायाभूत सुविधांसाठी निधी देणारी व्यक्ती किंवा संस्था.",
    
    regIdLabel: "संस्था नोंदणी आयडी",
    orgTypeLabel: "संस्थेचा प्रकार",
    skillCategoryLabel: "मुख्य कौशल्य वर्ग",
    licenseLabel: "परवाना / आयडी क्रमांक",
    entityLabel: "गुंतवणूक संस्था नाव",
    kycLabel: "केवायसी पडताळणी",
    
    continueBtn: "पुढे जा",
    sendOtpBtn: "व्हॉट्सॲप ओटीपी पाठवा",
    backBtn: "मागे",
    verifyingBtn: "पडताळणी चालू आहे...",
    sendingOtpBtn: "ओटीपी पाठवला जात आहे...",
    resendOtp: "पुन्हा पाठवा",
    resendIn: "पुन्हा पाठवण्यासाठी वेळ",
    resendMaxReached: "जास्तीत जास्त मर्यादा पूर्ण झाली.",
    
    welcomeBack: "पुन्हा स्वागत आहे, {name}",
    welcomeBackDesc: "सिव्हिक फिक्स वर {role} म्हणून पडताळणी",
    otpSentNotice: "आम्ही तुमच्या व्हॉट्सॲप {number} वर ६ अंकी कोड पाठवला आहे",
    otpInputLabel: "६ अंकी व्हॉट्सॲप ओटीपी प्रविष्ट करा",
    otpErrorMismatch: "कोड जुळला नाही - कृपया पुन्हा प्रयत्न करा.",
    otpErrorExpired: "ओटीपी ची मुदत संपली आहे. नवीन कोड मागवा.",
    pasteHint: "कोड पेस्ट करा किंवा टाईप करा",
    
    dashboardTitle: "सिव्हिक फिक्स मध्ये आपले स्वागत आहे",
    verifiedBadge: "व्हॉट्सॲप पडताळणी पूर्ण",
    logout: "लॉग आउट",

    signInWithGoogle: "गूगल द्वारे साइन इन करा",
    orDivider: "किंवा",
    googleAuthSuccess: "गूगल द्वारे साइन इन केले",
    autoMappedRole: "स्वयंचलित भूमिका",

    mascotStep1: "मूलभूत माहितीपासून सुरुवात करूया — यासाठी फक्त एक मिनिट लागेल.",
    mascotStep2: "तुम्ही कुठे राहता? यामुळे जवळच्या समस्या दाखवण्यास मदत होते.",
    mascotStep3: "तुमची भूमिका निवडा जेणेकरून आम्ही योग्य सेटअप करू शकू.",
    mascotStep4: "तुमचे व्हॉट्सॲप तपासा — मी एक कोड पाठवला आहे!",
    mascotWelcomeBack: "पुन्हा स्वागत आहे{name}! व्हॉट्सॲप वर ६-अंकी कोड तपासा.",
  },
  ta: {
    appTitle: "சிவிக் ஃபிக்ஸ்",
    appSubtitle: "குடிமக்கள் பிரச்சினை தீர்வு தளம்",
    step1Title: "உங்கள் விவரங்கள்",
    step1Desc: "அடிப்படை விவரங்கள்",
    step2Title: "உங்கள் இருப்பிடம்",
    step2Desc: "நகரம் மற்றும் பகுதி",
    step3Title: "உங்கள் பங்கு",
    step3Desc: "உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்",
    step4Title: "வாட்ஸ்அப் சரிபார்ப்பு",
    step4Desc: "OTP குறியீடு சரிபார்ப்பு",
    
    fullName: "முழு பெயர்",
    fullNamePlaceholder: "எ.கா. அனன்யா சர்மா",
    mobileNumber: "மொபைல் எண்",
    mobilePlaceholder: "98765 43210",
    email: "மின்னஞ்சல்",
    emailPlaceholder: "ananya@example.com",
    age: "வயது",
    agePlaceholder: "25",
    ageHelpMessage: "நிதி பங்களிப்புகள் மற்றும் ஒப்பந்தங்களுக்கு வயது 18+ ஆக இருக்க வேண்டும்.",
    
    city: "நகரம்",
    state: "மாநிலம்",
    country: "நாடு",
    searchLocation: "நகரத்தைத் தேடுங்கள்...",
    
    citizenTitle: "குடிமகன்",
    citizenDesc: "நான் இங்கு வசிக்கிறேன், உள்ளூர் பழுதுபார்ப்புகளை அறிவிக்க விரும்புகிறேன்.",
    organizationTitle: "அமைப்பு",
    organizationDesc: "பொதுத் திட்டங்களை நிர்வகிக்கும் நகராட்சி அமைப்பு.",
    workerTitle: "பணியாளர் / ஒப்பந்தக்காரர்",
    workerDesc: "பழுதுபார்க்கும் பணிகளுக்கான உள்ளூர் தொழிலாளி.",
    investorTitle: "முதலீட்டாளர்",
    investorDesc: "குடிமை உள்கட்டமைப்புக்கு நிதி வழங்கும் நபர்.",
    
    regIdLabel: "அமைப்பு பதிவு ஐடி",
    orgTypeLabel: "அமைப்பு வகை",
    skillCategoryLabel: "முக்கிய திறமை வகை",
    licenseLabel: "உரிமம் / ஐடி எண்",
    entityLabel: "முதலீட்டு நிறுவனத்தின் பெயர்",
    kycLabel: "KYC சரிபார்ப்பு நிலை",
    
    continueBtn: "தொடரவும்",
    sendOtpBtn: "வாட்ஸ்அப் OTP அனுப்புக",
    backBtn: "பின்னால்",
    verifyingBtn: "சரிபார்க்கிறது...",
    sendingOtpBtn: "OTP அனுப்பப்படுகிறது...",
    resendOtp: "மீண்டும் அனுப்புக",
    resendIn: "மீண்டும் அனுப்ப நேரம்",
    resendMaxReached: "அதிகபட்ச வரம்பு எட்டப்பட்டது.",
    
    welcomeBack: "மீண்டும் வருக, {name}",
    welcomeBackDesc: "சிவிக் ஃபிக்ஸில் {role} ஆக உங்கள் அடையாளத்தை சரிபார்க்கிறது",
    otpSentNotice: "உங்கள் வாட்ஸ்அப் {number} க்கு 6 இலக்கக் குறியீட்டை அனுப்பியுள்ளோம்",
    otpInputLabel: "6 இலக்க வாட்ஸ்அப் OTP ஐ உள்ளிடவும்",
    otpErrorMismatch: "குறியீடு பொருந்தவில்லை — மீண்டும் முயலவும்.",
    otpErrorExpired: "OTP காலம் காலாவதியானது. புதிய குறியீட்டைக் கேட்கவும்.",
    pasteHint: "குறியீட்டை ஒட்டவும் அல்லது தட்டச்சு செய்யவும்",
    
    dashboardTitle: "சிவிக் ஃபிக்ஸ் -க்கு நல்வரவு",
    verifiedBadge: "வாட்ஸ்அப் சரிபார்க்கப்பட்டது",
    logout: "வெளியேறு",

    signInWithGoogle: "கூகிள் மூலம் உள்நுழைக",
    orDivider: "அல்லது",
    googleAuthSuccess: "கூகிள் கணக்குடன் உள்நுழைந்தது",
    autoMappedRole: "தானாக ஒதுக்கப்பட்ட பங்கு",

    mascotStep1: "அடிப்படை விவரங்களுடன் தொடங்குவோம் — இதற்கு ஒரு நிமிடம் மட்டுமே ஆகும்.",
    mascotStep2: "நீங்கள் எங்கு வசிக்கிறீர்கள்? இது அருகில் உள்ளவற்றை காட்ட உதவும்.",
    mascotStep3: "உங்களுக்கு சரியாக அமைக்க உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்.",
    mascotStep4: "உங்கள் வாட்ஸ்அப்பைச் சரிபார்க்கவும் — நான் குறியீட்டை அனுப்பியுள்ளேன்!",
    mascotWelcomeBack: "மீண்டும் வருக{name}! 6 இலக்கக் குறியீட்டிற்கு வாட்ஸ்அப்பைச் சரிபார்க்கவும்.",
  },
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  logout: () => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("civicfix_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("civicfix_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("civicfix_user");
    }
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("civicfix_user");
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const langDict = translations[language] || translations.en;
    let val = langDict[key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        val = val.replace(`{${k}}`, v);
      });
    }
    return val;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        currentUser,
        setCurrentUser,
        logout,
        t,
      }}
    >
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
