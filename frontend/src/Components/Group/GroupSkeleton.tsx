import { useId } from "react";

const GroupSkeleton = ({
  isSearchItem = false,
}: {
  isSearchItem?: boolean;
}) => {
  const key = useId();
  return (
    <div key={key} className="w-full px-2 my-2 cursor-pointer">
      <div
        className={`border-b border-gray-200 border-solid h-20 flex items-${
          isSearchItem ? "center" : "start"
        } justify-start p-3`}
      >
        <div className="h-12 w-12 bg-gray-300 items-center rounded-full animate-pulse"></div>
        <div className="flex-col ml-3 mr-2 grow">
          <div className="flex grow justify-between">
            <div className="mb-1 h-5 w-24 bg-gray-300 animate-pulse rounded"></div>
            {!isSearchItem && (
              <div className="h-4 w-8 bg-gray-300 animate-pulse rounded"></div>
            )}
          </div>
          {!isSearchItem && (
            <div className="h-4 w-56 inline-block max-w-full sm:w-full bg-gray-300 animate-pulse rounded"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSkeleton;
