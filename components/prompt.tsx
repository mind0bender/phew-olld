import { FC, MutableRefObject, useContext, useRef } from "react";
import { UserContext } from "../pages";

interface PropmtProps {
  path: string;
}

export const Prompt: FC<PropmtProps> = ({ path }: PropmtProps): JSX.Element => {
  const [{ username }] = useContext(UserContext);
  const usernmaeWhenCalled: MutableRefObject<string> = useRef<string>(username);
  return (
    <span className="text-theme-400 whitespace-nowrap">
      {`phew@${usernmaeWhenCalled.current}${path} >`}
    </span>
  );
};
