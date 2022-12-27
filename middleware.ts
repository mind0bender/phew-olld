import { NextRequest, NextResponse } from "next/server";
import { verify } from "./lib/jwt";
import validator from "validator";
import { ObjectId } from "mongoose";
const { isEmpty } = validator;

export function middleware(
  req: NextRequest & { issignin: boolean }
): Promise<NextResponse> {
  return new Promise<NextResponse>(
    (
      resolve: (value: NextResponse) => void,
      reject: (reason?: any) => void
    ): void => {
      const token: string | null = req.headers.get("authorization");
      if (token && !isEmpty(token)) {
        const response: NextResponse = NextResponse.next();
        verify(token)
          .then(({ _id }: { _id: ObjectId | null }): void => {
            if (_id) {
              response.cookies.set("_id", _id);
            }
            resolve(response);
          })
          .catch((): void => {
            resolve(response);
          });
      } else {
        resolve(NextResponse.next());
      }
    }
  );
}

export const config = {
  matcher: ["/api/auth/login"],
};
