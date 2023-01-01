import {
  FullscreenRounded,
  VolumeOffRounded,
  VolumeUpRounded,
} from "@mui/icons-material";
import { Slider, IconButton, Tooltip } from "@mui/material";
import {
  useRef,
  FC,
  MutableRefObject,
  useEffect,
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

  const onVolumeChangeHandler: (_e: Event, value: number | number[]) => void = (
    _e: Event,
    value: number | number[]
  ): void => {
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

  const onSeekVideo: (_e: Event, value: number | number[]) => void = (
    _e: Event,
    value: number | number[]
  ): void => {
    if (
      typeof value == "number" &&
      value >= 0 &&
      vdo.current?.duration &&
      value <= vdo.current?.duration
    ) {
      if (vdo.current) {
        setProgress(value);
        vdo.current.currentTime = value;
      }
    }
  };

  return (
    <FullScreen
      className={`flex justify-center items-center ${isFullScreen && "px-1"}`}
      handle={fullScreenHandler}
    >
      <div className="w-full group ring-2 duration-200 ring-theme-400 rounded-md p-0.5">
        <div
          className={`relative ${
            !isFullScreen && "group-hover:scale-[99%]"
          } duration-200`}
        >
          <div
            onClick={onClickHandler}
            className="w-full flex justify-center items-center rounded-md relative hover:ring-1 ring-theme-400 bg-secondary-900"
          >
            <div
              className={`${
                canPlay ? "hidden" : "block"
              } w-full flex justify-center items-center rounded-md aspect-video object-cover`}
            >
              {loader}
            </div>
            <video
              onCanPlay={onCanPlayHandler}
              ref={vdo}
              onTimeUpdate={onProgressHandler}
              className={`${
                canPlay ? "block" : "hidden"
              } w-full rounded-md aspect-video object-cover`}
              autoPlay={autoPlay}
              muted={isMuted}
            >
              <source src={src} />
            </video>
          </div>
          <div className="w-full absolute group-hover:flex hidden opacity-0 group-hover:opacity-100 top-0 text-center justify-center duration-200 bg-gradient-to-b rounded-t-md px-4 py-6 from-secondary-900 to-transparent">
            {title}
          </div>
          <div className="absolute shadow-sm w-fit z-10 py-1 px-4 rounded-lg scale-0 opacity-0 group-hover:opacity-100 group-hover:scale-100 bottom-10 left-2 flex justify-center items-center gap-2 bg-secondary-800 ring-2 ring-secondary-900 ring-opacity-70 bg-opacity-70 duration-200">
            <div className="w-12 flex items-center justify-center">
              <Tooltip placement="top" title={`volume: ${volume}%`}>
                <Slider
                  aria-label="volume slider"
                  size="small"
                  color="secondary"
                  value={isMuted ? 0 : volume}
                  onChange={onVolumeChangeHandler}
                />
              </Tooltip>
            </div>
            <Tooltip placement="top" title={isMuted ? "unmute" : "mute"}>
              <IconButton
                size="small"
                aria-label={isMuted ? "unmute" : "mute"}
                color="secondary"
                onClick={(): void =>
                  setisMuted((pIM: boolean): boolean => !pIM)
                }
              >
                {isMuted ? <VolumeOffRounded /> : <VolumeUpRounded />}
              </IconButton>
            </Tooltip>
          </div>
          <div className="absolute shadow-sm w-fit z-10 p-1 rounded-lg scale-0 opacity-0 group-hover:opacity-100 group-hover:scale-100 bottom-10 right-2 flex justify-center items-center gap-2 bg-secondary-800 ring-2 ring-secondary-900 ring-opacity-70 bg-opacity-70 duration-200">
            <Tooltip
              title={isFullScreen ? "exit fullscreen" : "enter fullscreen"}
            >
              <IconButton
                size="small"
                aria-label="fullscreen"
                color="secondary"
                onClick={(): void => toggleFullscreenHandler()}
              >
                {<FullscreenRounded />}
              </IconButton>
            </Tooltip>
          </div>
          <div className="w-full flex justify-center items-center opacity-0  group-hover:opacity-100 group-hover:bg-gradient-to-t from-secondary-900 to-transparent px-4 py-1 absolute bottom-0 rounded-b-md left-0 duration-200">
            <Tooltip
              placement="top"
              title={
                <time>
                  {secondsToTime(progress)} /{" "}
                  {secondsToTime(vdo.current?.duration || 0)}
                </time>
              }
            >
              <Slider
                onChange={onSeekVideo}
                max={vdo.current?.duration}
                min={0}
                size="medium"
                value={progress}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </FullScreen>
  );
};

export default VideoPlayer;
