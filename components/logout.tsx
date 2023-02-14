import { useCookies } from "react-cookie";
import { useContext, FC, MutableRefObject, useRef, useEffect } from "react";
import { ShareableUser } from "../helpers/shareableModel";
import { defaultUser, UserContext, UserType } from "./contextProvider";

const Logout: FC = (): JSX.Element => {
  const [, , removeCookies] = useCookies<"jwt", { jwt: string }>(["jwt"]);
  const [user, setUser] = useContext<UserType>(UserContext);
  const userWhenCalled: MutableRefObject<ShareableUser> =
    useRef<ShareableUser>(user);
  useEffect((): (() => void) => {
    removeCookies("jwt");
    setUser(defaultUser);
    return (): void => {};
  }, [setUser, removeCookies]);

  return (
    <div className="text-error-500">
      unmounting /user/{userWhenCalled.current.username}
    </div>
  );
};

export default Logout;
