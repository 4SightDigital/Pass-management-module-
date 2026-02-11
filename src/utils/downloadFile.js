
import api from "../api/axios"; // adjust path if needed

export const downloadFile = async ({
  url,
  filename,
  method = "GET",
  data = null,
}) => {
  try {
    const response = await api({
      url,
      method,
      data,
      responseType: "blob", // 🔑 required for file download
    });
    console.log("dataaaa",response.data)
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download file");
  }
};
