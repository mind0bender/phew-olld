import { ReactNode } from "react";

interface OutputData {
  children?: ReactNode;
}

const Output: React.FC<OutputData> = ({
  children,
}: OutputData): JSX.Element => {
  return <div className="text-white cursor-default py-2">{children}</div>;
};

export default Output;
