import { ObjectId } from "mongoose";
import { PhewInterface } from "../database/models/phew";
import User, { UserInterface } from "../database/models/user";

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

export interface ShareablePhew {
  content: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: ShareableUser;
}

export const shareablePhew: (phew: PhewInterface) => Promise<ShareablePhew> = (
  phew: PhewInterface
): Promise<ShareablePhew> => {
  const { content, isPublic, createdAt, updatedAt, user }: PhewInterface = phew;

  return new Promise<ShareablePhew>(
    (
      resolve: (value: ShareablePhew) => void,
      reject: (reasons?: any) => void
    ): void => {
      User.findById(user)
        .then((userDoc: UserInterface): void => {
          resolve({
            content,
            isPublic,
            createdAt,
            updatedAt,
            user: userDoc,
          });
        })
        .catch(reject);
    }
  );
};
