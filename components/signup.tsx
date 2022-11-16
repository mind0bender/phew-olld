import axios from "axios";
import React, { useEffect } from "react";
import { ShareableUser } from "../helpers/shareableModel";
export interface SignupData {
  user: string;
  pswd: string;
  email: string;
}

function Signup({ data }: { data: ShareableUser }) {
  return (
    <div>
      <div>User created with following information:</div>
      <div className="pl-6 pt-2 max-w-fit">
        <div>+----</div>
        <div className="flex">
          <span>|&nbsp;</span>
          <span>
            <div className="flex gap-2">
              <div>username:</div>
              <div>{data.username}</div>
            </div>
            <div className="flex gap-2">
              <div>email{"   :"}</div>
              <a target="_blank" rel="noreferrer" href={`mailto:${data.email}`}>
                {data.email}
              </a>
            </div>
          </span>
          <span className="grow flex flex-col-reverse">&nbsp;|</span>
        </div>
        <div className="flex flex-row-reverse">----+</div>
      </div>
      {/* {JSON.stringify(data)} */}
      {/* pink; */}
    </div>
  );
}

export default Signup;
