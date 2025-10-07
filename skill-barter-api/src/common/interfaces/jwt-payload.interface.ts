import { Role } from '../enums/role.enum';

export interface JwtPayload {
  userId: number;
  username: string;
  role: Role;
}
