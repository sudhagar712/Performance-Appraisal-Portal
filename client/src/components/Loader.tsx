type LoaderProps = {
  text?: string;
};

const Loader = ({ text = "Loading..." }: LoaderProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-teal-600" />
        <p className="mt-4 text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
