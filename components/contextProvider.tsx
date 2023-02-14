import { FC, ReactNode, useState, useEffect } from "react";
import { ShareableUser } from "../helpers/shareableModel";

import { Dispatch, SetStateAction, Context, createContext } from "react";
import { CookiesProvider } from "react-cookie";

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

export type EditorContextType = [
  editorWindowOpen: boolean,
  setEditorWindowOpen: Dispatch<SetStateAction<boolean>>
];

export const EditorContext: Context<EditorContextType> =
  createContext<EditorContextType>([false, (): void => {}]);

interface ContextProviderProps {
  children: ReactNode;
  initUser?: ShareableUser;
}

const ContextProvider: FC<ContextProviderProps> = ({
  children,
  initUser,
}: ContextProviderProps): JSX.Element => {
  const [command, setCommand] = useState<string>("");
  const [caretPosition, setCaretPosition] = useState<number>(0);
  const [user, setUser] = useState<ShareableUser>(initUser || defaultUser);
  const [editorWindowOpen, setEditorWindowOpen] = useState<boolean>(false);

  return (
    <CookiesProvider>
      <CommandContext.Provider
        value={{
          command: [command, setCommand],
          caretPosition: [caretPosition, setCaretPosition],
        }}
      >
        <EditorContext.Provider value={[editorWindowOpen, setEditorWindowOpen]}>
          <UserContext.Provider value={[user, setUser]}>
            {children}
          </UserContext.Provider>
        </EditorContext.Provider>
      </CommandContext.Provider>
    </CookiesProvider>
  );
};

export default ContextProvider;
