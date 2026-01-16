const Skeleton = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
};

export default Skeleton;
