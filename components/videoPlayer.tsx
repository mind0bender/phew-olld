import {
  useRef,
  FC,
  MutableRefObject,
  useEffect,
  useState,
  HTMLAttributes,
} from "react";

interface VideoPlayerProps extends HTMLAttributes<HTMLVideoElement> {
  src: string;
  title?: string;
  autoPlay?: boolean;
  autoFullscreen?: boolean;
  muted?: boolean;
}

const VideoPlayer: FC<VideoPlayerProps> = ({
  src,
  title,
  autoPlay = false,
  autoFullscreen = false,
  muted = false,
}: VideoPlayerProps): JSX.Element => {
  const vdo: MutableRefObject<HTMLVideoElement | null> =
    useRef<HTMLVideoElement | null>(null);

  const [progress, setProgress] = useState<number>(0);

  useEffect((): (() => void) => {
    if (autoFullscreen) {
      vdo.current?.requestFullscreen().catch(console.error);
    }
    return (): void => {};
  }, [autoFullscreen]);

  const onClick: React.MouseEventHandler = (): void => {
    if (vdo.current?.paused) {
      vdo.current.play();
    } else {
      vdo.current?.pause();
    }
  };

  const onProgress: React.ReactEventHandler<HTMLVideoElement> = (
    e: React.SyntheticEvent<HTMLVideoElement>
  ): void => {
    if (vdo.current) {
      setProgress((vdo.current?.currentTime / vdo.current?.duration) * 100);
    }
  };

  return (
    <div className="w-full ring-1 duration-300 ring-theme-400 max-w-md aspect-video rounded-md p-0.5">
      <div
        onClick={onClick}
        className="w-full rounded-md relative hover:ring-1 ring-theme-400 hover:scale-[99%] duration-300 bg-secondary-900"
      >
        <video
          ref={vdo}
          onTimeUpdate={onProgress}
          className="w-full rounded-md"
          autoPlay={autoPlay}
          muted={muted}
        >
          <source src={src} />
        </video>
        <div className="w-full h-1 absolute bottom-1 left-0">
          <div
            className={`rounded-bl-md relative bg-theme-400 h-2`}
            style={{
              width: `${progress}%`,
            }}
          >
            <div className="h-2 w-1 ring-theme-400 ring-2 bg-theme-400 absolute right-0 -top-[0.55] " />
          </div>
        </div>
      </div>
      <div className="w-full text-center flex justify-center">{title}</div>
    </div>
  );
};

export default VideoPlayer;
