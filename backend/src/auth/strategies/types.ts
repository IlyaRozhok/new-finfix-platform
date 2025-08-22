export type GooglePayload = {
  googleSub: string;
  email: string;
  userName: string;
  avatarUrl: string | null;
};

export type JwtUser = {
  sub: string;
  email: string;
};
