export interface iVerificationForm {
  email: string;
  verificationCode: string;
}

export interface iSubmitCodeForm {
  email: string;
  verificationCode: string;
}

export interface iRecoverPasswordForm {
  email: string;
  id: string;
  password: string;
}

export interface iSignUpForm {
  email: string;
  password: string;
}

export interface iSignInForm {
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

export interface iVerifyEmailResponse {
  message: string;
}

export interface iForgotPasswordResponse {
  message: string;
  data: {
    email: string;
    verificationExpires: number;
    forgotPasswordUserId: string;
  };
}

export interface iSubmitCodeResponse {
  message: string;
  data: { email: string };
}

export interface iRecoverPasswordResponse {
  message: string;
}

export interface iSignOutResponse {
  message: string;
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
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
