// utils/highlightText.js
import React from "react";

export const highlightText = (text, searchTerm, options = {}) => {
  if (!searchTerm || !text || typeof text !== "string") return text;

  const {
    className = "bg-yellow-200 px-1 rounded font-semibold",
    caseSensitive = false,
  } = options;

  const flags = caseSensitive ? "g" : "gi";
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedTerm})`, flags);

  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className={className}>
        {part}
      </mark>
    ) : (
      part
    )
  );
};
