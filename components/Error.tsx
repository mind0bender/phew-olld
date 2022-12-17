import React, { FC, ReactNode } from "react";

export interface ErrorData {
  data: { msg: string; errors: string[] };
}

const ErrorComponent: FC<ErrorData> = ({ data }: ErrorData): JSX.Element => {
  return (
    <div className="border-l-4 cursor-auto px-2 border-error-900 hover:border-error-700 hover:bg-secondary-800 py-2 rounded-sm">
      <div>{data.msg}</div>
      <div className="pl-6">
        {data.errors.map((err: string, idx: number): ReactNode => {
          return <div key={idx}>{err}</div>;
        })}
      </div>
    </div>
  );
};

// pink;
// add a bug report button for error

export default ErrorComponent;
