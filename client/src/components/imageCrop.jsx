import { useState } from "react";
import Cropper from "react-easy-crop";
import "./imageCrop.css";
import getCroppedImg from "../utils/cropImage";
import { Modal } from "@mui/base";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Plus } from "../components/icons";
import userImage from "../assets/images/user.png";
import { Slider } from "@mui/material";
const CROP_AREA_ASPECT = 1 / 1;
const ImageCropModal = ({
  imageURL,
  open,
  setOpen,
  setImgSrc,
  handleFileSelect,
  setUploadedImage,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const cropImage = async () => {
    const croppedImgURL = await getCroppedImg(imageURL, croppedAreaPixels);
    setImgSrc(croppedImgURL);
    setOpen(false);
  };
  const onCropComplete = (_, cap) => {
    setCroppedAreaPixels(cap);
  };
  const handleClose = () => {
    setOpen(false);
    setUploadedImage(imageURL);
  };
  const handleSliderChange = (event, newValue) => {
    setZoom(newValue);
  };
  const purpleColorTheme = createTheme({
    palette: {
      primary: {
        main: "#645bff",
      },
    },
  });
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="image-crop-modal">
        <div className="image-crop-modal-container">
          <button
            style={{ marginLeft: "auto" }}
            className="exit-add-issue-modal-button"
            onClick={handleClose}
          >
            <Plus sx={{ transform: "rotate(45deg)" }} />
          </button>
          <div className="image-crop-modal-cropper-container">
            {imageURL ? (
              <Cropper
                restrictPosition={false}
                cropShape="round"
                showGrid={false}
                image={imageURL}
                aspect={CROP_AREA_ASPECT}
                crop={crop}
                zoom={zoom}
                minZoom={0.2}
                maxZoom={1.8}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            ) : (
              <div style={{ width: "100%", display: "flex" }}>
                <img
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                  src={userImage}
                  width={128}
                  height={128}
                  alt="upload-profile-image"
                />
              </div>
            )}
          </div>
          <ThemeProvider theme={purpleColorTheme}>
            <Slider
              color="primary"
              defaultValue={1}
              step={0.01}
              min={0.2}
              max={1.8}
              aria-label="zoom"
              value={zoom}
              onChange={handleSliderChange}
            />
          </ThemeProvider>
          <div className="image-crop-modal-footer">
            <label
              className="plus-icon-button"
              htmlFor="upload-profile-photo"
              style={{ marginRight: "auto" }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
                  ></path>
                </svg>
                Upload
              </span>
            </label>
            <input
              type="file"
              id="upload-profile-photo"
              className="photo-upload-input"
              onChange={handleFileSelect}
            />
            <button className="plus-icon-button" onClick={cropImage}>
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ImageCropModal;
