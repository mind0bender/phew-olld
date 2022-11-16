import React, { ReactNode } from "react";

function Error({ data }: { data: { msg: string; errors: string[] } }) {
  return (
    <div className="border-l-4 px-2 border-red-800">
      <div>{data.msg}</div>
      <div className="pl-6">
        {data.errors.map((err: string, idx): ReactNode => {
          return <div key={idx}>{err}</div>;
        })}
      </div>
    </div>
  );
}

export default Error;
