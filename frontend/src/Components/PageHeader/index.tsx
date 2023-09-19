import { MdArrowBack } from "react-icons/md";
import Button from "../Button/Button";

interface PageHeaderProps {
  title: string;
  handleGoBack?: () => void;
}

const PageHeader = ({ title, handleGoBack }: PageHeaderProps) => {
  return (
    <div
      className="w-full sticky top-0 z-10 scroll-smooth shadow-sm bg-backdrop-25
     backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="w-full h-20 flex justify-start items-center px-4">
        {handleGoBack && (
          <Button
            isDisableRipple
            variant="icon-only"
            className="flex justify-center items-center bg-transparent my-0 -ml-3 mr-2"
            onClick={handleGoBack}
            icon={<MdArrowBack className="text-para-100 text-2xl" />}
          />
        )}
        <p className="text-gray-600 text-left text-xl font-medium mb-0 transition-all">
          {title}
        </p>
      </div>
    </div>
  );
};
export default PageHeader;
