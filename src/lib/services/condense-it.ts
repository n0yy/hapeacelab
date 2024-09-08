export default async function condenseIt(
  file: File,
  language = "english",
  mimeType = "application/pdf"
) {
  // Convert file to base64
  const fileData = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file); // Changed back to readAsDataURL
  });

  // Extract the base64 data from the Data URL
  const base64Data = fileData.split(",")[1];

  const response = await fetch("/api/condense-it", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileData: base64Data,
      language,
      mimeType,
      fileName: file.name,
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
