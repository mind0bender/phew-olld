import React, { FC, MutableRefObject, useContext, useRef } from "react";
import { ShareableUser } from "../helpers/shareableModel";
import { defaultUser, UserContext, UserType } from "./contextProvider";
import CommandLink from "./commandLink";
import Link from "next/link";
import ObjectMap from "./objectMap";

interface WhoAmIProps {
  userData?: ShareableUser;
}

const WhoAmI: FC<WhoAmIProps> = ({ userData }: WhoAmIProps): JSX.Element => {
  const [user] = useContext<UserType>(UserContext);
  const userWhenCalled: MutableRefObject<ShareableUser> = useRef<ShareableUser>(
    userData || user
  );
  return userWhenCalled.current.username === defaultUser.username ? (
    <IDKYou />
  ) : (
    <ObjectMap
      obj={{
        username: (
          <Link href={`user/${userWhenCalled.current.username}`}>
            <a
              className="underline decoration-solid hover:decoration-2 decoration-secondary-700"
              target="_blank"
              rel="noreferrer"
            >
              {userWhenCalled.current.username}
            </a>
          </Link>
        ),
        email: (
          <Link href={`mailto:${userWhenCalled.current.email}`}>
            <a
              className="underline decoration-solid hover:decoration-2 decoration-secondary-700"
              target="_blank"
              rel="noreferrer"
              href={`mailto:${userWhenCalled.current.email}`}
            >
              {userWhenCalled.current.email}
            </a>
          </Link>
        ),
      }}
    />
  );
};

const IDKYou: FC = (): JSX.Element => {
  return (
    <div>
      I do not remember you.
      <br />
      Do I know you? If yes then please{" "}
      <CommandLink command="login /<username>/<password>">
        login
      </CommandLink>{" "}
      else{" "}
      <CommandLink command="signup /<username>/<password>/<email>">
        signup
      </CommandLink>
    </div>
  );
};

export default WhoAmI;
