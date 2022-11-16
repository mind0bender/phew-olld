import { UserInterface } from "../database/models/user";

export interface ShareableUser {
  username: string;
  email: string;
}

export const shareableUser: (user: UserInterface) => ShareableUser = (
  user: UserInterface
): ShareableUser => {
  const { username, email }: UserInterface = user;
  return {
    username,
    email,
  };
};
