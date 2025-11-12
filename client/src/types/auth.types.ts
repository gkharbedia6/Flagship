export interface iVerificationForm {
  email: string;
  verificationCode: string;
}

export interface iSubmitCodeForm {
  email: string;
  verificationCode: string;
}

export interface iSignUpForm {
  email: string;
  password: string;
}

export interface iSignUpResponse {
  message: string;
  data: {
    email: string;
    verificationExpires: number;
  };
}

export interface iForgotPasswordResponse {
  message: string;
  data: {
    email: string;
    verificationExpires: number;
  };
}

export interface iVerifyEmailResponse {
  message: string;
}

export interface iSubmitCodeResponse {
  message: string;
  data: { email: string };
}

export interface iUser {
  _id: string;
  fullName?: string;
  username?: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface iSignInForm {
  email: string;
  password: string;
}
