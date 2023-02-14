import { FC, ReactNode } from "react";

interface ObjectMapProps {
  obj: {
    [key in string]: ReactNode;
  };
}

const ObjectMap: FC<ObjectMapProps> = ({
  obj,
}: ObjectMapProps): JSX.Element => {
  return (
    <div className="pl-6 whitespace-nowrap pt-2 max-w-fit">
      <div>+----</div>
      <div className="flex">
        <span>|</span>
        <span className="divide-y">
          {Object.keys(obj).map((key: string, idx: number): JSX.Element => {
            return (
              <div key={idx} className="flex flex-col sm:flex-row gap-2">
                <div>{key}:</div>
                <div>{obj[key]}</div>
              </div>
            );
          })}
        </span>
        <span className="grow flex flex-col-reverse">|</span>
      </div>
      <div className="flex flex-row-reverse">----+</div>
    </div>
  );
};

export default ObjectMap;
