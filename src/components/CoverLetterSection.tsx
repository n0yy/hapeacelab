import React from "react";

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

const Butterfly: React.FC = () => (
  <svg
    viewBox="0 0 50 50"
    className="w-6 h-6 inline-block ml-2 text-purple-500 animate-flutter"
    style={{ transform: "rotate(-10deg)" }}
  >
    <path
      d="M25 25 C15 15, 5 15, 5 25 C5 35, 15 35, 25 25 C35 35, 45 35, 45 25 C45 15, 35 15, 25 25"
      fill="currentColor"
    />
  </svg>
);

const CoverLetterSection: React.FC<CoverLetterSectionProps> = ({
  data,
  language,
}) => {
  return (
    <div className="flex-1 p-6 relative overflow-hidden animate-fadeIn">
      <div className="space-y-4">
        <h3 className="text-xl font-medium">{data.subject}</h3>

        <p className="font-medium text-gray-700 hover:text-purple-700 transition-colors duration-300">
          {data.salutation}
        </p>

        <p className="text-gray-600">{data.opening_paragraph}</p>

        <div className="space-y-4">
          {data.body_paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-600">
              {paragraph}
            </p>
          ))}
        </div>

        <p className="text-gray-700">{data.closing_paragraph}</p>

        <p className="font-medium text-purple-700 hover:scale-105 transition-transform duration-300 cursor-default">
          {data.signature}
        </p>
      </div>
    </div>
  );
};

const CoverLetterDisplay: React.FC<CoverLetterDisplayProps> = ({ content }) => {
  try {
    const { indonesia, english }: CoverLetterContent = JSON.parse(content);

    return (
      <div className="animate-slideUp">
        <div className="w-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <CoverLetterSection data={indonesia} language="Bahasa Indonesia" />
          {/* <CoverLetterSection data={english} language="English" /> */}
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
