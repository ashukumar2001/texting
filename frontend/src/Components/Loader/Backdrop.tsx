const Backdrop = ({
  children,
  isBackgroundBlur = true,
}: {
  children: JSX.Element | JSX.Element[];
  isBackgroundBlur?: boolean;
}) => {
  return (
    <div
      className={`${
        isBackgroundBlur ? "bg-backdrop-425" : ""
      } absolute inset-0 w-full h-full  flex align-middle justify-center pointer-events-none z-50`}
      onClick={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
};

export default Backdrop;
