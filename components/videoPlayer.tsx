import {
  useRef,
  FC,
  MutableRefObject,
  useState,
  HTMLAttributes,
  ReactNode,
  ReactEventHandler,
  useCallback,
} from "react";
import {
  useFullScreenHandle,
  FullScreen,
  FullScreenHandle,
} from "react-full-screen";
import secondsToTime from "../helpers/secondsToTime";
import Processing from "./processing";
import {
  BiFullscreen,
  BiExitFullscreen,
  BiVolumeFull,
  BiVolumeMute,
} from "react-icons/bi";
import Slider from "./slider";

interface VideoPlayerProps extends HTMLAttributes<HTMLVideoElement> {
  src: string;
  title?: string;
  autoPlay?: boolean;
  defaultVolume?: number;
  loader?: ReactNode;
}

const VideoPlayer: FC<VideoPlayerProps> = ({
  src,
  title,
  autoPlay = false,
  defaultVolume = 100,
  loader = <Processing />,
}: VideoPlayerProps): JSX.Element => {
  const vdo: MutableRefObject<HTMLVideoElement | null> =
    useRef<HTMLVideoElement | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [isMuted, setisMuted] = useState<boolean>(defaultVolume == 0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const fullScreenHandler: FullScreenHandle = useFullScreenHandle();

  const onClickHandler: React.MouseEventHandler = (): void => {
    if (vdo.current?.paused) {
      vdo.current.play();
    } else {
      vdo.current?.pause();
    }
  };

  const onProgressHandler: React.ReactEventHandler<HTMLVideoElement> = (
    _e: React.SyntheticEvent<HTMLVideoElement>
  ): void => {
    if (vdo.current) {
      setProgress(vdo.current?.currentTime);
    }
  };

  const onCanPlayHandler: ReactEventHandler<HTMLVideoElement> = (): void => {
    setCanPlay(true);
  };

  const onVolumeChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value: number = parseInt(e.target.value);
    if (typeof value == "number" && value >= 0 && value <= 100) {
      setVolume(value);
      if (vdo.current) {
        vdo.current.volume = value / 100;
      }
    }
  };

  const toggleFullscreenHandler: (active?: boolean) => void = useCallback(
    (active: boolean = isFullScreen): void => {
      if (active) {
        fullScreenHandler.exit();
      } else {
        fullScreenHandler.enter();
      }
      setIsFullScreen(!active);
    },
    [fullScreenHandler, isFullScreen]
  );

  const onSeekVideo: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value: number = parseInt(e.target.value);
    if (value >= 0 && vdo.current?.duration && value <= vdo.current?.duration) {
      if (vdo.current) {
        setProgress(value);
        vdo.current.currentTime = value;
      }
    }
  };

  return (
    <FullScreen
      className={`flex justify-center items-center ${
        isFullScreen ? "px-1" : "max-w-md"
      }`}
      onChange={(state): void => {
        setIsFullScreen(state);
      }}
      handle={fullScreenHandler}
    >
      <div className="w-full group ring-2 duration-200 ring-theme-400 rounded-sm p-0.5">
        <div
          className={`relative ${
            !isFullScreen && "group-hover:scale-[99%]"
          } duration-200`}
        >
          <div
            onClick={onClickHandler}
            className="w-full flex justify-center items-center rounded-sm relative hover:ring-1 ring-theme-400 bg-secondary-900"
          >
            <div
              className={`${
                canPlay ? "hidden" : "block"
              } w-full flex justify-center items-center rounded-sm aspect-video object-cover`}
            >
              {loader}
            </div>
            <video
              onCanPlay={onCanPlayHandler}
              ref={vdo}
              onTimeUpdate={onProgressHandler}
              className={`${
                canPlay ? "block" : "hidden"
              } w-full rounded-sm aspect-video object-cover`}
              autoPlay={autoPlay}
              muted={isMuted}
            >
              <source src={src} />
            </video>
          </div>
          <div className="w-full absolute group-hover:flex hidden opacity-0 group-hover:opacity-100 top-0 text-center justify-center duration-200 bg-gradient-to-b rounded-t-sm px-4 py-6 from-secondary-900 to-transparent">
            {title}
          </div>
          <div className="absolute shadow-sm w-fit z-10 py-1 px-4 rounded-sm scale-0 opacity-0 group-hover:opacity-100 group-hover:scale-100 bottom-10 left-2 flex justify-center items-center gap-2 bg-secondary-800 ring-2 ring-secondary-900 ring-opacity-70 bg-opacity-70 duration-200">
            <div className="w-12 flex items-center justify-center">
              <div title={`volume: ${volume}%`}>
                <Slider
                  value={isMuted ? 0 : volume}
                  onChange={onVolumeChangeHandler}
                />
              </div>
            </div>
            <div title={isMuted ? "unmute" : "mute"}>
              <div
                aria-label={isMuted ? "unmute" : "mute"}
                onClick={(): void =>
                  setisMuted((pIM: boolean): boolean => !pIM)
                }
              >
                {isMuted ? (
                  <BiVolumeMute className="text-xl md:text-3xl cursor-pointer" />
                ) : (
                  <BiVolumeFull className="text-xl md:text-3xl cursor-pointer" />
                )}
              </div>
            </div>
          </div>
          <div
            onClick={(): void => toggleFullscreenHandler()}
            className="absolute cursor-pointer shadow-sm w-fit z-10 p-1 rounded-sm scale-0 opacity-0 group-hover:opacity-100 group-hover:scale-100 bottom-10 right-2 flex justify-center items-center gap-2 bg-secondary-800 ring-2 ring-secondary-900 ring-opacity-70 bg-opacity-70 duration-200"
          >
            <div title={isFullScreen ? "exit fullscreen" : "enter fullscreen"}>
              <div aria-label="fullscreen">
                {isFullScreen ? (
                  <BiExitFullscreen className="text-xl md:text-3xl" />
                ) : (
                  <BiFullscreen className="text-xl md:text-3xl" />
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center items-center opacity-100  group-hover:opacity-100 group-hover:bg-gradient-to-t from-secondary-900 to-transparent px-4 py-4 absolute bottom-0 rounded-b-sm left-0 duration-200">
            <div
              className="w-full"
              title={`${secondsToTime(progress)} / ${secondsToTime(
                vdo.current?.duration || 0
              )}`}
            >
              <Slider
                name="progress seeker"
                onChange={onSeekVideo}
                max={vdo.current?.duration}
                value={progress}
              />
            </div>
          </div>
        </div>
      </div>
    </FullScreen>
  );
};

export default VideoPlayer;
