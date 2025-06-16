import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faHeadset, faEnvelope, faUsers, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const dataSourceTabs = [
  { label: "Manual Upload", icon: faUpload },
  { label: "Service Desk", icon: faHeadset },
  { label: "Email", icon: faEnvelope },
  { label: "Teams", icon: faUsers },
];

export default function CreateProcess() {
  const [activeTab, setActiveTab] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dataSourceUrl, setDataSourceUrl] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new process object
    const newProcess = {
      id: Date.now(), // Using timestamp as temporary ID
      created: new Date().toISOString().split('T')[0],
      transcription: '0/0',
      status: 'IN REVIEW',
      statusColor: 'bg-yellow-600',
      title: title,
      description: description,
      dataSourceUrl: dataSourceUrl,
      tags: tags.split(',').map(tag => tag.trim()),
      file: file
    };

    // Get existing processes from localStorage
    const existingProcesses = JSON.parse(localStorage.getItem('processes') || '[]');
    
    // Add new process to the list
    const updatedProcesses = [...existingProcesses, newProcess];
    
    // Save updated processes list
    localStorage.setItem('processes', JSON.stringify(updatedProcesses));

    // Redirect to process listing page
    navigate('/process');
  };

  return (
    <div style={{ background: "#181A20", color: "#fff", minHeight: "100vh", fontFamily: "Inter, sans-serif", padding: 40 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Configure New Process</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>Process Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for the process"
                style={{ width: "100%", padding: 16, borderRadius: 8, border: "none", background: "#23262F", color: "#fff", marginBottom: 0, fontSize: 16 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>Description</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter a description of the process"
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
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>Data Source Link URL</label>
            <input
              type="text"
              value={dataSourceUrl}
              onChange={e => setDataSourceUrl(e.target.value)}
              placeholder="Enter the URL of the data source"
              style={{ width: "100%", padding: 16, borderRadius: 8, border: "none", background: "#23262F", color: "#fff", fontSize: 16 }}
            />
          </div>
          <div style={{ textAlign: "center", color: "#B0B3B8", margin: "24px 0 16px", fontWeight: 600 }}>OR</div>
          <div style={{ border: "2px dashed #35373B", borderRadius: 16, padding: 40, textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Drag and drop files here</div>
            <div style={{ color: "#B0B3B8", marginBottom: 16 }}>Or click to browse. Supported types: video, image, PDF</div>
            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <button type="button" style={{ background: "#23262F", color: "#fff", border: "none", borderRadius: 8, padding: "10px 32px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Upload</button>
            </label>
            {file && <div style={{ marginTop: 12, color: "#3ED2B0" }}>{file.name}</div>}
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>Tags</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Enter tags for process"
              style={{ width: "100%", padding: 16, borderRadius: 8, border: "none", background: "#23262F", color: "#fff", fontSize: 16 }}
            />
          </div>
          <button 
            type="submit"
            style={{ background: "#23262F", color: "#fff", border: "none", borderRadius: 16, padding: "14px 40px", fontWeight: 700, fontSize: 18, cursor: "pointer" }}
          >
            Create Process
          </button>
        </form>
      </div>
    </div>
  );
} 