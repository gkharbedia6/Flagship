export interface iRegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface iRegisterResponse {
  _id: string;
  username: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface iLoginForm {
  email: string;
  password: string;
}
