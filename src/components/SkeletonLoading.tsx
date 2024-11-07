import React from "react";

interface SkeletonLoadingProps {
  count?: number; // Jumlah skeleton items yang akan ditampilkan
  showImage?: boolean; // Opsi untuk menampilkan skeleton image
}

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  count = 1,
  showImage = true,
}) => {
  const pulseAnimation = "animate-pulse";

  const SkeletonItem = () => (
    <div className="w-full mb-8 bg-primary overflow-hidden">
      {/* Skeleton untuk gambar */}
      {showImage && (
        <div className={`w-full h-48 bg-gray-200 ${pulseAnimation}`} />
      )}

      <div className="p-4">
        {/* Skeleton untuk judul */}
        <div
          className={`h-6 bg-gray-300 rounded-md w-3/4 mb-4 ${pulseAnimation}`}
        />

        {/* Skeleton untuk meta info (tanggal, penulis) */}
        <div className="flex space-x-4 mb-4">
          <div className={`h-4 bg-gray-300 rounded w-24 ${pulseAnimation}`} />
          <div className={`h-4 bg-gray-300 rounded w-32 ${pulseAnimation}`} />
        </div>

        {/* Skeleton untuk paragraf */}
        <div className="space-y-3 w-4/5">
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
        </div>

        <div className="mt-5 space-y-3 w-11/12">
          <div className={`h-4 bg-gray-300 rounded  ${pulseAnimation}`} />
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
        </div>
        <div className="mt-10 space-y-3 w-4/5">
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
        </div>
        <div className="space-y-3 w-3/5 mt-7">
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
          <div className={`h-4 bg-gray-300 rounded ${pulseAnimation}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {[...Array(count)].map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoading;
