import React, { useState } from "react";

interface CoverLetterData {
  subject: string;
  salutation: string;
  opening_paragraph: string;
  body_paragraphs: string[];
  closing_paragraph: string;
  signature: string;
}

interface CoverLetterContent {
  indonesia: CoverLetterData;
  english: CoverLetterData;
}

interface CoverLetterDisplayProps {
  content: string;
}

interface CoverLetterSectionProps {
  data: CoverLetterData;
  language: string;
}

const CoverLetterSection: React.FC<CoverLetterSectionProps> = ({
  data,
  language,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-0 md:p-6 relative overflow-hidden animate-fadeIn">
      <div className="space-y-4">
        <h3 className="text-2xl font-medium">{data.subject}</h3>

        <i className="font-medium text-gray-700 hover:text-purple-700 transition-colors duration-300">
          {data.salutation}
        </i>

        <p className="text-gray-600 text-start">{data.opening_paragraph}</p>

        <div className="space-y-4 text-start">
          {data.body_paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-600">
              {paragraph}
            </p>
          ))}
        </div>

        <p className="text-gray-700 text-start">{data.closing_paragraph}</p>

        <i className="text-gray-600 cursor-default mt-10 block">
          {data.signature}
        </i>
      </div>
    </div>
  );
};

const LanguageToggle: React.FC<{
  language: string;
  onToggle: () => void;
}> = ({ language, onToggle }) => (
  <div className="flex justify-center mb-0">
    <div className="bg-gray-100 rounded-lg p-1 inline-flex">
      <button
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          language === "indonesia"
            ? "bg-white shadow-sm text-purple-700"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => language === "english" && onToggle()}
      >
        Bahasa Indonesia
      </button>
      <button
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          language === "english"
            ? "bg-white shadow-sm text-purple-700"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => language === "indonesia" && onToggle()}
      >
        English
      </button>
    </div>
  </div>
);

const CoverLetterDisplay: React.FC<CoverLetterDisplayProps> = ({ content }) => {
  const [language, setLanguage] = useState<"indonesia" | "english">(
    "indonesia"
  );

  try {
    const parsedContent: CoverLetterContent = JSON.parse(content);

    const toggleLanguage = () => {
      setLanguage((prev) => (prev === "indonesia" ? "english" : "indonesia"));
    };

    return (
      <div className="animate-slideUp z-0">
        <LanguageToggle language={language} onToggle={toggleLanguage} />
        <div className="transition-all duration-300 ease-in-out">
          <CoverLetterSection
            data={parsedContent[language]}
            language={language === "indonesia" ? "Bahasa Indonesia" : "English"}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error parsing content:", error);
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50">
        Failed to load cover letter content. Please try again.
      </div>
    );
  }
};

export default CoverLetterDisplay;
