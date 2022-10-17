import { CloseSharp } from "@mui/icons-material";
import type { NextPage } from "next";
import Head from "next/head";
import {
  ChangeEvent,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import runCommand from "../helpers/commands";

const Home: NextPage = () => {
  const [command, setCommand] = useState<string>(".help"); //pink
  const cmdInp: MutableRefObject<null | HTMLInputElement> = useRef(null);
  const [user, setUser] = useState({
    name: "mind0bender",
  });
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [caretPosition, setCaretPosition] = useState<number>(command.length);
  const [path, setPath] = useState("~");

  const [output, setOutput] = useState<string[]>([
    "Welcome to PHEW",
    "Type `.help` for more info\n\n",
  ]);

  useEffect((): (() => void) => {
    setIsFocused(document.hasFocus());
    cmdInp.current?.focus();
    setIsFocused(document.hasFocus());
    const onblur = () => {
      setIsFocused(document.hasFocus());
    };
    window.addEventListener("blur", onblur);
    return (): void => {
      window.removeEventListener("blur", onblur);
    };
  }, []);

  // const runCommand: () => void = (): void => {
  //   let cmd: string = command.trim() || `echo "lol'`; //pink
  //   if (cmd.startsWith("echo ")) {
  //     cmd = cmd.substring(5);
  //     if (cmd.startsWith('"') && cmd.endsWith('"')) {
  //       cmd = cmd.substring(1, cmd.length - 1);
  //     }
  //     if (cmd.startsWith("'") && cmd.endsWith("'")) {
  //       cmd = cmd.substring(1, cmd.length - 1);
  //     }
  //     setOutput((po: string[]): string[] => [
  //       ...po,
  //       `phew@${user.name}:${path}$ ${command}`,
  //       cmd,
  //     ]);
  //     setCommand("");
  //     setCaretPosition(0);
  //   }
  // };

  return (
    <>
      <Head>
        <title>
          {user.name}:{path}
        </title>
      </Head>
      <div className="flex flex-col w-full h-screen p-2 bg-slate-900 font-extralight font-mono">
        <div className="flex justify-between rounded-t-md">
          <div className="bg-slate-800 text-white px-10 py-1 shadow-inner shadow-slate-700 border-t-2 border-x-2 rounded-t-md border-slate-700">
            some-random-process
          </div>
          <div className="grow border-slate-700 border-b-2" />
          <div className="border-b-2 hover:bg-red-600 rounded-tr-md border-slate-700">
            <button
              title="not yet; pink"
              className="text-white p-1 rounded-tr-md duration-150"
            >
              <CloseSharp />
            </button>
          </div>
        </div>
        <label htmlFor="cmdinp" className="flex grow">
          <div className="grow cursor-text h-[calc(100vh-3.5rem)] overflow-y-scroll scrollbar-code rounded-b-md p-2 border-x-2 border-b-2 border-slate-700">
            <input
              // autoFocus
              id="cmdinp"
              ref={cmdInp}
              onKeyUpCapture={(e: KeyboardEvent<HTMLInputElement>): void => {
                setCaretPosition(cmdInp.current?.selectionEnd || 0);
              }}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>): void => {
                if (e.key === "Enter") {
                  const out: string[] | false = runCommand(
                    `phew@${user.name}:${path}$`,
                    command
                  );
                  if (out) {
                    console.log([...output, ...out]);
                    setOutput((po: string[]): string[] => [...po, ...out]);
                  }
                }
              }}
              onFocus={(e) => {
                const selectedText: string | undefined = window
                  .getSelection()
                  ?.toString();
                if (!selectedText) {
                  setIsFocused(document.activeElement == cmdInp.current);
                }
              }}
              onBlur={() => {
                const selectedText: string | undefined = window
                  .getSelection()
                  ?.toString();
                if (!selectedText) {
                  setIsFocused(document.activeElement == cmdInp.current);
                }
              }}
              className="bg-transparent opacity-0 full -translate-x-[99999rem] -z-10 absolute outline-none border-none"
              type="text"
              value={command}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                setCommand(e.target.value);
              }}
            />
            <div className="command flex flex-col gap-1">
              {output.map((line: string, idx) => {
                return (
                  <div className="command" key={idx}>
                    {line}
                    <br />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 items-baseline">
              <div className="prompt">
                phew@{user.name}:{path}$
              </div>
              <div className="flex">
                <span className="command">{command}</span>
                <span
                  style={{
                    top: "1px",
                    right: `${(command.length - caretPosition) * 8.75}px`,
                  }}
                  className={`caret relative ${
                    isFocused ? "caret-focus" : "caret-blur"
                  }`}
                />
              </div>
            </div>
          </div>
        </label>
      </div>
    </>
  );
};

export default Home;

/**
 * Known Bugs!
 * caret stays on first line even when command is multiline.
 */
