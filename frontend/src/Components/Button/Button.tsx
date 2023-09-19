import React, { ButtonHTMLAttributes, MouseEvent, useEffect } from "react";
import styles from "./Button.module.scss";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "stroke" | "outlined" | "icon" | "icon-only";
  buttonText?: string;
  icon?: JSX.Element;
  isDisableRipple?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  buttonText,
  icon,
  className,
  onClick,
  isDisableRipple,
  ...rest
}) => {
  const [coords, setCoords] = React.useState<{ x: number; y: number }>({
    x: -1,
    y: -1,
  });
  const [isRippling, setIsRippling] = React.useState<boolean>(false);

  useEffect(() => {
    if (!isDisableRipple) {
      if (coords.x !== -1 && coords.y !== -1) {
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 300);
      } else {
        setIsRippling(false);
      }
    }
  }, [coords]);

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);

  return (
    <button
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        onClick && onClick(e);
      }}
      className={`relative ${className} my-2 overflow-hidden transition-all duration-150 ${
        variant === "icon" || variant === "icon-only"
          ? `w-11 h-11 rounded-50 ${
              variant === "icon-only" ? "bg-transparent" : "bg-gray-500"
            }`
          : `w-fit px-4 py-2 rounded-md text-base font-medium ${
              variant === "primary"
                ? " bg-gray-500 text-gray-100"
                : variant === "outlined"
                ? "border-gray-500 border"
                : ""
            }`
      }`}
      {...rest}
    >
      {variant !== "icon" && variant !== "icon-only" ? buttonText : icon}

      {isRippling && !isDisableRipple && (
        <span
          className={`w-5 h-5 absolute block rounded-50 ${styles.rippleAnimation}`}
          style={{ left: coords.x, top: coords.y }}
        ></span>
      )}
    </button>
  );
};

export default Button;
