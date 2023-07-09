const uploadImage = async (imageData) => {
  const image = new FormData();
  image.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
  image.append("file", imageData);
  image.append("cloud_name", process.env.CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: image,
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
module.exports = uploadImage;
