// Clean HTML content and extract text
export function cleanHtml(html) {
  if (!html) return "";

  // Remove HTML tags but preserve line breaks
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();

  // Remove extra whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}
