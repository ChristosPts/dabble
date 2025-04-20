import React from 'react';
import useCanvasExport from '../hooks/useCanvasExport';

/**
 * Export buttons component for canvas
 * @param {Object} props - Component props
 * @param {Object} props.canvas - The Fabric.js canvas instance
 * @returns {JSX.Element} - Rendered component
 */
const ExportButtons = ({ canvas }) => {
  const { exportToPNG, exportToJPG } = useCanvasExport(canvas);
  
  const exportButtonStyle = {
    padding: '5px 10px',
    border: 'none',
    margin: '0 5px',
    cursor: 'pointer'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button 
        style={{
          ...exportButtonStyle,
          backgroundColor: '#4444ff',
          color: 'white'
        }}
        onClick={() => exportToPNG()}
        title="Export as PNG"
      >
        Export PNG
      </button>
      
      <button 
        style={{
          ...exportButtonStyle,
          backgroundColor: '#44aa44',
          color: 'white'
        }}
        onClick={() => exportToJPG()}
        title="Export as JPG"
      >
        Export JPG
      </button>
    </div>
  );
};

export default ExportButtons;