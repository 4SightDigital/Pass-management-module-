import React from "react";

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  });
};

export const toIso = (localDateTime) => {
    return new Date(localDateTime).toISOString();
}


export const formatDateTimeSimple = (datetimeString) => {
  if (!datetimeString) return '';
  return datetimeString.replace('T', ' ').replace('Z', '').slice(0, -3);
};