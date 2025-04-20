import { useEffect } from 'react';

const useDeleteObject = (canvas) => {
  useEffect(() => {
    if (!canvas) return
    
    const handleKeyDown = (e) => {
      // Check if Delete or Backspace was pressed and there's an active object
      if ((e.key === 'Delete' || e.key === 'Backspace') && 
          canvas.getActiveObject() && 
          document.activeElement.tagName !== 'INPUT' && 
          document.activeElement.tagName !== 'TEXTAREA') {
        deleteSelectedObjects()
      }
    }
    
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown)
 
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    };
  }, [canvas])
  
 
  const deleteSelectedObjects = () => {
    if (!canvas) return
    
    const activeObject = canvas.getActiveObject()
    
    if (activeObject) {
      canvas.remove(activeObject)
      // If it's a group of objects
      // if (activeObject.type === 'activeSelection') {
      //   // Remove all objects in the selection
      //   activeObject.forEachObject((obj) => {
      //     canvas.remove(obj)
      //   });
      // } else {
      //   // Remove the single selected object
      //canvas.remove(activeObject)
      // }
      
      // Clear selection and render canvas
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }
  }
  
  return {
    deleteSelectedObjects
  }
}

export default useDeleteObject