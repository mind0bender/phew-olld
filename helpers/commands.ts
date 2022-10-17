const runCommand: (prompt: string, command: string) => string[] | false = (
  prompt: string,
  command: string
): string[] | false => {
  const cmd = command.trim();
  if (!cmd.length) {
    return generateOutput(prompt, command, []);
  }
  if (cmd.startsWith(".help")) {
    return generateOutput(prompt, command, help());
  } else {
    return false;
  }
};

const generateOutput: (
  prompt: string,
  command: string,
  output: string[]
) => string[] = (prompt: string, command: string, output: string[]) => {
  return [prompt + " " + command, ...output];
};

const help: () => string[] = (): string[] => {
  return [".help - don't know what to do?"];
};

export default runCommand;
