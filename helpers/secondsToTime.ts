const secondsToTime: (seconds: number) => string = (
  seconds: number
): string => {
  const h: number = Math.floor(seconds / 3600);
  const m: number = Math.floor((seconds % 3600) / 60);
  const s: number = Math.floor((seconds % 3600) % 60);

  //   const hDisplay:string = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  //   const mDisplay:string = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  //   const sDisplay:string = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return `${h}:${m}:${s}`;
};

export default secondsToTime;
