export const Prompt = ({
  path,
  username,
}: {
  path: string;
  username: string;
}) => {
  return (
    <span className="text-teal-300 whitespace-nowrap">
      {`phew@${username}:${path}$`}
    </span>
  );
};
