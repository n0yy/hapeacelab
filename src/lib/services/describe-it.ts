export default async function describeIt(
  file: File,
  productName: string,
  language: string
) {
  // Convert file to base64
  const fileData = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
  const base64Data = fileData.split(",")[1];

  const response = await fetch("/api/describe-it", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileData: base64Data,
      mimeType: file.type,
      productName,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate description");
  }

  const data = await response.json();
  return data.text;
}
