import React, { useState, useEffect } from 'react'
import "../css/canvas-settings.css"
import SnappingToggle from './SnappingToggle';
import ExportButtons from './ExportButtons';

function CanvasSettings({ canvas, dimensions, setDimensions }) {
  const [zoom, setZoom] = useState(100);
  const [width, setWidth] = useState(dimensions.width.toString())
  const [height, setHeight] = useState(dimensions.height.toString())
  const [isHandToolActive, setIsHandToolActive] = useState(false)
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

  // Setup and cleanup hand tool when active state changes
  useEffect(() => {
    if (!canvas) return
    
    if (isHandToolActive) {
      enableHandTool()
    } else {
      disableHandTool()
    }
    
    return () => {
      if (canvas) {
        disableHandTool()
      }
    };
  }, [isHandToolActive, canvas])

  // Enable hand tool functionality
  const enableHandTool = () => {
    if (!canvas) return
    
    // Change cursor to indicate hand tool
    canvas.defaultCursor = 'grab'
    canvas.hoverCursor = 'grab'
    
    // Disable selection while hand tool is active
    canvas.selection = false
    
    // Variables to track dragging
    let isDragging = false
    let lastPosX, lastPosY
    
    // Store original event handlers
    canvas._handToolOriginalMouseDown = canvas.__eventListeners['mouse:down']
    canvas._handToolOriginalMouseMove = canvas.__eventListeners['mouse:move']
    canvas._handToolOriginalMouseUp = canvas.__eventListeners['mouse:up']
    
    // Remove existing event listeners to avoid conflicts
    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
    
    // Add new mouse down handler
    canvas.on('mouse:down', function(opt) {
      const evt = opt.e;
      isDragging = true;
      canvas.defaultCursor = 'grabbing'
      canvas.hoverCursor = 'grabbing'
      lastPosX = evt.clientX
      lastPosY = evt.clientY
      
      // Prevent default to avoid text selection while dragging
      evt.preventDefault()
      evt.stopPropagation()
    });
    
    // Add new mouse move handler
    canvas.on('mouse:move', function(opt) {
      if (isDragging) {
        const evt = opt.e
        const vpt = canvas.viewportTransform
        const deltaX = evt.clientX - lastPosX
        const deltaY = evt.clientY - lastPosY
        
        // Move the viewport
        vpt[4] += deltaX
        vpt[5] += deltaY
        
        // Constrain movement to not go outside the canvas edges when zoomed in
        if (zoom > 100) {
          const zoomFactor = zoom / 100
          const canvasWidth = canvas.width * zoomFactor
          const canvasHeight = canvas.height * zoomFactor
          const viewportWidth = canvas.width
          const viewportHeight = canvas.height
          
          // Calculate max pan distances
          const maxPanX = (canvasWidth - viewportWidth) / 2
          const maxPanY = (canvasHeight - viewportHeight) / 2
          
          // Apply constraints
          vpt[4] = Math.min(Math.max(vpt[4], -maxPanX), maxPanX)
          vpt[5] = Math.min(Math.max(vpt[5], -maxPanY), maxPanY)
        } else {
          // If not zoomed in, reset position to center
          vpt[4] = 0
          vpt[5] = 0
        }
        
        canvas.setViewportTransform(vpt)
        canvas.requestRenderAll()
        
        lastPosX = evt.clientX
        lastPosY = evt.clientY
        
        // Prevent default to avoid text selection while dragging
        evt.preventDefault()
        evt.stopPropagation()
      }
    });
    
    // Add new mouse up handler
    canvas.on('mouse:up', function() {
      isDragging = false
      canvas.defaultCursor = 'grab'
      canvas.hoverCursor = 'grab'
    });
  };

  // Disable hand tool functionality
  const disableHandTool = () => {
    if (!canvas) return
    
    // Restore default cursors
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'default'
    
    // Re-enable selection
    canvas.selection = true
    
    // Remove hand tool event handlers
    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
    
    // Restore original event handlers if they exist
    if (canvas._handToolOriginalMouseDown) {
      canvas._handToolOriginalMouseDown.forEach(handler => {
        canvas.on('mouse:down', handler)
      })
    }
    
    if (canvas._handToolOriginalMouseMove) {
      canvas._handToolOriginalMouseMove.forEach(handler => {
        canvas.on('mouse:move', handler)
      })
    }
    
    if (canvas._handToolOriginalMouseUp) {
      canvas._handToolOriginalMouseUp.forEach(handler => {
        canvas.on('mouse:up', handler)
      })
    }
  }

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

  // Zoom in function
  const zoomIn = () => {
    if (!canvas) return
    
    const newZoom = Math.min(zoom + 10, 300)
    setZoom(newZoom)
    
    // Apply zoom to canvas
    const scaleFactor = newZoom / 100
    
    // Get current center point
    const center = {
      x: canvas.getWidth() / 2,
      y: canvas.getHeight() / 2
    };
    
    // Apply zoom centered on the canvas
    canvas.zoomToPoint(center, scaleFactor)
    
    // After zooming, constrain the view to the canvas bounds
    constrainViewport()
    
    canvas.renderAll()
  }

  // Zoom out function
  const zoomOut = () => {
    if (!canvas) return
    
    const newZoom = Math.max(zoom - 10, 10)
    setZoom(newZoom)
    
    // Apply zoom to canvas
    const scaleFactor = newZoom / 100
    
    // Get current center point
    const center = {
      x: canvas.getWidth() / 2,
      y: canvas.getHeight() / 2
    }
    
    // Apply zoom centered on the canvas
    canvas.zoomToPoint(center, scaleFactor)
    
    // After zooming, constrain the view to the canvas bounds
    constrainViewport()
  
    canvas.renderAll()
  }

  // Constrain viewport to not show outside canvas when zoomed in
  const constrainViewport = () => {
    if (!canvas) return
    
    const vpt = canvas.viewportTransform;
    const zoomFactor = zoom / 100
    
    // Only apply constraints if zoomed in
    if (zoomFactor > 1) {
      const canvasWidth = canvas.width * zoomFactor
      const canvasHeight = canvas.height * zoomFactor
      const viewportWidth = canvas.width
      const viewportHeight = canvas.height
      
      // Calculate max pan distances
      const maxPanX = (canvasWidth - viewportWidth) / 2
      const maxPanY = (canvasHeight - viewportHeight) / 2
      
      // Apply constraints
      vpt[4] = Math.min(Math.max(vpt[4], -maxPanX), maxPanX)
      vpt[5] = Math.min(Math.max(vpt[5], -maxPanY), maxPanY)
      
      canvas.setViewportTransform(vpt)
    } else {
      // If not zoomed in, reset position to center
      vpt[4] = 0
      vpt[5] = 0
      canvas.setViewportTransform(vpt)
    }
  }

  // Reset view (center canvas and set zoom to 100%)
  const resetView = () => {
    if (!canvas) return
    
    setZoom(100);
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    canvas.renderAll()
  };

  // Toggle hand tool
  const toggleHandTool = () => {
    setIsHandToolActive(!isHandToolActive)
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
    <div className="canvas-settings">
      
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
      
      <div className="canvas-zoom">
        <span>Zoom: {zoom}%</span>
        <div>
          <button className='btn' onClick={zoomOut} title="Zoom Out">-</button>
          <button className='btn' onClick={zoomIn} title="Zoom In">+</button>
          <button className='btn' onClick={resetView} title="Reset View">&#x21bb;</button>
        </div>
      </div>
      
      <button 
        className={`btn ${isHandToolActive ? "active" : ""}`} 
        onClick={toggleHandTool}
        title="Hand Tool"
      >
        <span role="img" aria-label="Hand Tool">✋</span> 
      </button>

      <div className="background-controls">
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

      <SnappingToggle canvas={canvas}/>
      <ExportButtons canvas={canvas} />
    </div>
  );
}

export default CanvasSettings