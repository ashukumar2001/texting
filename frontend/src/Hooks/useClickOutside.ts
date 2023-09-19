import { RefObject, useEffect } from "react";

const useClickOutside = (
  ref: RefObject<HTMLElement | undefined>,
  _callback: (e?: MouseEvent) => void,
  anchorElement: HTMLElement | null
) => {
  let currentAnchorElement = anchorElement;
  let callback = _callback;
  const handleClick: (e: MouseEvent) => void = (e) => {
    if (
      ref.current &&
      anchorElement &&
      !ref.current.contains(e.target as Node) &&
      !anchorElement?.contains(e.target as Node)
    ) {
      callback(e);
    }
  };

  useEffect(() => {
    currentAnchorElement = anchorElement;
    callback = _callback;
  });

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useClickOutside;
