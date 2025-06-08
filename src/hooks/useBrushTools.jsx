import { PencilBrush, PatternBrush, SprayBrush } from 'fabric';
import { useState, useEffect } from 'react';

function useBrushTools(canvas, activeBrush, setActiveBrush) {
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize brush when drawing mode is activated
  const initializeBrush = (brushType) => {
    if (!canvas) return null;
    
    let brush;
    switch (brushType) {
      case 'pencil':
        brush = new PencilBrush(canvas);
        break;
      case 'pattern':
        brush = new PatternBrush(canvas);
        break;
      case 'spray':
        brush = new SprayBrush(canvas);
        break;
      default:
        brush = new PencilBrush(canvas);
    }
    
    // Set initial brush properties
    brush.color = '#000000';
    brush.width = 5;
    
    return brush;
  };
  
  const toggleDrawing = (brushType) => {
    if (!canvas) return;
    
    // If we're already in drawing mode with this brush, exit drawing mode
    if (isDrawing && activeBrush === brushType) {
      setIsDrawing(false);
      canvas.isDrawingMode = false;
      setActiveBrush('');
      return;
    }
    
    // Otherwise, enter drawing mode with the selected brush
    setIsDrawing(true);
    canvas.isDrawingMode = true;
    setActiveBrush(brushType);
    
    // Create and set the brush
    const brush = initializeBrush(brushType);
    if (brush) {
      canvas.freeDrawingBrush = brush;
    }
  };

  // Effect to track drawing mode status
  useEffect(() => {
    if (!activeBrush) {
      setIsDrawing(false);
    } else {
      setIsDrawing(true);
    }
  }, [activeBrush]);

  return {
    isDrawing,
    setIsDrawing,
    toggleDrawing
  };
}

export default useBrushTools;