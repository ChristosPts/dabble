import React from 'react';
import Dropdown from './Dropdown';

function ToolbarTop({ canvas, dimensions, setDimensions }) {
  return (
    <div className="top-toolbar">
      <h1>Dabble</h1>
      <Dropdown 
        canvas={canvas} 
        dimensions={dimensions} 
        setDimensions={setDimensions} 
      />
    </div>
  );
}

export default ToolbarTop;