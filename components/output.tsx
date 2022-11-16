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
        <span className="text-teal-300 whitespace-nowrap">{prompt}</span>
        <span>{command}</span>
      </div>
      <div className="py-2">{output}</div>
    </div>
  );
};

export default Output;
