import React, { useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faHeadset, faEnvelope, faUsers, faPlus, faFile, faFileImage, faFileVideo, faFilePdf, faTimes, faCheck, faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const dataSourceTabs = [
  { label: "Manual Upload", icon: faUpload },
  { label: "Service Desk", icon: faHeadset },
  { label: "Email", icon: faEnvelope },
  { label: "Teams", icon: faUsers },
];

const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
  'video/x-ms-wmv': ['.wmv'],
  'application/pdf': ['.pdf']
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function CreateProcess() {
  const [activeTab, setActiveTab] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dataSourceUrl, setDataSourceUrl] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const validateFile = (file) => {
    if (!file) return false;
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size should be less than 100MB");
      return false;
    }

    // Check file type
    const fileType = file.type.toLowerCase();
    const isValidType = Object.keys(ACCEPTED_FILE_TYPES).some(type => fileType === type);
    
    if (!isValidType) {
      const acceptedTypes = Object.values(ACCEPTED_FILE_TYPES)
        .flat()
        .map(ext => ext.toUpperCase())
        .join(', ');
      setFileError(`Please upload only these file types: ${acceptedTypes}`);
      return false;
    }

    setFileError("");
    return true;
  };

  const handleUploadClick = () => {
    // Directly trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset states
    setFileError("");
    setPreviewUrl(null);
    
    // Log file details for debugging
    console.log('Selected file:', {
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size
    });
    
    // Validate file
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      // Create preview URL for images and videos
      if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      }
      // Simulate upload progress
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileError("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const getFileIcon = () => {
    if (!file) return faFile;
    if (file.type.startsWith('image/')) return faFileImage;
    if (file.type.startsWith('video/')) return faFileVideo;
    if (file.type === 'application/pdf') return faFilePdf;
    return faFile;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !description) {
      alert("Please fill in all required fields");
      return;
    }

    if (activeTab === 0 && !file && !dataSourceUrl) {
      setFileError("Please either upload a file or provide a data source URL");
      return;
    }
    
    // Create new process object
    const newProcess = {
      id: Date.now(),
      created: new Date().toISOString().split('T')[0],
      transcription: '0/0',
      status: 'IN REVIEW',
      statusColor: 'bg-yellow-600',
      title: title,
      description: description,
      dataSourceUrl: dataSourceUrl,
      tags: tags.split(',').map(tag => tag.trim()),
      file: file ? {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      } : null
    };

    // Get existing processes from localStorage
    const existingProcesses = JSON.parse(localStorage.getItem('processes') || '[]');
    
    // Add new process to the list
    const updatedProcesses = [...existingProcesses, newProcess];
    
    // Save updated processes list
    localStorage.setItem('processes', JSON.stringify(updatedProcesses));

    // Redirect to process listing page
    // navigate('/process');
    navigate('/process/1');
  };

  return (
    <div style={{ background: "#181A20", color: "#fff", minHeight: "100vh", fontFamily: "Inter, sans-serif", padding: 40 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Configure New Process</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>Process Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for the process"
                required
                style={{ width: "100%", padding: 16, borderRadius: 8, border: "none", background: "#23262F", color: "#fff", marginBottom: 0, fontSize: 16 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>Description *</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter a description of the process"
                required
                style={{ width: "100%", padding: 16, borderRadius: 8, border: "none", background: "#23262F", color: "#fff", marginBottom: 0, fontSize: 16 }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 18 }}>Data Source Configuration <span style={{ color: "#B0B3B8", fontWeight: 400, fontSize: 16, marginLeft: 16, cursor: "pointer" }}><FontAwesomeIcon icon={faPlus} /> New</span></div>
          <div style={{ display: "flex", gap: 32, borderBottom: "2px solid #35373B", marginBottom: 24 }}>
            {dataSourceTabs.map((tab, idx) => (
              <div
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                style={{
                  cursor: "pointer",
                  paddingBottom: 12,
                  borderBottom: activeTab === idx ? "3px solid #fff" : "none",
                  color: activeTab === idx ? "#fff" : "#B0B3B8",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 100
                }}
              >
                <FontAwesomeIcon icon={tab.icon} size="lg" style={{ marginBottom: 4 }} />
                <span style={{ fontWeight: 600, fontSize: 15 }}>{tab.label}</span>
              </div>
            ))}
          </div>
          {activeTab === 0 && (
            <>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>Data Source Link URL</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="url"
                    value={dataSourceUrl}
                    onChange={e => setDataSourceUrl(e.target.value)}
                    placeholder="Enter the URL of the data source"
                    style={{ 
                      width: "100%", 
                      padding: "16px 40px 16px 16px", 
                      borderRadius: 8, 
                      border: "none", 
                      background: "#23262F", 
                      color: "#fff", 
                      fontSize: 16 
                    }}
                  />
                  {dataSourceUrl && (
                    <button
                      type="button"
                      onClick={() => setDataSourceUrl("")}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#B0B3B8",
                        cursor: "pointer",
                        padding: 4
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "center", color: "#B0B3B8", margin: "24px 0 16px", fontWeight: 600 }}>OR</div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${isDragging ? "#3ED2B0" : "#35373B"}`,
                  borderRadius: 16,
                  padding: 40,
                  textAlign: "center",
                  marginBottom: 32,
                  background: isDragging ? "rgba(62, 210, 176, 0.1)" : "transparent",
                  transition: "all 0.3s ease",
                  position: "relative"
                }}
              >
                {!file && (
                  <>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Drag and drop files here</div>
                    <div style={{ color: "#B0B3B8", marginBottom: 16 }}>
                      Or click to browse. Supported types: images (PNG, JPG, GIF), videos (MP4, MOV, AVI), PDF
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file-upload"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept={Object.keys(ACCEPTED_FILE_TYPES).join(',')}
                    />
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      style={{
                        background: "#23262F",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "12px 32px",
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = "#2C2F36"}
                      onMouseOut={(e) => e.currentTarget.style.background = "#23262F"}
                    >
                      <FontAwesomeIcon icon={faUpload} />
                      Upload File
                    </button>
                  </>
                )}
                {file && (
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <FontAwesomeIcon icon={getFileIcon()} style={{ color: "#3ED2B0", fontSize: 24 }} />
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>{file.name}</div>
                          <div style={{ color: "#B0B3B8", fontSize: 14 }}>{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearFile}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#B0B3B8",
                          cursor: "pointer",
                          padding: 8,
                          borderRadius: "50%",
                          transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "none"}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                    {isUploading && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ 
                          height: 4, 
                          background: "#23262F", 
                          borderRadius: 2,
                          overflow: "hidden"
                        }}>
                          <div style={{
                            height: "100%",
                            width: `${uploadProgress}%`,
                            background: "#3ED2B0",
                            transition: "width 0.3s ease"
                          }} />
                        </div>
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between",
                          marginTop: 8,
                          fontSize: 14,
                          color: "#B0B3B8"
                        }}>
                          <span>Uploading... {uploadProgress}%</span>
                          <FontAwesomeIcon icon={faSpinner} spin />
                        </div>
                      </div>
                    )}
                    {previewUrl && (
                      <div style={{ 
                        marginTop: 16, 
                        borderRadius: 8, 
                        overflow: "hidden",
                        maxHeight: 200,
                        background: "#23262F"
                      }}>
                        {file.type.startsWith('image/') ? (
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            style={{ 
                              width: "100%", 
                              height: "auto",
                              objectFit: "contain"
                            }} 
                          />
                        ) : file.type.startsWith('video/') && (
                          <video 
                            src={previewUrl} 
                            controls 
                            style={{ 
                              width: "100%", 
                              maxHeight: 200,
                              objectFit: "contain"
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
                {fileError && (
                  <div style={{ 
                    marginTop: 16, 
                    padding: 12, 
                    background: "rgba(255, 107, 107, 0.1)", 
                    borderRadius: 8,
                    color: "#FF6B6B",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    {fileError}
                  </div>
                )}
              </div>
            </>
          )}
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>Tags</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Enter tags for process (comma-separated)"
              style={{ width: "100%", padding: 16, borderRadius: 8, border: "none", background: "#23262F", color: "#fff", fontSize: 16 }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: "#23262F",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "14px 40px",
              fontWeight: 700,
              fontSize: 18,
              cursor: "pointer",
              transition: "background 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#2C2F36"}
            onMouseOut={(e) => e.currentTarget.style.background = "#23262F"}
          >
            Create Process
          </button>
        </form>
      </div>
    </div>
  );
} 