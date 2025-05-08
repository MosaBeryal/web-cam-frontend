import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Webcam from "react-webcam";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
// import { rotateImage } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomPhotoEditor from "./CustomFileEditor";

// Schema
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

  // Function to update image state
  const handleImageUpdate = (newImage) => {
    setImage(newImage);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userDataSchema),
  });

  const handleSubmitForm = (data) => {
    const formData = {
      ...data,
      image: croppedImage || image,
    };
    console.log("Form Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <header className="w-full bg-primary text-white py-4 px-6 rounded-lg shadow mb-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">NOVA AI TECH</h1>
        <div className="flex items-center gap-3">
          <Input
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name"
            className="border-none focus:ring-2 focus:ring-accent w-64"
          />
          <Button className="bg-accent hover:bg-accent/90 text-white font-semibold px-5 py-2 rounded">
            Search
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 max-w-6xl mx-auto">
      <CustomPhotoEditor onSave={handleImageUpdate}/>

        <Card className="p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">Result / Match Found</h2>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">
            <div>
              <Input
                {...register("firstName")}
                placeholder="First Name"
                className="w-full"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <Input
                {...register("lastName")}
                placeholder="Last Name"
                className="w-full"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <Input
              {...register("address")}
              placeholder="Address"
              className="w-full"
            />

            <Input
              {...register("additionalInfo")}
              placeholder="Additional Info"
              className="w-full"
            />

            {croppedImage && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Cropped Image Preview</h3>
                <img
                  src={croppedImage}
                  alt="Preview"
                  className="rounded-lg border shadow-md max-h-80 object-cover"
                />
              </div>
            )}
    

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg shadow">
                Save
              </Button>
              <Button
                type="reset"
                className="bg-muted text-muted-foreground px-6 py-2 rounded-lg"
              >
                Clear
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Home;
