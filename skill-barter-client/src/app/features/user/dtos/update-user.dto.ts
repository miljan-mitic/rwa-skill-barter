export interface UpdateUserDto {
  profilePicture?: string;
  username?: string;
  email?: string;
  newPassword?: string;
  currentPassword?: string;
}
