import React from 'react';
import ImageUploader from './ImageUploader';
import useShapeTools from '../hooks/useShapeTools';
import useBrushTools from '../hooks/useBrushTools';

function ToolbarLeft({ canvas, setActiveBrush, activeBrush }) {
  const { isDrawing, setIsDrawing, toggleDrawing } = useBrushTools(canvas, activeBrush, setActiveBrush);
  
  const { 
    addRectangle, 
    addSquare, 
    addTriangle, 
    addCircle, 
    addLine, 
    addText 
  } = useShapeTools(canvas, isDrawing, setIsDrawing, setActiveBrush);

  return (
    <div className="toolbar-left">
      <div className="shape-tools">
        <h3>Shapes</h3>
        <div>
          <button onClick={addRectangle}>&#9645;</button>
          <button onClick={addSquare}>&#8414;</button>
          <button onClick={addText}>T</button>
          <button onClick={addTriangle}>&#8420;</button>
          <button onClick={addCircle}>&#9711;</button>
          <button onClick={addLine}>-</button>
          <ImageUploader canvas={canvas} />
        </div>
      </div>
      
      <div className="drawing-tools">
        <h3>Drawing Tools</h3>
        <div>
          <button onClick={() => toggleDrawing('pencil')}>
            {activeBrush === 'pencil' ? '🛑 Stop Pencil' : '✏️ Pencil'}
          </button>
          <button onClick={() => toggleDrawing('pattern')}>
            {activeBrush === 'pattern' ? '🛑 Stop Pattern' : '🖌️ Pattern'}
          </button>
          <button onClick={() => toggleDrawing('spray')}>
            {activeBrush === 'spray' ? '🛑 Stop Spray' : '💦 Spray'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToolbarLeft;