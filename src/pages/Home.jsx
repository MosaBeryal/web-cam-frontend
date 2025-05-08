import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Webcam from "react-webcam";
import Cropper from "react-cropper"; // For cropping
import "cropperjs/dist/cropper.css";
import { rotateImage } from "@/lib/utils"; // Utility for rotating image
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Zod schema for form validation
const userDataSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  address: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const Home = () => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);

  const [isCaptured, setIsCaptured] = useState(false);
  const [rotation, setRotation] = useState(0); // For rotating the image
  const webcamRef = useRef(null);
  const cropperRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userDataSchema),
  });

  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
    setIsCaptured(true);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropped = cropperRef.current.getCroppedCanvas().toDataURL();
      setCroppedImage(cropped);
    }
  };

  const handleRotate = () => {
    if (image) {
      const rotated = rotateImage(image, rotation + 90);
      setImage(rotated);
      setRotation(rotation + 90);
    }
  };

  const handleSubmitForm = (data) => {
    const formData = {
      ...data,
      image: croppedImage || image, // Use cropped or original image
    };
    console.log("Form Data:", formData);
    // Submit form data to backend (using axios or fetch)
    // axios.post('/api/submit', formData);
  };

  return (
    <div className="flex flex-col items-center bg-background text-foreground px-[var(--spacing-unit)] py-[var(--spacing-unit)]">
      {/* Header */}
      <header className="w-full p-4 bg-primary text-white flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">NOVA AI TECH</span>
        </div>
        <div className="flex items-center gap-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name"
            className="p-2 border border-gray-300 rounded"
          />
          <Button className="bg-accent text-white px-4 py-2 rounded">
            Search
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-8 w-full max-w-[var(--max-width)] mx-auto">
        {/* Left Section: Image Capture */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <Card className="p-4 shadow-lg w-full max-w-md">
            {isCaptured ? (
              <div>
                <Cropper
                  ref={cropperRef}
                  src={image}
                  style={{ height: 400, width: "100%" }}
                  aspectRatio={1}
                  guides={false}
                />
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    onClick={handleCrop}
                    className="bg-primary text-white py-2 px-4 rounded"
                  >
                    Crop
                  </Button>
                  <Button
                    onClick={handleRotate}
                    className="bg-accent text-white py-2 px-4 rounded"
                  >
                    Rotate
                  </Button>
                  <Button
                    onClick={() => setIsCaptured(false)}
                    className="bg-muted text-muted-foreground py-2 px-4 rounded"
                  >
                    Retake
                  </Button>
                </div>
              </div>
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={{ facingMode: "user" }}
              />
            )}
            <div className="flex justify-center gap-4 mt-4">
              {!isCaptured && (
                <Button
                  onClick={captureImage}
                  className="bg-primary text-white py-2 px-4 rounded"
                >
                  Capture Photo
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Section: Form */}
        <div className="w-full lg:w-1/2">
          <Card className="p-4 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Result / Match Found
            </h2>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <div className="mb-4">
                <Input
                  {...register("firstName")}
                  placeholder="First Name"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Input
                  {...register("lastName")}
                  placeholder="Last Name"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Input
                  {...register("address")}
                  placeholder="Address"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <Input
                  {...register("additionalInfo")}
                  placeholder="Additional Info"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
              </div>

              {/* Preview of the Cropped Image */}
              {croppedImage && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">
                    Cropped Image Preview:
                  </h3>
                  <img
                    src={croppedImage}
                    alt="Cropped Preview"
                    className="w-full mt-2 rounded-lg"
                  />
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <Button
                  type="submit"
                  className="bg-primary text-white py-2 px-4 rounded"
                >
                  Save
                </Button>
                <Button
                  type="reset"
                  className="bg-muted text-muted-foreground py-2 px-4 rounded"
                >
                  Clear
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
