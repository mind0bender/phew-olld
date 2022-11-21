import { jwtVerify, JWTVerifyResult, KeyLike, SignJWT } from "jose";
import { ObjectId } from "mongoose";

const SECRET: string | undefined = process.env.SECRET_KEY;
if (!SECRET) {
  throw new Error("SECRET_KEY not found");
}

const SECRET_KEY: Uint8Array = new TextEncoder().encode(SECRET);
export const sign: (_id: ObjectId) => Promise<string> = async (
  _id: ObjectId
): Promise<string> => {
  const token: string = await new SignJWT({
    _id: _id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(SECRET_KEY);
  return token;
};

export const verify: (
  token: string
) => Promise<{ _id: ObjectId | null }> = async (
  token: string
): Promise<{ _id: ObjectId | null }> => {
  return new Promise<{ _id: ObjectId | null }>(
    (
      resolve: (value: { _id: ObjectId | null }) => void,
      reject: (reason?: any) => void
    ): void => {
      jwtVerify(token, SECRET_KEY)
        .then(({ payload }: JWTVerifyResult): void => {
          resolve({ _id: payload._id as ObjectId });
        })
        .catch((err) => {
          resolve({ _id: null });
        });
    }
  );
};
// export const verify: (token: string) => Promise<{ _id: ObjectId }> = (
//   token: string
// ): Promise<{ _id: ObjectId }> => {
//   return new Promise<{ _id: ObjectId }>(
//     (
//       resolve: (value: { _id: ObjectId }) => void,
//       reject: (reason?: any) => void
//     ): void => {
//       jwt.verify(
//         token,
//         SECRET_KEY,
//         (
//           err: VerifyErrors | null,
//           decoded: string | JwtPayload | undefined
//         ): void => {
//           if (err) {
//             reject(err);
//           } else {
//             if (decoded) {
//               resolve(decoded as { _id: ObjectId });
//             }
//           }
//         }
//       );
//     }
//   );
// };
