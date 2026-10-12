export type TLoginUser = {
  _id?: string;
  email: string;
  password: string;
  fcmToken?: string;
};

export type JwtPayload = {
  email: string;
  iat?: number;
  exp?: number;
};
