import { ReactNode } from "react";

interface OutputData {
  prompt: string;
  command: string;
  output: ReactNode;
}

const Output: React.FC<OutputData> = ({
  prompt,
  command,
  output,
}: OutputData) => {
  return (
    <div>
      <div className="flex gap-2">
        <span className="text-emerald-300">{prompt}</span>
        <span>{command}</span>
      </div>
      <div>{output}</div>
    </div>
  );
};

export default Output;
