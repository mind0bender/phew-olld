import { FC, HTMLAttributes, useContext } from "react";
import { CommandContext } from "./contextProvider";

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
      onClick={(): void => {
        if (setCommand && setCaretPosition) {
          setCommand(command);
          setCaretPosition(command.length);
        }
      }}
      className={`hover:bg-secondary-800 hover:ring ring-secondary-700 cursor-pointer px-0.5 py-0.5 duration-100 ${props.className}`}
    >
      [<span className="text-amber-300 underline ">{children}</span>]
    </span>
  );
};

export default CommandLink;
