export default function CondenseIt() {
  return (
    <>
      <title>CondenseIt</title>
      <main className="min-h-screen max-w-3xl mx-auto mt-32">
        <h1 className="text-3xl font-semibold underline mb-2">CondenseIt</h1>
        <p>
          Quickly distill the essential points from any article or paper.
          Rangkumin simplifies the process of summarizing long-form content,
          making it ideal for students, researchers, and professionals who need
          concise, clear summaries in seconds.
        </p>

        <div className="flex items-center justify-center w-full mt-5">
          <label
            for="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-1 border-gray-300  rounded-lg cursor-pointer bg-gray-50 hover:bg-primary dark:border-gray-600 dark:hover:border-gray-500 "
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>
        <button className="block w-40 mx-auto py-2 bg-slate-800 text-white rounded mt-5 hover:bg-primary hover:border border-slate-700 hover:text-slate-700 transition-all duration-200">
          Go!
        </button>
      </main>
    </>
  );
}
