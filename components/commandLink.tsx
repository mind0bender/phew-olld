import {
  FC,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useContext,
} from "react";
import { CommandContext } from "../pages";

interface CommandLinkProps extends HTMLAttributes<HTMLSpanElement> {
  command: string;
}

const CommandLink: FC<CommandLinkProps> = ({
  children,
  command,
  ...props
}: CommandLinkProps): JSX.Element => {
  const {
    command: [, setCommand],
    caretPosition: [, setCaretPosition],
  } = useContext(CommandContext);
  return (
    <span
      {...props}
      className={`hover:bg-slate-800 hover:ring ring-slate-800 cursor-pointer rounded-sm px-0.5 py-0.5 duration-100 ${props.className}`}
    >
      [
      <span
        onClick={(): void => {
          if (setCommand && setCaretPosition) {
            setCommand(command);
            setCaretPosition(command.length);
          }
        }}
        className="text-amber-300 underline "
      >
        {children}
      </span>
      ]
    </span>
  );
};

export default CommandLink;
