import React, { useState, useEffect } from 'react'

const CanvasSettings = ({ canvas, dimensions, setDimensions }) => {
  const [width, setWidth] = useState(dimensions?.width?.toString() || '800')
  const [height, setHeight] = useState(dimensions?.height?.toString() || '600')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [isTransparent, setIsTransparent] = useState(false)

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
  
  // Canvas dimension handlers
  const handleWidthChange = (e) => {
    setWidth(e.target.value)
  };

  const handleHeightChange = (e) => {
    setHeight(e.target.value)
  };

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
    canvas.setWidth(constrainedWidth);
    canvas.renderAll()
    setDimensions(prev => ({ ...prev, width: constrainedWidth }));
    setWidth(constrainedWidth.toString())
  }

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
    setDimensions(prev => ({ ...prev, height: constrainedHeight }));
    setHeight(constrainedHeight.toString())
  }

  // Handle key down on input fields
  const handleKeyDown = (applyFn) => (e) => {
    if (e.key === 'Enter') {
      applyFn()
      e.target.blur() // Remove focus
    }
  }

  // Background color handlers
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
        <>
 <div className="dropdown-section-title">Canvas Dimensions</div>
      <div className="dropdown-item">
        <label htmlFor="canvas-width">Width:</label>
        <input
          id="canvas-width"
          type="text"
          value={width}
          onChange={handleWidthChange}
          onBlur={applyWidthChange}
          onKeyDown={handleKeyDown(applyWidthChange)}
          className="canvas-input"
        />
      </div>
      
      <div className="dropdown-item">
        <label htmlFor="canvas-height">Height:</label>
        <input
          id="canvas-height"
          type="text"
          value={height}
          onChange={handleHeightChange}
          onBlur={applyHeightChange}
          onKeyDown={handleKeyDown(applyHeightChange)}
          className="canvas-input"
        />
      </div>
      
      <div className="dropdown-divider"></div>
      
      <div className="dropdown-section-title">Appearance</div>
      <div className="dropdown-item">
        <label htmlFor="bg-color">Background:</label>
        <div className="color-picker-wrapper">
          <input 
            id="bg-color"
            type="color" 
            value={bgColor}
            onChange={handleBackgroundChange}
            disabled={isTransparent}
            title="Background Color"
            className="color-picker"
          />
          {isTransparent && <div className="disabled-overlay"></div>}
        </div>
      </div>
      
      <div className="dropdown-item checkbox-item">
        <label className="checkbox-label">
          <input 
            type="checkbox"
            checked={isTransparent}
            onChange={toggleTransparent}
            className="checkbox-input"
          />
          <span className="checkbox-text">Transparent Background</span>
        </label>
      </div>

      <div className="dropdown-divider"></div>
      
      <div className="dropdown-item button-container">
        <button 
          onClick={() => {
            if (canvas) {
              canvas.clear() // Removes all objects and background
              canvas.backgroundColor = isTransparent ? null : bgColor // Restore background color
              canvas.renderAll()
            }
          }}
          className="clear-button"
        >
          <span className="button-icon">🗑️</span>
          Clear Canvas
        </button>
      </div>

        </>
    
  )
}

export default CanvasSettings