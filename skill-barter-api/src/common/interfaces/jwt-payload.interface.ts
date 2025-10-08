import { ROLE } from '../enums/role.enum';

export interface JwtPayload {
  userId: number;
  email: string;
  role: ROLE;
}
