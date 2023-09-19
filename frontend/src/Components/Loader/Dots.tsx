import loaderImage from "../../assets/images/loading-dots.svg";

const Loader = ({ width = 96 }: { width?: string | number }) => {
  return (
    <img src={loaderImage} alt="loader-img" width={width} className="mx-auto" />
  );
};

export default Loader;
