import { Role } from '../enums/role.enum';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  profilePicture: string;
  registartionDate: Date;
}
