import { useCallback } from 'react';
import { exportAsPNG, exportAsJPG } from '../handlers/exportHandler';

const useCanvasExport = (canvas) => {

  const exportToPNG = useCallback((filename) => {
    if (!canvas) return;
    exportAsPNG(canvas, filename)
  }, [canvas])
  

  const exportToJPG = useCallback((filename) => {
    if (!canvas) return
    exportAsJPG(canvas, filename)
  }, [canvas])
  
  return {
    exportToPNG,
    exportToJPG
  }
}

export default useCanvasExport