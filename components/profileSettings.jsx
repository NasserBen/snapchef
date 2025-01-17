import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import Image from "next/image";
import defaultPfp from "../assets/icons/profile.svg";

export default function ProfileSettings({ setShowSettings, profileSettings }) {
  const { id, userName, bio, profilePic } = profileSettings;
  const [updatedBio, setUpdatedBio] = useState(bio);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const settingsRef = useRef();

  const handleClickOutside = (event) => {
    if (settingsRef.current && !settingsRef.current.contains(event.target)) {
      setShowSettings(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleConfirmClick = async () => {
    try {
      const updatedFields = {};
      let presignedUrlResponse;

      if (file) {
        // Check if pre-signed URL already given
        if (profilePic) {
          // Get existing object key from URL
          const parts = profilePic.split("/");

          // Extract the date part (2024-03-17)
          const datePart = parts[parts.length - 2];

          // Extract the object key from the parts array
          const idPart = parts[parts.length - 1];

          // Combine the year and object key into a single string
          const objectKey = `${datePart}/${idPart}`;
          presignedUrlResponse = await fetch("/api/getUploadImageURL", {
            method: "POST",
            body: JSON.stringify({ id: id, existingKey: objectKey }),
          });
        } else {
          // image url does not already exist
          presignedUrlResponse = await fetch("/api/getUploadImageURL", {
            method: "POST",
            body: JSON.stringify({ id: id }),
          });
        }

        if (!presignedUrlResponse.ok) {
          throw new Error("Failed to obtain pre-signed URL for image upload");
          return;
        }

        // Step 2: Get imageUrl and Upload image to pre-signed upload URL
        const { uploadUrl, imageUrl } = await presignedUrlResponse.json();

        const uploadImageResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": "image/jpeg",
          },
        });

        if (!uploadImageResponse.ok) {
          throw new Error("Failed to upload image");
          return;
        }

        console.log("image uploaded to bucket");
        updatedFields.updatedPfp = imageUrl;
      }
      if (updatedBio !== bio) {
        // Check if bio updated
        updatedFields.updatedBio = updatedBio;
      }

      if (Object.keys(updatedFields).length > 0) {
        const res = await fetch("/api/updateUserInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            ...updatedFields,
          }),
        });
        if (res.ok) {
          setShowSettings(false);
          window.location.reload();
        } else {
          console.error("Failed to update user information");
        }
      } else {
        console.log("No changes to update");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 m-auto max-w-10"
      onClick={handleClickOutside}
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        ref={settingsRef}
        className="border-solid border-2 border-custom-main-dark rounded-lg backdrop-blur-md "
      >
        <div className="bg-custom-main-dark rounded-t-lg p-3">
          <h1 className="text-black text-2xl font-bold">Edit Profile</h1>
        </div>
        <div className="bg-white rounded-b-lg p-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center bg-orange-100 p-2 rounded-lg my-4">
              <div className="flex justify-center items-center">
                {/* Allow user to click on profile pic to select a new image */}
                <label htmlFor="profilePic" className="cursor-pointer">
                  <Image
                    src={previewUrl || profilePic || defaultPfp}
                    alt="Profile Picture"
                    className="rounded-full w-16 h-16"
                    width={100}
                    height={100}
                  />
                </label>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="mx-3 px-1 font-bold text-xl border-solid border border-[#A3A3A3] rounded-xl">
                  {userName}
                </div>
              </div>
              <button
                className="ml-12 bg-custom-main-dark bg-opacity-100 hover:bg-opacity-70 transition-colors ease-linear p-2 rounded-xl font-semibold"
                onClick={() => document.getElementById("profilePic").click()}
              >
                Change Photo
              </button>
            </div>
            <p className="font-semibold mt-4">Bio</p>
            <textarea
              maxLength="150"
              type="text"
              defaultValue={updatedBio}
              className="border-solid border-2 border-custom-main-dark p-2 pb-16 rounded-lg mb-4"
              onChange={(e) => setUpdatedBio(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => signOut()}
              className="bg-[#575A65] bg-opacity-60 hover:bg-opacity-100 transition-colors ease-linear px-4 py-2 rounded-lg text-white"
            >
              Log Out
            </button>
            <button
              className="bg-custom-main-dark bg-opacity-100 hover:bg-opacity-70 transition-colors ease-linear p-2 px-8 ml-60 mt-4 mb-2 rounded-xl font-semibold"
              onClick={handleConfirmClick}
            >
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// const [statusMessage, setStatusMessage] = useState("");
// const [loading, setLoading] = useState(false);
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   try {
//     let fileId = undefined;
//     if (file) {
//       setStatusMessage("Uploading...");
//       fileId = await handleFileUpload(file);
//     }

//     setStatusMessage("Updating profile...");

//    // update bio here is needed
//
//     setStatusMessage("Update Successful");
//   } catch (error) {
//     console.error(error);
//     setStatusMessage("Post failed");
//   } finally {
//     setLoading(false);
//   }
// };

// const computeSHA256 = async (file) => {
//   const buffer = await file.arrayBuffer();
//   const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray
//     .map((b) => b.toString(16).padStart(2, "0"))
//     .join("");
//   return hashHex;
// };

// const handleImageUpload = async (file) => {
//   const signedURLResult = await getSignedURL({
//     fileSize: file.size,
//     fileType: file.type,
//     checksum: await computeSHA256(file),
//   });
//   if (signedURLResult.failure !== undefined) {
//     throw new Error(signedURLResult.failure);
//   }
//   const { url, id: fileId } = signedURLResult.success;
//   await fetch(url, {
//     method: "PUT",
//     headers: {
//       "Content-Type": file.type,
//     },
//     body: file,
//   });

//   // const fileUrl = url.split("?")[0];
//   return fileId;
// };
