import { ObjectId } from "mongoose";
import { PhewInterface } from "../database/models/phew";
import user, { UserInterface } from "../database/models/user";

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
  sharedWith: ObjectId[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  username: ObjectId;
}

export const shareablePhew: (phew: PhewInterface) => Promise<ShareablePhew> = (
  phew: PhewInterface
): Promise<ShareablePhew> => {
  const {
    content,
    sharedWith,
    isPublic,
    createdAt,
    updatedAt,
    username,
  }: PhewInterface = phew;

  return new Promise<ShareablePhew>(
    (
      resolve: (value: ShareablePhew) => void,
      reject: (reasons?: any) => void
    ): void => {
      user
        .find({
          _id: {
            $in: sharedWith,
          },
        })
        .then((sharedWithUsers: UserInterface[]): void => {
          resolve({
            content,
            sharedWith: sharedWithUsers.map(
              ({ _id }: UserInterface): ObjectId => _id
            ),
            isPublic,
            createdAt,
            updatedAt,
            username,
          });
        })
        .catch(reject);
    }
  );
};
