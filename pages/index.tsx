import { ObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse, NextPage } from "next";
import Head from "next/head";
import {
  ChangeEvent,
  ChangeEventHandler,
  Context,
  createContext,
  Dispatch,
  FocusEvent,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import Greeting from "../components/greeting";
import Processing from "../components/processing";
import { Prompt } from "../components/prompt";
import login from "../controllers/auth/login.controller";
import runCommand from "../helpers/commands";
import { ShareableUser } from "../helpers/shareableModel";
import { verify } from "../lib/jwt";
import validator from "validator";

const { isEmpty } = validator;

export type UserType = [
  ShareableUser,
  Dispatch<SetStateAction<ShareableUser>> | null
];

export const defaultUser: ShareableUser = {
  username: "stem",
  email: "",
};

export const UserContext: Context<UserType> = createContext<UserType>([
  defaultUser,
  null,
]);

export type CommandType = {
  command: [string, Dispatch<SetStateAction<string>> | null];
  caretPosition: [number, Dispatch<SetStateAction<number>> | null];
};

export const defaultCommand: CommandType = {
  command: ["", null],
  caretPosition: [0, null],
};

export const CommandContext: Context<CommandType> =
  createContext<CommandType>(defaultCommand);

interface HomeProps {
  initUser: ShareableUser;
  token: string;
}

const Home: NextPage<HomeProps> = ({
  initUser = defaultUser,
  token = "",
}: HomeProps) => {
  const [command, setCommand] = useState<string>("");
  const cmdInp: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  const caret: MutableRefObject<HTMLSpanElement | null> =
    useRef<HTMLSpanElement | null>(null);
  const [caretPosition, setCaretPosition] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [prevCommands, setPrevCommands] = useState<string[]>([]);
  const [prevCommandsIdx, setPrevCommandsIdx] = useState<number>(-1);

  const [path, setPath] = useState("~");

  const [user, setUser] = useState<ShareableUser>(initUser);
  const [output, setOutput] = useState<ReactNode[]>([
    <Greeting
      key={-1}
      setCaretPosition={setCaretPosition}
      setCommand={setCommand}
    />,
  ]);
  const [, setCookies] = useCookies<"jwt", ["jwt"]>(["jwt"]);

  useEffect(() => {
    if (token) {
      setCookies("jwt", token);
    }

    return () => {};
  }, [token, setCookies]);

  useEffect((): (() => void) => {
    setIsFocused(document.hasFocus());
    cmdInp.current?.focus();
    setIsFocused(document.hasFocus());
    const onblur: () => void = (): void => {
      setIsFocused(document.hasFocus());
    };
    window.addEventListener("blur", onblur);

    return (): void => {
      window.removeEventListener("blur", onblur);
    };
  }, []);

  useEffect((): (() => void) => {
    caret.current?.scrollIntoView({
      behavior: "auto",
    });
    return (): void => {};
  }, [output]);

  useEffect((): (() => void) => {
    if (prevCommandsIdx == -1) {
      setCommand("");
    } else if (prevCommands[prevCommandsIdx]) {
      setCommand(prevCommands[prevCommandsIdx]);
    }
    return (): void => {};
  }, [prevCommandsIdx, prevCommands]);

  const addPromptToOutput: (path: string, username: string) => void = (
    path: string,
    username: string
  ): void => {
    setOutput((po: ReactNode[]): ReactNode[] => [
      ...po,
      <div key={po.length} className="flex gap-2">
        <Prompt path={path} username={username} />
        <span>{command}</span>
      </div>,
    ]);
    if (command !== prevCommands[prevCommands.length - 1]) {
      setPrevCommands((ppcs: string[]): string[] => [...ppcs, command]);
    }
    if (prevCommandsIdx !== -1) {
      setPrevCommandsIdx(-1);
    }
  };

  const keyUpCaptureHandler: KeyboardEventHandler<HTMLInputElement> = (
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    setCaretPosition(cmdInp.current?.selectionEnd || 0);
  };

  const keyDownHandler: KeyboardEventHandler<HTMLInputElement> = (
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") {
      addPromptToOutput(path, user.username);
      setIsProcessing(true);
      runCommand(command)
        .then((out: ReactNode): void => {
          setOutput((po: ReactNode[]): ReactNode[] => [...po, out]);
        })
        .catch(({ clear, err }: { clear: boolean; err?: any }): void => {
          if (clear) {
            setOutput([]);
          } else {
            setOutput((po: ReactNode[]): ReactNode[] => [...po, err]);
          }
        })
        .finally((): void => {
          setIsProcessing(false);
        });
      return;
    }
    if ((e.ctrlKey && e.key === "l") || (e.key === "L" && !e.shiftKey)) {
      e.preventDefault();
      setOutput([]);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (prevCommandsIdx !== 0) {
        setPrevCommandsIdx((pci: number): number => {
          if (pci == -1) {
            return prevCommands.length - 1;
          }
          return pci - 1;
        });
      }
    } else if (
      e.key === "ArrowDown" &&
      !(prevCommandsIdx == prevCommands.length - 1)
    ) {
      e.preventDefault();
      if (prevCommandsIdx < prevCommands.length - 1) {
        setPrevCommandsIdx((pci: number): number => {
          return pci + 1;
        });
      }
    }
  };

  const focusChangeHandler: FocusEventHandler<HTMLInputElement> = (
    e: FocusEvent<HTMLInputElement>
  ): void => {
    const selectedText: string | undefined = window.getSelection()?.toString();
    if (!selectedText) {
      setIsFocused(document.activeElement == cmdInp.current);
    }
  };

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setCommand(e.target.value);
  };

  return (
    <CommandContext.Provider
      value={{
        command: [command, setCommand],
        caretPosition: [caretPosition, setCaretPosition],
      }}
    >
      <UserContext.Provider value={[user, setUser]}>
        <Head>
          <title>{`${user.username}:${path}`}</title>
        </Head>
        <div className="flex flex-col w-full h-screen p-2 bg-slate-900 font-extralight font-mono">
          <div className="flex justify-between rounded-t-md">
            <div className="bg-slate-800 text-white px-10 py-1 shadow-inner shadow-slate-800 border-t-2 border-x-2 rounded-t-md border-slate-700">
              some-random-process
            </div>
            <div className="grow border-slate-700 border-b-2" />
            <button
              title="not yet pink"
              className="border-b-2 px-2  hover:bg-red-600 border-slate-700 text-white text-2xl aspect-square rounded-tr-md duration-150"
            >
              x
            </button>
          </div>
          <label htmlFor="cmdinp" className="flex grow">
            <div className="grow cursor-text h-[calc(100vh-3.5rem)] overflow-y-scroll scrollbar rounded-b-md p-2 border-x-2 border-b-2 border-slate-700">
              <input
                id="cmdinp"
                ref={cmdInp}
                onKeyUpCapture={keyUpCaptureHandler}
                onKeyDown={keyDownHandler}
                onFocus={focusChangeHandler}
                onBlur={focusChangeHandler}
                className="bg-transparent opacity-0 full -translate-x-[99999rem] -z-10 absolute outline-none border-none"
                type="text"
                value={command}
                onChange={onChangeHandler}
              />
              <div className="flex flex-col gap-1">
                {output.map((line: ReactNode, idx: number) => {
                  return (
                    <div
                      className="text-gray-200 whitespace-pre-wrap break-all selection:bg-teal-500 selection:text-slate-900"
                      key={idx}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
              <div
                className={`flex gap-2 max-h-fit items-baseline ${`${
                  isProcessing ? "invisible absolute" : "block"
                }`}}`}
              >
                <div className="text-teal-300 max-h-fit whitespace-nowrap">
                  phew@{user.username}:{path}$
                </div>
                <div className="text-gray-200 whitespace-pre-wrap break-all selection:bg-teal-500 selection:text-slate-900">
                  {Array.from(command.slice(0, caretPosition)).map(
                    (char: string, idx: number) => (
                      <span key={idx}>{char}</span>
                    )
                  )}
                  <span
                    ref={caret}
                    className={`h-5 text-gray-200 selection:border-0 border-white border ${
                      isFocused && "animate-blink"
                    }`}
                  >
                    {command[caretPosition] || " "}
                  </span>
                  {Array.from(command.slice(caretPosition + 1)).map(
                    (char: string, idx: number) => (
                      <span key={idx}>{char}</span>
                    )
                  )}
                </div>
              </div>
              {isProcessing && <Processing />}
            </div>
          </label>
        </div>
      </UserContext.Provider>
    </CommandContext.Provider>
  );
};

export default Home;

export function getServerSideProps({
  req,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: {
    initUser: ShareableUser;
    token: string;
  };
}> {
  return new Promise<{
    props: {
      initUser: ShareableUser;
      token: string;
    };
  }>(
    (
      resolve: (value: {
        props: {
          initUser: ShareableUser;
          token: string;
        };
      }) => void,
      reject: (reason?: any) => void
    ): void => {
      const token: string | undefined = req.cookies.jwt;
      if (token && !isEmpty(token)) {
        verify(token)
          .then(({ _id }: { _id: ObjectId | null }): void => {
            if (_id) {
              login({ _id: String(_id) })
                .then(({ data }: { data: any }): void => {
                  resolve({
                    props: {
                      initUser: data.data.user,
                      token: data.data.token,
                    },
                  });
                })
                .catch((err: any): void => {
                  resolve({
                    props: {
                      initUser: defaultUser,
                      token: "",
                    },
                  });
                });
            } else {
              resolve({
                props: {
                  initUser: defaultUser,
                  token: "",
                },
              });
            }
          })
          .catch((): void => {
            resolve({
              props: {
                initUser: defaultUser,
                token: "",
              },
            });
          });
      } else {
        resolve({
          props: {
            initUser: defaultUser,
            token: "",
          },
        });
      }
    }
  );
}
