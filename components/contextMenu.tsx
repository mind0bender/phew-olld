import { FC, MouseEvent, MouseEventHandler, ReactNode, useState } from "react";

interface ContextMenuProps {
  title?: string;
  options: {
    [key in string]: MouseEventHandler<HTMLButtonElement>;
  };
  children: ReactNode;
}

const ContextMenu: FC<ContextMenuProps> = ({
  title,
  options,
  children,
}: ContextMenuProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pos, setPos] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  const onContextMenu: MouseEventHandler<HTMLDivElement> = (
    e: MouseEvent<HTMLDivElement>
  ): void => {
    e.preventDefault();
    setIsOpen(true);
    setPos({
      x: e.pageX,
      y: e.pageY,
    });
  };

  return (
    <>
      <div onContextMenu={onContextMenu}>{children}</div>
      <div
        onClick={(): void => {
          setIsOpen(false);
        }}
        className={`${
          isOpen ? "block" : "hidden"
        } fixed top-0 left-0 w-screen h-screen`}
      />
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } flex flex-col gap-2 absolute bg-black border-theme-400 border py-1`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      >
        <div className="px-2 font-black underline underline-offset-2 text-center">
          {title}
        </div>
        <div className="flex flex-col divide-y border-y border-secondary-400 divide-secondary-400">
          {Object.keys(options).map(
            (option: string, idx: number): JSX.Element => {
              const onOptionClick: MouseEventHandler<HTMLButtonElement> = (
                e: MouseEvent<HTMLButtonElement>
              ): void => {
                options[option](e);
                setIsOpen(false);
              };
              return (
                <button
                  className="px-2 w-full text-left hover:bg-secondary-300 hover:text-black"
                  key={idx}
                  onClick={onOptionClick}
                >
                  {option}
                </button>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default ContextMenu;
