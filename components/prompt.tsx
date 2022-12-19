import { FC, MutableRefObject, useContext, useRef } from "react";
import { UserContext } from "../pages";

interface PropmtProps {
  path: string;
  whenCalledUser?: boolean;
}

export const Prompt: FC<PropmtProps> = ({
  path,
  whenCalledUser = true,
}: PropmtProps): JSX.Element => {
  const [{ username }] = useContext(UserContext);
  const usernmaeWhenCalled: MutableRefObject<string> = useRef<string>(username);
  return (
    <span className="text-theme-400 whitespace-nowrap">
      {`phew@${
        whenCalledUser ? usernmaeWhenCalled.current : username
      }${path} >`}
    </span>
  );
};
