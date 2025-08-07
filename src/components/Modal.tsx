import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  steps: string[];
  taskName: string;
}

export function Modal({ open, onClose, steps, taskName }: ModalProps): JSX.Element | null {
    if (!open) return null;
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}>
        <div className='bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' style={{ borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 500 }}>
          <h2 style={{ marginBottom: 16 }}>{taskName} - Steps</h2>
          <ol style={{ marginBottom: 24 }}>
            {steps.map((step, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>{step}</li>
            ))}
          </ol>
          <button onClick={onClose} style={{ background: "#E6E8EB", color: "#181A20", border: "none", borderRadius: 8, padding: "8px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Close</button>
        </div>
      </div>
    );
  } 