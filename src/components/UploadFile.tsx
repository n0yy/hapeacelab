import React, { useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";

interface UploadFileProps {
  acceptedFile: Accept | string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  file: File | null;
  setFile: (file: File | null) => void;
  needPoints: string;
  isPDF: boolean;
}

export default function UploadFile({
  acceptedFile,
  handleSubmit,
  file,
  setFile,
  needPoints,
  isPDF,
}: UploadFileProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        const fileSizeInMB = selectedFile.size / (1024 * 1024);
        if (fileSizeInMB > 4) {
          alert("File size exceeds 4MB. Please upload a smaller file.");
          return;
        }
        setFile(selectedFile);
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: isPDF
      ? { "application/pdf": [".pdf"] }
      : typeof acceptedFile === "string"
      ? { [acceptedFile]: [] }
      : acceptedFile,
    maxSize: 4 * 1024 * 1024, // 4MB
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center w-full mb-10 mt-3"
    >
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
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
            {file
              ? file.name
              : typeof acceptedFile === "string"
              ? acceptedFile
              : Object.keys(acceptedFile).join(", ")}
          </p>
        </div>
      </div>
      <span className="text-sm text-slate-600 mt-2">{needPoints}</span>
      <input
        className="block w-40 mx-auto py-2 bg-slate-800 text-white rounded mt-3 hover:bg-primary hover:border border-slate-700 hover:text-slate-700 transition-all duration-200"
        type="submit"
        value="Go!"
      />
    </form>
  );
}
