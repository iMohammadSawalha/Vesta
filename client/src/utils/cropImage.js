const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 */
export default async function getCroppedImg(imageSrc, pixelCrop) {
  const TARGET_WIDTH = 128;
  const TARGET_HEIGHT = 128;
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    TARGET_WIDTH, //pixelCrop.width,
    TARGET_HEIGHT //pixelCrop.height
  );

  // As Base64 string
  return canvas.toDataURL("image/png");

  // As a blob
  // return new Promise((resolve, reject) => {
  //   canvas.toBlob((file) => {
  //     resolve(URL.createObjectURL(file));
  //   }, "image/png");
  // });
}
