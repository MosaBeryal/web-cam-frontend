import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// utils.js
export const getCroppedImg = (imageSrc, crop) => {
  const image = new Image();
  image.src = imageSrc;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = crop.width;
  canvas.height = crop.height;
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  return canvas.toDataURL("image/jpeg");
};

export const rotateImage = (imageSrc, angle) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src = imageSrc;
  image.onload = () => {
    canvas.width = image.height;
    canvas.height = image.width;
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(image, 0, -image.height);
    return canvas.toDataURL("image/jpeg");
  };
};
