export type Role = "citizen" | "organization" | "worker" | "investor";

export interface LocationData {
  city: string;
  state: string;
  country: string;
}

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  countryCode: string;
  email: string;
  age: number;
  location: LocationData;
  role: Role;
  supplementaryData?: {
    organizationRegId?: string;
    organizationType?: string;
    workerSkillCategory?: string;
    workerLicenseId?: string;
    investorEntityName?: string;
    investorKycStatus?: string;
  };
  verifiedWhatsApp?: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export interface RoleConfig {
  id: Role;
  title: string;
  shortDesc: string;
  accentColor: string; // Tailwind hex or class name
  borderColor: string;
  badgeBg: string;
  auroraColors: [string, string];
  iconName: string;
}

export type Language = "en" | "hi" | "es" | "mr" | "ta";

export interface CountryCodeOption {
  code: string;
  country: string;
  flag: string;
  formatPlaceholder: string;
}
