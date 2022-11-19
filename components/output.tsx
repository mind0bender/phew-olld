import { ReactNode } from "react";

interface OutputData {
  children?: ReactNode;
}

const Output: React.FC<OutputData> = ({ children }: OutputData) => {
  return <div className="text-white py-2">{children}</div>;
};

export default Output;
