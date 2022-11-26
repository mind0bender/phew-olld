import React, { FC, ReactNode } from "react";

export interface ErrorData {
  data: { msg: string; errors: string[] };
}

const ErrorComponent: FC<ErrorData> = ({ data }: ErrorData): JSX.Element => {
  return (
    <div className="border-l-4 px-2 border-red-800 hover:border-red-700 hover:bg-slate-800 py-2 rounded-sm">
      <div>{data.msg}</div>
      <div className="pl-6">
        {data.errors.map((err: string, idx: number): ReactNode => {
          return <div key={idx}>{err}</div>;
        })}
      </div>
    </div>
  );
};

export default ErrorComponent;
