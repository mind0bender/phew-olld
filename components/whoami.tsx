import React, {
  FC,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
} from "react";
import { ShareableUser } from "../helpers/shareableModel";
import { defaultUser, UserContext, UserType } from "../pages";
import CommandLink from "./commandLink";

interface WhoAmIProps {
  userData?: ShareableUser;
}

const WhoAmI: FC<WhoAmIProps> = ({ userData }: WhoAmIProps): JSX.Element => {
  const [user] = useContext<UserType>(UserContext);
  let userWhenCalled: MutableRefObject<ShareableUser> = useRef<ShareableUser>(
    userData || user
  );
  return user.username === defaultUser.username ? (
    <IDKYou />
  ) : (
    <div className="pl-6 pt-2 max-w-fit">
      <div>+----</div>
      <div className="flex">
        <span>|&nbsp;</span>
        <span>
          <div className="flex gap-2">
            <div>username:</div>
            <div>{userWhenCalled.current.username}</div>
          </div>
          <div className="flex gap-2">
            <div>email{"   :"}</div>
            <a
              className="underline decoration-solid hover:decoration-2 decoration-secondary-700"
              target="_blank"
              rel="noreferrer"
              href={`mailto:${userWhenCalled.current.email}`}
            >
              {userWhenCalled.current.email}
            </a>
          </div>
        </span>
        <span className="grow flex flex-col-reverse">&nbsp;|</span>
      </div>
      <div className="flex flex-row-reverse">----+</div>
    </div>
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
