import React, { useState, useEffect } from 'react'
import SnappingToggle from './SnappingToggle';

function ToolbarBottom({ canvas }) {
  const [zoom, setZoom] = useState(100);
  const [isHandToolActive, setIsHandToolActive] = useState(false);

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

  return (
    <div className="bottom-toolbar">
      <div className="canvas-zoom">
        <span>Zoom: {zoom}%</span>
         
          <button className='btn' onClick={zoomOut} title="Zoom Out">-</button>
          <button className='btn' onClick={zoomIn} title="Zoom In">+</button>
          <button className='btn' onClick={resetView} title="Reset View">&#x21bb;</button>
        
      </div>
      
      <button 
        className={`btn ${isHandToolActive ? "active" : ""}`} 
        onClick={toggleHandTool}
        title="Hand Tool"
      >
        <span role="img" aria-label="Hand Tool">✋</span> 
      </button>

      <SnappingToggle canvas={canvas}/>
    </div>
  )
}

export default ToolbarBottom;