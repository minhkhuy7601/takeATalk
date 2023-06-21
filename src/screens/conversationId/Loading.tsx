import { BeatLoader, ClipLoader } from 'react-spinners';

export const ClipLoading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ClipLoader size={40} color="#0284c7" />
    </div>
  );
};
export const BeatLoading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <BeatLoader size={10} color="#0284c7" />
    </div>
  );
};
