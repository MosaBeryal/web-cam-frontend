import React, { useRef, useState, useEffect } from 'react';
import { usePhotoEditor } from 'react-photo-editor';

const CustomPhotoEditor = ({ onSave }) => {
  const videoRef = useRef(null);
  const canvasCaptureRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [finalImage, setFinalImage] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('Camera access denied:', err));
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasCaptureRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const newFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        setFile(newFile);
        setIsCaptured(true);
        const tracks = video.srcObject?.getTracks();
        tracks?.forEach((t) => t.stop());
      }
    }, 'image/jpeg');
  };

  const retakeImage = () => {
    setIsCaptured(false);
    setFile(null);
    setIsSaved(false);
    setFinalImage(null);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('Camera access denied:', err));
  };

  const {
    canvasRef,
    imageSrc,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    saturate,
    setSaturate,
    grayscale,
    setGrayscale,
    rotate,
    setRotate,
    flipHorizontal,
    setFlipHorizontal,
    flipVertical,
    setFlipVertical,
    zoom,
    setZoom,
    mode,
    setMode,
    setLineColor,
    lineColor,
    setLineWidth,
    lineWidth,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    handleWheel,
    downloadImage,
    resetFilters,
  } = usePhotoEditor({ file });

  const handleSave = () => {
    const result = canvasRef.current?.toDataURL();
    setFinalImage(result);
    setIsSaved(true);
    onSave(result);
  };

  return (
    <div className="grid grid-cols-[800px_300px] gap-4 p-4">
      {/* Left side: Capture */}
      <div className="flex flex-col items-center justify-center">
        {!isCaptured ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg shadow" />
            <button onClick={captureImage} className="mt-4 webcam-btn">Capture</button>
            <canvas ref={canvasCaptureRef} className="hidden" />
          </>
        ) : (
          imageSrc && (
            <>
              <canvas
                ref={canvasRef}
                className="w-full"
                style={{ maxHeight: '100%', touchAction: 'none' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onWheel={handleWheel}
              />
              <button
                onClick={retakeImage}
                className="mt-4 bg-destructive text-destructive-foreground px-4 py-2 rounded hover:opacity-90 transition-colors"
              >
                Retake
              </button>
            </>
          )
        )}
      </div>

      {/* Right side: Editing */}
      <div className="flex flex-col space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm">Brightness</label>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Contrast</label>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Saturate</label>
            <input
              type="range"
              min="0"
              max="200"
              value={saturate}
              onChange={(e) => setSaturate(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Grayscale</label>
            <input
              type="range"
              min="0"
              max="100"
              value={grayscale}
              onChange={(e) => setGrayscale(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Rotate</label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotate}
              onChange={(e) => setRotate(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Zoom</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={flipHorizontal}
                onChange={(e) => setFlipHorizontal(e.target.checked)}
                className="mr-2"
              />
              Flip Horizontal
            </label>
            <label className="text-sm">
              <input
                type="checkbox"
                checked={flipVertical}
                onChange={(e) => setFlipVertical(e.target.checked)}
                className="mr-2"
              />
              Flip Vertical
            </label>
          </div>
          <div>
            <label className="block text-sm">
              <input
                type="checkbox"
                checked={mode === 'draw'}
                onChange={(e) => setMode(e.target.checked ? 'draw' : 'pan')}
                className="mr-2"
              />
              Draw Mode
            </label>
            {mode === 'draw' && (
              <div className="flex items-center space-x-4 mt-2">
                <input
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  className="w-10 h-10 rounded"
                />
                <input
                  type="number"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  min={2}
                  max={100}
                  className="w-16"
                />
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <button onClick={resetFilters} className="webcam-btn bg-muted text-muted-foreground hover:opacity-90">Reset</button>
            <button onClick={handleSave} className="webcam-btn">Save</button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CustomPhotoEditor;
