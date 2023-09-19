/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect, useState } from "react";

const useScrollableHeight = (
  containerRef: RefObject<HTMLElement | undefined>,
  spaceHeight: number | string,
  dependencyArray: any[] = []
) => {
  const [scrollableHeight, setScrollableHeight] = useState("");
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const mainContainer = containerRef.current;

    if (mainContainer) {
      const mainContainerClientHeight =
        mainContainer?.getClientRects()[0]?.height;
      const h = `calc(100vh - ${
        typeof spaceHeight === "string" ? spaceHeight : spaceHeight + "px"
      } - ${mainContainerClientHeight}px)`;
      setScrollableHeight(h);
      setContainerHeight(mainContainerClientHeight);
    }
  }, dependencyArray);

  return [scrollableHeight, containerHeight];
};

export default useScrollableHeight;
