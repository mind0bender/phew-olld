import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";

const Home: NextPage = () => {
  const [command, setCommand] = useState<string>(
    "yarn create next-app --typescript"
  );
  const cmdInp: MutableRefObject<null | HTMLInputElement> = useRef(null);
  const [user, setUser] = useState({
    name: "mind0bender",
  });
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [caretPosition, setCaretPosition] = useState<number>(command.length);

  useEffect((): (() => void) => {
    setIsFocused(document.hasFocus());
    cmdInp.current?.focus();
    setIsFocused(document.hasFocus());

    window.addEventListener("focusin", (): void => {
      const selectedText: string | undefined = window
        .getSelection()
        ?.toString();
      if (!selectedText) {
        cmdInp.current?.focus();
        setIsFocused(document.hasFocus());
      }
    });
    window.addEventListener("focusout", (): void => {
      const selectedText: string | undefined = window
        .getSelection()
        ?.toString();
      if (cmdInp.current && !selectedText) {
        cmdInp.current.focus();
        setIsFocused(document.hasFocus());
      }
    });
    return (): void => {};
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen p-2 bg-slate-900 text-sm font-mono">
      <div className="text-white bg-blue-700 max-w-min">{isFocused + ""}</div>
      <div className="flex-grow rounded p-2 border-2 border-slate-700">
        <input
          ref={cmdInp}
          onKeyUpCapture={(e): void => {
            setCaretPosition(cmdInp.current?.selectionEnd || 0);
          }}
          className="bg-transparent opacity-0 -translate-x-full -z-10 absolute outline-none border-none text-white"
          type="text"
          value={command}
          onChange={(e: ChangeEvent<HTMLInputElement>): void => {
            setCommand(e.target.value);
          }}
        />
        <div className="flex gap-2">
          <div className="prompt">/main@{user.name}$</div>
          <div className="flex">
            <span className="command">{command}</span>
            <span
              style={{
                right: `${(command.length - caretPosition) * 7.7}px`,
              }}
              className={`caret relative ${
                isFocused ? "caret-focus" : "caret-blur"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

/**
 * Known Bugs!
 * caret stays on first line even when command is multiline.
 */
