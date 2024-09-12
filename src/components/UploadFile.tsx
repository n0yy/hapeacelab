export default function UploadFile(props: {
  acceptedFile: string;
  handleSubmit: any;
  file: any;
  setFile: any;
  needPoints: number;
  isPDF: boolean;
}) {
  const { acceptedFile, handleSubmit, file, setFile, needPoints, isPDF } =
    props;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024); // Convert bytes to MB
      if (fileSizeInMB > 4) {
        alert("File size exceeds 4MB. Please upload a smaller file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center w-full mb-10 mt-3"
    >
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-[1px] border-gray-500 rounded-lg cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-1 text-gray-700"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          {isPDF && (
            <p className="mb-2 text-xs text-gray-500">Maximum size is 4MB</p>
          )}
          <p className="text-xs text-gray-700">
            {file ? file.name : acceptedFile}
          </p>
        </div>
        <input
          id="dropzone-file"
          name="file"
          type="file"
          accept={acceptedFile}
          className="hidden"
          required
          onChange={handleFileChange}
        />
      </label>
      <span className="text-sm text-slate-600 mt-2">
        You need {needPoints} point to do it!
      </span>
      <input
        className="block w-40 mx-auto py-2 bg-slate-800 text-white rounded mt-3 hover:bg-primary hover:border border-slate-700 hover:text-slate-700 transition-all duration-200"
        type="submit"
        value="Go!"
      />
    </form>
  );
}
