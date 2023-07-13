import "./settings.css";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import userImage from "../assets/images/user.png";
import ImageCropModal from "../components/imageCrop";
import useAuth from "../hooks/useAuth";
import { Alert, Snackbar } from "@mui/material";
const Profile = () => {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [responseCode, setResponseCode] = useState(null);
  const handleImageFileSelect = (event) => {
    setUploadedImage(URL.createObjectURL(event.target.files[0]));
  };
  useEffect(() => {
    document.title = "Profile";
  }, []);
  const SaveImage = async () => {
    if (isUploading) return;
    setIsUploading(true);

    try {
      const response = await axiosPrivate.post(
        "/api/user/update-picture",
        JSON.stringify({
          image: imageData,
        })
      );
      setAuth((prev) => {
        return {
          ...prev,
          user: {
            email: prev.user.email,
            image: response?.data?.image,
          },
        };
      });
      setIsUploading(false);
      setResponseCode(200);
      setSnackbarMessage("Profile picture updated successfully");
      setOpenSnackbar(true);
    } catch (error) {
      setIsUploading(false);
      setResponseCode(error?.response?.status);
      if (responseCode === 400) {
        setSnackbarMessage("Please upload an image first");
      } else setSnackbarMessage("An error occurred!, Try again later");
      setOpenSnackbar(true);
    }
  };
  const openModal = () => {
    setOpen(true);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <div className="profile-container">
      <div className="profile-content">
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={responseCode === 200 ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <ImageCropModal
          setUploadedImage={setUploadedImage}
          setImgSrc={setImageData}
          imageURL={uploadedImage || auth?.user?.image}
          open={open}
          setOpen={setOpen}
          handleFileSelect={handleImageFileSelect}
        />
        <div className="profile-header">
          <div style={{ fontSize: "x-large", marginBottom: "1rem" }}>
            Profile
          </div>
          <div style={{ fontSize: "0.9em", color: "rgb(180,180,180)" }}>
            Manage your profile
          </div>
        </div>
        <div
          style={{
            marginTop: "2rem",
            height: "1px",
            backgroundColor: "rgb(120,120,120)",
          }}
        ></div>
        <div style={{ display: "flex", width: "100%", marginTop: "1rem" }}>
          <img
            style={{ marginLeft: "auto", marginRight: "auto" }}
            className="photo-upload-preview-img"
            src={imageData || auth?.user?.image || userImage}
            width={128}
            height={128}
            alt="upload-profile-image"
            onClick={openModal}
          />
        </div>
        <span
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            fontSize: "0.9em",
            color: "rgb(180,180,180)",
          }}
        >
          Change your profile picture
        </span>
        {imageData && (
          <button
            className="plus-icon-button"
            style={{
              color: "white",
              width: "fit-content",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "1rem",
            }}
            onClick={SaveImage}
          >
            {isUploading ? "Uploading..." : "Save"}
          </button>
        )}
      </div>
    </div>
  );
};
export default Profile;
