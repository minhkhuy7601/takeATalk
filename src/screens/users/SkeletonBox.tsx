import clsx from 'clsx';

const SkeletonBox = () => {
  return (
    <div
      className={clsx(
        `
    relative
    flex 
    w-full 
    animate-pulse 
    cursor-pointer 
    items-center 
    space-x-3
    rounded-lg
    p-3
    transition
    `
      )}
    >
      <div className="relative">
        <div
          className="
        relative 
        inline-block 
        h-9 
        w-9
        overflow-hidden 
        rounded-full 
        bg-gray-200 
        md:h-11
        md:w-11
      "
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="mb-1 flex items-center justify-between">
            <p className="h-5 w-2/3 rounded-md bg-gray-200 text-base font-medium" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonBox;
