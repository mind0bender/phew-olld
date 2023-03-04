import React, {
  KeyboardEvent,
  KeyboardEventHandler,
  memo,
  NamedExoticComponent,
  useCallback,
  useState,
} from "react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { FC } from "react";
import MemoizedPreview from "./preview";
import Processing from "./processing";

export interface MonacoEditorProps {
  placeholder: string;
  onExit?: () => void;
  onSave?: (mdContent: string) => void;
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  placeholder,
  onExit,
  onSave,
}: MonacoEditorProps): JSX.Element => {
  const handleMount: (editor: any, monaco: any) => void = useCallback(
    (_editor: any, _monaco: any): void => {
      console.log("editor mounted!");
    },
    []
  );

  const [markdown, setMarkDown] = useState(placeholder);

  const changeHandler: (md: any) => void = useCallback((md: any): void => {
    setMarkDown(md);
  }, []);

  const keyDownHandler: KeyboardEventHandler = useCallback(
    (e: KeyboardEvent): void => {
      if (e.ctrlKey && !e.shiftKey) {
        if (onExit && e.key.toLowerCase() == "q") {
          e.preventDefault();
          onExit();
        } else if (onSave && e.key.toLowerCase() == "s") {
          e.preventDefault();
          onSave(markdown);
        }
      }
    },
    [onExit, onSave, markdown]
  );

  return (
    <div
      onKeyDown={keyDownHandler}
      className={`flex flex-col md:flex-row divide-y md:divide-y-0 divide-x-0 md:divide-x w-full h-full`}>
      <div className="flex p-2 flex-col h-1/2 md:h-full w-full md:w-1/2">
        <div className={`w-full h-full grow z-0 flex flex-col`}>
          <MemoizedEditor
            placeholder={placeholder}
            onChange={changeHandler}
            onMount={handleMount}
          />
          <div className={`flex justify-end px-4 divide-x w-full text-xs`}>
            <span onClick={onExit} className={`px-2`}>
              exit: ^q
            </span>
            <span
              onClick={(): void => {
                onSave && onSave(markdown);
              }}
              className={`px-2`}>
              save: ^s
            </span>
          </div>
        </div>
      </div>
      <div className={`h-1/2 md:h-full md:w-1/2`}>
        <MemoizedPreview markdown={markdown} />
      </div>
    </div>
  );
};

interface EditorProps {
  placeholder?: string;
  onMount?: OnMount;
  onChange?: OnChange;
}

const MemoizedEditor: NamedExoticComponent<EditorProps> = memo(
  function MonacoEditor({
    placeholder,
    onChange,
    onMount,
  }: EditorProps): JSX.Element {
    return (
      <Editor
        loading={<Processing fixed msg={`importing editor`} />}
        defaultLanguage="markdown"
        defaultValue={placeholder}
        className="w-full grow"
        theme="hc-black"
        onMount={onMount}
        onChange={onChange}
      />
    );
  }
);

export default MonacoEditor;
