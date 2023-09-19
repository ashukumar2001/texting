import React from "react";
import Backdrop from "./Backdrop";
import Dots from "./Dots";

const Loading = ({
  isBackgroundBlur = true,
}: {
  isBackgroundBlur?: boolean;
}) => {
  return (
    <Backdrop isBackgroundBlur={isBackgroundBlur}>
      <Dots />
    </Backdrop>
  );
};

export default Loading;
