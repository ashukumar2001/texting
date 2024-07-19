import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

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
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft size={20} strokeWidth={1.75} />
          </Button>
        )}
        <p className="text-left text-md font-medium mb-0 transition-all ml-2">
          {title}
        </p>
      </div>
    </div>
  );
};
export default PageHeader;
