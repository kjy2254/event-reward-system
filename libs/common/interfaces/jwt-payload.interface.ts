export interface JwtPayload {
  sub: string; // 유저 ID
  email: string;
  role: string;
}
