import { AnimatePresence, motion } from "framer-motion";
import { HTMLProps, RefObject, useRef } from "react";
import useClickOutside from "../../Hooks/useClickOutside";
import Button from "../Button/Button";

interface ContextMenuProps extends HTMLProps<HTMLDivElement> {
  children: JSX.Element | JSX.Element[];
  isShowContext: boolean;
  anchorElement: HTMLElement | null;
  onCloseContext: (e: MouseEvent | undefined) => void;
}

interface ContextMenuItemProps extends HTMLProps<HTMLParagraphElement> {
  children?: JSX.Element | JSX.Element[] | string;
  displayTitle?: string;
  icon?: JSX.Element;
  onClick?: () => void;
}

const ContextMenu = ({
  children,
  isShowContext,
  onCloseContext,
  anchorElement,
  ...rest
}: ContextMenuProps) => {
  const contextMenuRef: RefObject<HTMLElement | undefined> = useRef();
  useClickOutside(contextMenuRef, onCloseContext, anchorElement);
  return (
    <AnimatePresence>
      {isShowContext && (
        <motion.div
          initial={{ x: 8, height: 0 }}
          animate={{ x: 0, height: "auto" }}
          exit={{ x: 8, height: 0 }}
          transition={{ delay: 0.1 }}
          className={`origin-top-right absolute -right-2 mt-1 -top-3 w-36 rounded-md shadow-lg bg-gray-100 focus:outline-none z-20 transition ease-out duration-100 overflow-hidden`}
        >
          <div ref={contextMenuRef as RefObject<HTMLDivElement>} {...rest}>
            <div className="py-1">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ContextMenuItem = ({
  children,
  displayTitle,
  onClick,
  className,
  icon,
  ...rest
}: ContextMenuItemProps) => {
  return (
    <div onClick={onClick} className="cursor-pointer flex items-center">
      {children && children}
      {!children && (displayTitle || Boolean(icon)) && (
        <>
          {icon && (
            <Button
              variant="icon-only"
              className="flex justify-center items-center bg-transparent my-0"
              icon={icon}
              isDisableRipple
            />
          )}
          {displayTitle && (
            <p
              className={`text-para-100 block ${
                icon ? "px-0" : "px-4"
              } py-2 text-sm tracking-wider font-bold ${className || ""}`}
              {...rest}
            >
              {displayTitle}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ContextMenu;
