export const BACKEND_URL = "https://photographerai.vercel.app";

export const uploadPhotoToBackend = async (photoUri) => {
  try {
    const formData = new FormData();

    formData.append("file", {
      uri: photoUri,
      name: "photographerai_photo.jpg",
      type: "image/jpeg",
    });

    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
};
