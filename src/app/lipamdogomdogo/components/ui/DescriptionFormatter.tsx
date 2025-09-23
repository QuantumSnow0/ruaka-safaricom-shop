import React from "react";

interface DescriptionFormatterProps {
  content: string;
  className?: string;
}

export default function DescriptionFormatter({
  content,
  className = "",
}: DescriptionFormatterProps) {
  const formatContent = (text: string) => {
    const paragraphs = text.split(/\n\s*\n/);

    return paragraphs
      .map((paragraph, index) => {
        if (paragraph.trim() === "") return null;

        // Check if it's a heading (starts with ##)
        if (paragraph.trim().startsWith("##")) {
          const headingText = paragraph.trim().replace(/^##\s*/, "");
          return (
            <h3
              key={index}
              className="text-lg font-semibold text-gray-900 mt-6 mb-3"
            >
              {headingText}
            </h3>
          );
        }

        // Check if it's a subheading (starts with ###)
        if (paragraph.trim().startsWith("###")) {
          const headingText = paragraph.trim().replace(/^###\s*/, "");
          return (
            <h4
              key={index}
              className="text-base font-semibold text-gray-800 mt-4 mb-2"
            >
              {headingText}
            </h4>
          );
        }

        // Check if this paragraph contains tab-separated data (specifications table)
        const lines = paragraph.split(/\n/);
        const hasTabSeparatedData = lines.some((line) => line.includes("\t"));

        if (hasTabSeparatedData) {
          return (
            <div key={index} className="mb-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    {lines.map((line, lineIndex) => {
                      if (line.trim() === "") return null;

                      const parts = line.split("\t");
                      if (parts.length >= 2) {
                        const [spec, value] = parts;
                        return (
                          <tr
                            key={lineIndex}
                            className="border-b border-gray-200"
                          >
                            <td className="py-2 px-4 font-medium text-gray-900 bg-gray-50 w-1/3 border-r border-gray-300">
                              {spec.trim()}
                            </td>
                            <td className="py-2 px-4 text-gray-700">
                              {value
                                .trim()
                                .split("\n")
                                .map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="mb-1 last:mb-0"
                                  >
                                    {item.trim()}
                                  </div>
                                ))}
                            </td>
                          </tr>
                        );
                      } else if (parts.length === 1 && parts[0].trim() !== "") {
                        // This is a section header (no tab, just text)
                        return (
                          <tr key={lineIndex}>
                            <td
                              colSpan={2}
                              className="py-3 px-4 font-bold text-gray-900 bg-orange-50 text-center"
                            >
                              {parts[0].trim()}
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // Regular paragraph with formatting
        const formattedParagraph = paragraph
          .split(/\n/)
          .map((line, lineIndex) => {
            // Handle bold text **text**
            const boldFormatted = line.replace(
              /\*\*(.*?)\*\*/g,
              "<strong>$1</strong>"
            );

            // Handle italic text *text*
            const italicFormatted = boldFormatted.replace(
              /\*(.*?)\*/g,
              "<em>$1</em>"
            );

            // Handle bullet points
            if (line.trim().startsWith("- ")) {
              return (
                <li key={lineIndex} className="ml-4 mb-1">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: italicFormatted.replace(/^-\s*/, ""),
                    }}
                  />
                </li>
              );
            }

            return (
              <span
                key={lineIndex}
                dangerouslySetInnerHTML={{ __html: italicFormatted }}
              />
            );
          });

        // Check if this paragraph contains list items
        const hasListItems = paragraph.includes("- ");

        if (hasListItems) {
          return (
            <ul key={index} className="list-disc list-inside space-y-1 mb-4">
              {formattedParagraph}
            </ul>
          );
        }

        return (
          <p key={index} className="mb-4">
            {formattedParagraph}
          </p>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      {formatContent(content)}
    </div>
  );
}
