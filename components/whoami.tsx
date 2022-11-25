import React, { MutableRefObject, useContext, useEffect, useRef } from "react";
import { ShareableUser } from "../helpers/shareableModel";
import { UserContext, UserType } from "../pages";

function WhoAmI({ userData }: { userData?: ShareableUser }) {
  const [user] = useContext<UserType>(UserContext);
  let userWhenCalled: MutableRefObject<ShareableUser> = useRef<ShareableUser>(
    userData || user
  );
  return (
    <div className="pl-6 pt-2 max-w-fit">
      <div>+----</div>
      <div className="flex">
        <span>|&nbsp;</span>
        <span>
          <div className="flex gap-2">
            <div>username:</div>
            <div>{userWhenCalled.current.username}</div>
          </div>
          <div className="flex gap-2">
            <div>email{"   :"}</div>
            <a
              className="underline decoration-solid hover:decoration-2 decoration-slate-600"
              target="_blank"
              rel="noreferrer"
              href={`mailto:${userWhenCalled.current.email}`}
            >
              {userWhenCalled.current.email}
            </a>
          </div>
        </span>
        <span className="grow flex flex-col-reverse">&nbsp;|</span>
      </div>
      <div className="flex flex-row-reverse">----+</div>
    </div>
  );
}

export default WhoAmI;
