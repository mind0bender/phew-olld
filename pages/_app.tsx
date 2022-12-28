import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";
import { ShareableUser } from "../helpers/shareableModel";
import {
  Context,
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

export type UserType = [ShareableUser, Dispatch<SetStateAction<ShareableUser>>];

export const defaultUser: ShareableUser = {
  username: "stem",
  email: "",
};

export const UserContext: Context<UserType> = createContext<UserType>([
  defaultUser,
  (): void => {},
]);

export type CommandType = {
  command: [string, Dispatch<SetStateAction<string>>];
  caretPosition: [number, Dispatch<SetStateAction<number>>];
};

export const defaultCommand: CommandType = {
  command: ["", (): void => {}],
  caretPosition: [0, (): void => {}],
};

export const CommandContext: Context<CommandType> =
  createContext<CommandType>(defaultCommand);

function MyApp({ Component, pageProps }: AppProps) {
  const [command, setCommand] = useState<string>("");
  const [caretPosition, setCaretPosition] = useState<number>(0);
  const [user, setUser] = useState<ShareableUser>(defaultUser);
  // pink; initUser in layout
  return (
    <CookiesProvider>
      <CommandContext.Provider
        value={{
          command: [command, setCommand],
          caretPosition: [caretPosition, setCaretPosition],
        }}
      >
        <UserContext.Provider value={[user, setUser]}>
          <Component {...pageProps} />
        </UserContext.Provider>
      </CommandContext.Provider>
    </CookiesProvider>
  );
}

export default MyApp;
