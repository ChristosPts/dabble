import React from 'react';
import ImageUploader from './ImageUploader';
import useShapeTools from '../hooks/useShapeTools';
import useBrushTools from '../hooks/useBrushTools';
import "../css/toolbar-left.css"
import {
  Square,
  RectangleHorizontal,
  Triangle,
  Circle,
  LineChart,
  Type,
  Pencil,
  Paintbrush,
  SprayCan,
  ImagePlus,
  PenLine
} from 'lucide-react';

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
    <div className="toolbar-left-panel">
      <div className="tool-section">
        <label className="tool-label">Shapes</label>
        <div className="tool-group">
          <button className="btn" onClick={addRectangle} title="Rectangle"><RectangleHorizontal size={36} /></button>
          <button className="btn" onClick={addSquare} title="Square"><Square size={36} /></button>
          <button className="btn" onClick={addTriangle} title="Triangle"><Triangle size={36} /></button>
          <button className="btn" onClick={addCircle} title="Circle"><Circle size={36} /></button>
          <button className="btn" onClick={addLine} title="Line"><PenLine size={36} /></button>
          <button className="btn" onClick={addText} title="Text Tool"><Type size={36} /></button>

        </div>
      </div>

      <div className="tool-section">
        <label className="tool-label">Drawing</label>
        <div className="tool-group">
          <button
            className={`btn ${activeBrush === 'pencil' ? 'active' : ''}`}
            onClick={() => toggleDrawing('pencil')}
            title="Pencil"
          >
            <Pencil size={36} />
          </button>
          <button
            className={`btn icon ${activeBrush === 'pattern' ? 'active' : ''}`}
            onClick={() => toggleDrawing('pattern')}
            title="Pattern Brush"
          >
            <Paintbrush size={36} />
          </button>
          <button
            className={`btn ${activeBrush === 'spray' ? 'active' : ''}`}
            onClick={() => toggleDrawing('spray')}
            title="Spray Brush"
          >
            <SprayCan size={36} />
          </button>

        </div>
      </div>

      <div className="tool-section">
        <label className="tool-label">Image</label>
        <div className="tool-group">
          <ImageUploader canvas={canvas} />
        </div>
      </div>
    </div>
  );
}

export default ToolbarLeft;
