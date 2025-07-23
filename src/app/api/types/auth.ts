export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
  twoFactorCode?: string;
  rememberMe?: boolean;
}

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  telephone?: string | null;
  country?: string | null;
  language?: string | null;
  dateOfBirth?: string;
  source?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
  password: string;
}

export interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  username: string;
  phoneNumber: string;
  isEmailConfirmed: boolean;
  role: string;
  isTwoFactorEnabled: boolean;
}
