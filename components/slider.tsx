import styles from "../styles/slider.module.css";
import { FC } from "react";

export interface SliderProps {
  name?: string;
  min?: number;
  max?: number;
  value?: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Slider: FC<SliderProps> = ({
  onChange,
  value = 0,
  max = 100,
  min = 0,
  name,
}: SliderProps): JSX.Element => {
  return (
    <div className="relative w-full flex justify-center items-center">
      <div className="absolute w-full h-1.5 rounded-sm bg-theme-100">
        <div
          className="bg-theme-400 h-full rounded-l-sm"
          style={{
            width: `calc(${(value / (max - min)) * 100}%)`,
          }}
        />
      </div>
      <input
        type="range"
        onChange={onChange}
        className={`${styles.slider} outline-none z-10`}
        name={name}
        min={min}
        max={max}
        value={value}
      />
    </div>
  );
};

export default Slider;
