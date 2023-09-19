import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputRef?: React.RefObject<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({ className, inputRef, ...rest }) => {
  return (
    <div className="w-52 mx-auto">
      <input
        ref={inputRef}
        className={`border-gray-300 border rounded-md px-3 py-3 my-3 focus:outline-gray-500 text-gray-600 font-semibold focus:outline-1 w-full tracking-extra leading-4 placeholder:tracking-normal placeholder:font-medium transition-all ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Input;
