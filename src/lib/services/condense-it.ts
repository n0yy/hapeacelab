export default async function condenseIt(
  fileLocation: string,
  language = "english",
  mimeType = "application/pdf"
) {
  const response = await fetch("/api/condense-it", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileLocation,
      language,
      mimeType,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to generate description: ${errorData.error || "Unknown error"}`
    );
  }

  const data = await response.json();
  return data.text;
}
