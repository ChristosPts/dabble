import React, { useState, useEffect } from 'react'
import ExportButtons from './ExportButtons';

function TopToolbar({ canvas, dimensions, setDimensions }) {
  const [width, setWidth] = useState(dimensions.width.toString())
  const [height, setHeight] = useState(dimensions.height.toString())
  const [bgColor, setBgColor] = useState('#ffffff') // Default background color
  const [isTransparent, setIsTransparent] = useState(false) // Track transparency state

  // Update local state when dimensions change
  useEffect(() => {
    if (canvas) {
      setWidth(dimensions.width.toString())
      setHeight(dimensions.height.toString())
      
      // Initialize background color state from canvas
      if (canvas.backgroundColor) {
        setBgColor(canvas.backgroundColor)
        setIsTransparent(false)
      } else {
        setIsTransparent(true)
      }
    }
  }, [canvas, dimensions])

  const handleWidthChange = (e) => {
    setWidth(e.target.value)
  }

  const handleHeightChange = (e) => {
    setHeight(e.target.value)
  };

  // Apply width change when input loses focus or Enter is pressed
  const applyWidthChange = () => {
    if (!canvas) return
    
    const newWidth = parseInt(width, 10)
    if (isNaN(newWidth) || newWidth < 50) {
      setWidth(dimensions.width.toString())
      return
    }
    
    // Calculate max width based on canvas parent
    const canvasParent = canvas.wrapperEl.parentNode
    const maxWidth = canvasParent.clientWidth
    
    // Set width but constrain it to parent size
    const constrainedWidth = Math.min(newWidth, maxWidth)
    
    // Reset view transform to avoid unexpected behavior
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    
    canvas.setWidth(constrainedWidth)
    canvas.renderAll()
    setDimensions(prev => ({ ...prev, width: constrainedWidth }))
    setWidth(constrainedWidth.toString())
  }

  // Apply height change when input loses focus or Enter is pressed
  const applyHeightChange = () => {
    if (!canvas) return
    
    const newHeight = parseInt(height, 10)
    if (isNaN(newHeight) || newHeight < 50) {
      setHeight(dimensions.height.toString())
      return
    }
    
    // Calculate max height based on canvas parent
    const canvasParent = canvas.wrapperEl.parentNode
    const maxHeight = canvasParent.clientHeight
    
    // Set height but constrain it to parent size
    const constrainedHeight = Math.min(newHeight, maxHeight)
    
    // Reset view transform to avoid unexpected behavior
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    
    canvas.setHeight(constrainedHeight)
    canvas.renderAll()
    setDimensions(prev => ({ ...prev, height: constrainedHeight }))
    setHeight(constrainedHeight.toString())
  }

  // Handle key down on input fields
  const handleKeyDown = (applyFn) => (e) => {
    if (e.key === 'Enter') {
      applyFn()
      e.target.blur() // Remove focus
    }
  }

  // Handle background color change
  const handleBackgroundChange = (e) => {
    const color = e.target.value
    setBgColor(color) // Update the state for the color
    setIsTransparent(false) // Uncheck transparent box when selecting a color
    
    if (canvas) {
      canvas.backgroundColor = color
      canvas.requestRenderAll()
    }
  }
  
  // Toggle background transparency
  const toggleTransparent = () => {
    const newTransparentState = !isTransparent
    setIsTransparent(newTransparentState)
    
    if (canvas) {
      if (newTransparentState) {
        // Save current background color before setting to transparent
        if (!isTransparent) {
          setBgColor(canvas.backgroundColor || '#ffffff')
        }
        canvas.backgroundColor = null
      } else {
        // Restore background color
        canvas.backgroundColor = bgColor
      }
      canvas.requestRenderAll()
    }
  }

  return (
    <div className="top-toolbar">
      <div style={{display:'flex', flexDirection: 'column'}}>
        <div>
          <span>Width:</span>
          <input
            type="text"
            value={width}
            onChange={handleWidthChange}
            onBlur={applyWidthChange}
            onKeyDown={handleKeyDown(applyWidthChange)}
          />
        </div>
        
        <div>
          <span>Height:</span>
          <input
            type="text"
            value={height}
            onChange={handleHeightChange}
            onBlur={applyHeightChange}
            onKeyDown={handleKeyDown(applyHeightChange)}
          />
        </div>
    </div>
      <div className="background-controls" style={{display:'flex', flexDirection: 'column'}}>
        <span>Background:</span>
        <input 
          type="color" 
          value={bgColor}
          onChange={handleBackgroundChange}
          disabled={isTransparent}
          title="Background Color"
        />
        <label title="Make Background Transparent">
          <input 
            type="checkbox"
            checked={isTransparent}
            onChange={toggleTransparent}
          />
          Transparent
        </label>
      </div>

      <ExportButtons canvas={canvas} />
    </div>
  );
}

export default TopToolbar;