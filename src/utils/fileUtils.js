import React from "react";

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const toIso = (localDateTime) => {
  return new Date(localDateTime).toISOString();
};

export const formatDateTimeSimple = (datetimeString) => {
  if (!datetimeString) return "";

  const date = new Date(datetimeString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const fromIso = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

// Helper functions to format date/time for display
export const formatDateForDisplay = (dateTimeString) => {
  if (!dateTimeString) return "";
  const date = new Date(dateTimeString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTimeForDisplay = (dateTimeString) => {
  if (!dateTimeString) return "";
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const hasVenueTimeOverlap = ({
  events,
  venueId,
  start,
  end,
  ignoreEventId = null, // useful while editing
}) => {
  const newStart = new Date(start);
  const newEnd = new Date(end);

  return events.some((event) => {
    if (ignoreEventId && event.id === ignoreEventId) return false;
    if (event.venue_id !== venueId) return false;

    const existingStart = new Date(event.start_datetime);
    const existingEnd = new Date(event.end_datetime);

    return newStart < existingEnd && newEnd > existingStart;
  });
};


export function getImageUrl(imagePath) {
  if (!imagePath) return null;

  // Use the current window origin (works in dev + production)
  return `${window.location.origin}${imagePath}`;
}

export function getVenueImage(image) {
  if (!image) return null;

  const backendBase = import.meta.env.DEV
    ? "http://localhost:5000"
    : "";

  // 🔥 encode the filename properly
  const safeImage = encodeURIComponent(image);

  return `${backendBase}/${safeImage}`;
}
