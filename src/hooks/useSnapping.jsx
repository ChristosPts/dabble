import { useState, useEffect } from 'react';
import { 
  setupSnappingEventListeners, 
  toggleSnapping, 
  isSnappingEnabled, 
  clearGuideLines 
} from '../handlers/snappingHandler';

 
const useSnapping = (canvas) => {
  const [guideLines, setGuideLines] = useState([]);
  const [snappingOn, setSnappingOn] = useState(true);

  // Set up event listeners when canvas is available
  useEffect(() => {
    if (!canvas) return;
    
    // Setup event listeners
    const cleanup = setupSnappingEventListeners(canvas, setGuideLines);
    
    // Initialize with current state
    setSnappingOn(isSnappingEnabled());
    
    return () => {
      cleanup();
      clearGuideLines(canvas);
    };
  }, [canvas]);

  
  const toggleSnappingHandler = () => {
    const newState = toggleSnapping(null, canvas);
    setSnappingOn(newState);
    
    if (!newState) {
      clearGuideLines(canvas);
      setGuideLines([]);
    }
  };

  return {
    guideLines,
    snappingEnabled: snappingOn,
    toggleSnapping: toggleSnappingHandler
  };
};

export default useSnapping;