import React, { InputHTMLAttributes } from "react";

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  onChange,
  className,
  ...rest
}) => {
  return (
    <div className="w-52 mx-auto">
      <input
        onChange={onChange}
        className={`border-gray-300 border rounded-md px-3 py-3 my-3 focus:outline-gray-500 text-gray-500 font-semibold focus:outline-1 w-full tracking-extra leading-4 placeholder:tracking-normal placeholder:font-medium transition-all ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Input;
