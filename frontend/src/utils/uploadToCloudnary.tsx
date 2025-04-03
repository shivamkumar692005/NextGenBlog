export const uploadToCloudinary = async (image: File): Promise<string> => {
  if (!image) throw new Error("No image provided");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; 

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Image upload failed"
    );
  }
};