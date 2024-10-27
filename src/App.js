import React, { useState } from 'react';
import {ReactTyped} from 'react-typed';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [tileSize, setTileSize] = useState(0);
  const [tilePadding, setTilePadding] = useState(10);
  const [fp32, setFp32] = useState(false);
  const [faceEnhance, setFaceEnhance] = useState(false);
  const [outscale, setOutscale] = useState(2);
  const [upscale, setUpscale] = useState(2);

  const [loading, setLoading] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [decompressedImage, setDecompressedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setSelectedImage(file);
  };

  const handleProcessClick = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('img_file', selectedImage);
      formData.append('netscale', upscale);
      formData.append('tileSize', tileSize);
      formData.append('tilePad', tilePadding);
      formData.append('fp32', fp32);
      formData.append('faceEnhance', faceEnhance);
      formData.append('outscale', outscale);

      setLoading(true);
      
      await axios.post('http://localhost:8000/enhance_image', formData).then((data) => {
        setProcessedImage(data.data.enhanced_img);
        setCompressedImage(data.data.compressed_img);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const handleDecompressClick = async () => {
    if (compressedImage) {
      setLoading(true);
      
      await axios.post('http://localhost:8000/decompress_image', { compressed_img: compressedImage }).then((data) => {
        setDecompressedImage(data.data.decompressed_img);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const downloadImage = (imageData, fileName) => {
    const linkSource = `data:image/png;base64,${imageData}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };
  

  return (
    <div className="container">
      <div className="dark-panel">
        <h1>Boost your Image with</h1>
        <ReactTyped
          strings={["Super-Resolution", "Lossless Compression", "Decompression"]}
          typeSpeed={70}
          backSpeed={60}
          loop
          className="typed-effect"
        />

        <label htmlFor="file-upload" className="custom-file-upload">
          {fileName || 'Choose File'}
          <input id="file-upload" type="file" onChange={handleFileChange} />
        </label>

        <h2>Image Settings for Lossless SR</h2>
        <div className="options-section">
          <div className="settings-group">
            <div className="custom-number-input">
              <label className="settings-label">Tile Size:
                <input
                  type="number"
                  value={tileSize}
                  onChange={(e) => setTileSize(e.target.value)}
                />
              </label>
            </div>
            <div className="custom-number-input">
              <label className="settings-label">Tile Padding:
                <input
                  type="number"
                  value={tilePadding}
                  onChange={(e) => setTilePadding(e.target.value)}
                />
              </label>
            </div>
            <div className="settings-label">
              <label>FP32:</label>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={fp32}
                  onChange={(e) => setFp32(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
              </label>
            </div>
            <div className="settings-label">
              <label>Face Enhance:</label>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={faceEnhance}
                  onChange={(e) => setFaceEnhance(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
              </label>
            </div>
            <div className="settings-label">
              <label>Outscale:</label>
              <select
                value={outscale}
                onChange={(e) => setOutscale(e.target.value)}
                className="custom-dropdown"
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="settings-label">
              <label>Upscale:</label>
              <select
                value={upscale}
                onChange={(e) => setUpscale(e.target.value)}
                className="custom-dropdown"
              >
                <option value="2">2X</option>
                <option value="4">4X</option>
              </select>
            </div>
          </div>
        </div>

        <div className="button-section">
          <button className="large-btn" onClick={handleProcessClick}>Lossless SR</button>
          <button className="large-btn" onClick={handleProcessClick}>Decompress</button>
        </div>

        {loading && (
          <div className="loading-bar">
            <p>Processing...</p>
            <div className="progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        )}

        {processedImage && (
          <div className="processed-image-section">
            <h2>Processed Image:</h2>
            <img src={`data:image/png;base64,${processedImage}`} alt="Processed" className="processed-image-preview" />
            <button className="download-btn" onClick={() => downloadImage(processedImage, "enhanced_img.png")}>
              Download Image
            </button>
            {compressedImage && (
              <button className="download-btn" onClick={() => downloadImage(compressedImage, "compressed_img.png")}>
                Download Compressed File
              </button>
            )}
          </div>
        )}

        {decompressedImage && (
          <div className="processed-image-section">
            <h2>Decompressed Image:</h2>
            <img src={`data:image/png;base64,${decompressedImage}`} alt="Decompressed" className="processed-image-preview" />
            <button className="download-btn" onClick={() => downloadImage(decompressedImage, "decompressed_img.png")}>
              Download Decompressed Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
