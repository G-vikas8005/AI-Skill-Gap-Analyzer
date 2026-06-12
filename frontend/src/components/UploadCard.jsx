import React, { useState, useRef } from "react";

const UploadCard = ({ onTextExtracted, isProcessingOuter }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // Handle drag configurations
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process manual click file drops
  const processFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      alert("Invalid file format. Please upload a standard PDF or Image document.");
      return;
    }
    setFileName(file.name);

    // Call your parsing hook framework or pass file object to outer state context
    // For now, let's fake a text extraction check or pass the raw file upwards
    // if your custom parser sits in a service worker logic block:
    if (onTextExtracted) {
      onTextExtracted(file); 
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[200px]
        ${dragActive ? "border-[#24B1B1] bg-[#24B1B1]/5 shadow-inner" : "border-gray-300 bg-white hover:border-[#007979]/40"}`}
      onClick={() => fileInputRef.current.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,image/*"
        onChange={handleChange}
        disabled={isProcessingOuter}
      />

      {/* CLOUD ICON GRAVATA */}
      <div className="w-14 h-14 rounded-full bg-[#FFF0E4] flex items-center justify-center text-[#007979] mb-4 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
      </div>

      {fileName ? (
        <div>
          <p className="text-sm font-semibold text-gray-800 tracking-tight">Active Document Load:</p>
          <p className="text-xs font-bold text-[#24B1B1] mt-1 bg-[#24B1B1]/5 px-3 py-1.5 rounded-xl border border-[#24B1B1]/20 font-mono inline-block">
            📄 {fileName}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm font-bold text-[#007979]">
            Drag & Drop your resume document file
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports standardized enterprise PDF format or high-res images
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadCard;