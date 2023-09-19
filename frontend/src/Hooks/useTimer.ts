import React, { useEffect, useState } from "react";

const useTimer = (time: number) => {
  const [seconds, setSeconds] = useState(time % 60 || 0);
  const [minutes, setMinutes] = useState(Math.floor(time / 60) || 0);

  const restartTimer = () => {
    setSeconds(time % 60 || 0);
    setMinutes(Math.floor(time / 60) || 0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds, minutes]);

  return {
    seconds,
    minutes,
    timeString: `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`,
    restartTimer,
  };
};

export default useTimer;
