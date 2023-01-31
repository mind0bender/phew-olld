import React, { FC, MouseEvent, MouseEventHandler, ReactNode } from "react";
import ContextMenu from "./contextMenu";

export interface ErrorData {
  msg: string;
  errors: string[];
}

const ErrorComponent: FC<ErrorData> = ({
  msg,
  errors,
}: ErrorData): JSX.Element => {
  return (
    <ContextMenu
      title="Error Menu"
      options={{
        "copy error": (): void => {
          navigator.clipboard.writeText(
            `${JSON.stringify(
              { message: msg, errors } || "No internet",
              null,
              2
            )} error in phew`
          );
        },
        "report a bug": (): void => {
          console.log("pink; This feature has not been implemented yet.");
        },
      }}
    >
      <div className="border-l-4 cursor-default px-2 border-error-900 hover:border-error-700 hover:bg-secondary-800 py-2">
        <div className="text-lg font-bold">Error: {msg}</div>
        <div className="pl-6">
          {errors ? (
            errors.map((err: string, idx: number): ReactNode => {
              return <div key={idx}>{err}</div>;
            })
          ) : (
            <span>
              There was some Error
              <br />
              Make sure you are connected to the internet.
            </span>
          )}
        </div>
      </div>
    </ContextMenu>
  );
};

/**
 * [
  "oops: command not found"
]
 */

// pink;
// add a bug report button for error

export default ErrorComponent;
