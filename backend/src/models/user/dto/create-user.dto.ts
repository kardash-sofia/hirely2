import { Roles } from '../constants';

export class CreateUserDto {
  authUserId: string;
  fullName: string;
  role: Roles;
}
