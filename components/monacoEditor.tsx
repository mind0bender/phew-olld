import React, {
  KeyboardEvent,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Editor from "@monaco-editor/react";
import { FC } from "react";
import mdToHtml from "../helpers/mdtohtml";

export interface MonacoEditorProps {
  open: boolean;
  placeholder: string;
  onExit?: () => void;
  onSave?: (mdContent: string) => void;
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  open,
  placeholder,
  onExit,
  onSave,
}: MonacoEditorProps): JSX.Element => {
  const handleMount: (editor: any, monaco: any) => void = useCallback(
    (editor: any, monaco: any): void => {
      console.log("editor mounted!");
    },
    []
  );

  const [markDown, setMarkDown] = useState(placeholder);

  const [htmlPreview, setHtmlPreview] = useState("");

  useEffect((): (() => void) => {
    mdToHtml(markDown)
      .then((generatedHTML: string): void => {
        setHtmlPreview(generatedHTML);
      })
      .catch(console.error);
    return (): void => {};
  }, [markDown]);

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
          onSave(markDown);
        }
      }
    },
    [onExit, onSave, markDown]
  );

  return (
    <div
      onKeyDown={keyDownHandler}
      className={`${
        open ? "" : "hidden"
      } flex flex-col md:flex-row divide-y md:divide-y-0 divide-x-0 md:divide-x w-full h-full`}>
      <div className="flex flex-col h-1/2 md:h-full w-full md:w-1/2">
        <div className={`w-full grow`}>
          <Editor
            defaultLanguage="markdown"
            defaultValue={placeholder}
            className="w-full"
            theme="hc-black"
            onMount={handleMount}
            onChange={changeHandler}
          />
        </div>
        <div className={`flex divide-x w-full text-xs`}>
          <span className={`px-2`}>exit: ^q</span>
          <span className={`px-2`}>save: ^s</span>
        </div>
      </div>
      <div
        className={
          `h-1/2 md:h-full md:w-1/2 ` +
          `preview nochildmargin scrollable ` +
          `prose-a:text-indigo-500 prose-blockquote:bg-slate-900 prose prose-blockquote:border-y-2 prose-blockquote:border-y-slate-800`
        }
        dangerouslySetInnerHTML={{ __html: htmlPreview }}
      />
    </div>
  );
};

export default MonacoEditor;
