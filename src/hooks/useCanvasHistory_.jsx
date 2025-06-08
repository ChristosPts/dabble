import { useEffect, useRef, useState } from 'react';
import CanvasHistory from './CanvasHistory';

export function useCanvasHistory(canvas) {
  const historyRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [historyStatus, setHistoryStatus] = useState({ undoStates: 0, redoStates: 0 });
  
  // Initialize the history object when canvas is available
  useEffect(() => {
    if (!canvas) return;
    
    historyRef.current = new CanvasHistory(canvas);
    
    // Update UI state
    const updateStatus = () => {
      setCanUndo(historyRef.current.canUndo());
      setCanRedo(historyRef.current.canRedo());
      setHistoryStatus(historyRef.current.getHistoryStatus());
    };
    
    // Set interval to check status (not ideal but simpler than hooking all events)
    const statusInterval = setInterval(updateStatus, 500);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, [canvas]);

  // Undo function
  const undo = async () => {
    if (!historyRef.current) return;
    
    await historyRef.current.undo();
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
    setHistoryStatus(historyRef.current.getHistoryStatus());
  };

  // Redo function
  const redo = async () => {
    if (!historyRef.current) return;
    
    await historyRef.current.redo();
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
    setHistoryStatus(historyRef.current.getHistoryStatus());
  };

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    historyStatus
  };
}