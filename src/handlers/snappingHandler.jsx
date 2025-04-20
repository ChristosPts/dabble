import { Line } from "fabric";

let snappingEnabled = true;
const snappingDistance = 10;

export const toggleSnapping = (enabled = null, canvas = null) => {
  if (enabled !== null) {
    snappingEnabled = enabled;
  } else {
    snappingEnabled = !snappingEnabled;
  }
  
  // Clear guidelines when turning off
  if (!snappingEnabled && canvas) {
    clearGuideLines(canvas)
  }
  
  return snappingEnabled
}


export const isSnappingEnabled = () => snappingEnabled;


// Main handler for object movement with snapping

export const handleObjectMoving = ({ canvas, obj, guideLines, setGuideLines }) => {
  if (!snappingEnabled || !canvas) return
  
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  
  // Get object bounds
  const left = obj.left
  const top = obj.top
  const width = obj.width * obj.scaleX
  const height = obj.height * obj.scaleY
  const right = left + width
  const bottom = top + height
  
  // Get object centers
  const centerX = left + width / 2
  const centerY = top + height / 2
  
  let newGuideLines = []
  clearGuideLines(canvas)
  
  let snapped = false
  
  // Snap to canvas edges
  // Left edge
  if (Math.abs(left) < snappingDistance) {
    obj.set({ left: 0 });
    if (!guideLineExists(canvas, "vertical-left")) {
      const line = createVerticalGuideline(canvas, 0, "vertical-left")
      newGuideLines.push(line)
      canvas.add(line)
    }
    snapped = true
  }
  
  // Top edge
  if (Math.abs(top) < snappingDistance) {
    obj.set({ top: 0 })
    if (!guideLineExists(canvas, "horizontal-top")) {
      const line = createHorizontalGuideline(canvas, 0, "horizontal-top")
      newGuideLines.push(line)
      canvas.add(line)
    }
    snapped = true
  }
  
  // Right edge
  if (Math.abs(right - canvasWidth) < snappingDistance) {
    obj.set({ left: canvasWidth - width })
    if (!guideLineExists(canvas, "vertical-right")) {
      const line = createVerticalGuideline(canvas, canvasWidth, "vertical-right")
      newGuideLines.push(line)
      canvas.add(line)
    }
    snapped = true
  }
  
  // Bottom edge
  if (Math.abs(bottom - canvasHeight) < snappingDistance) {
    obj.set({ top: canvasHeight - height })
    if (!guideLineExists(canvas, "horizontal-bottom")) {
      const line = createHorizontalGuideline(canvas, canvasHeight, "horizontal-bottom")
      newGuideLines.push(line)
      canvas.add(line)
    }
    snapped = true
  }
  
  // Center snapping (horizontally)
  if (Math.abs(centerX - canvasWidth / 2) < snappingDistance) {
    obj.set({ left: canvasWidth / 2 - width / 2 })
    if (!guideLineExists(canvas, "vertical-center")) {
      const line = createVerticalGuideline(canvas, canvasWidth / 2, "vertical-center")
      newGuideLines.push(line)
      canvas.add(line)
    }
    snapped = true
  }
  
  // Center snapping (vertically)
  if (Math.abs(centerY - canvasHeight / 2) < snappingDistance) {
    obj.set({ top: canvasHeight / 2 - height / 2 })
    if (!guideLineExists(canvas, "horizontal-center")) {
      const line = createHorizontalGuideline(canvas, canvasHeight / 2, "horizontal-center")
      newGuideLines.push(line)
      canvas.add(line)
    }
    snapped = true
  }
  
  // Snap to other objects
  if (canvas.getObjects().length > 1) {
    canvas.getObjects().forEach((other) => {
      if (other === obj || !other.selectable) return
      
      const otherLeft = other.left
      const otherTop = other.top
      const otherWidth = other.width * other.scaleX
      const otherHeight = other.height * other.scaleY
      const otherRight = otherLeft + otherWidth
      const otherBottom = otherTop + otherHeight
      const otherCenterX = otherLeft + otherWidth / 2
      const otherCenterY = otherTop + otherHeight / 2
      
      // Left to left
      if (Math.abs(left - otherLeft) < snappingDistance) {
        obj.set({ left: otherLeft })
        if (!guideLineExists(canvas, `vertical-left-${other.id}`)) {
          const line = createVerticalGuideline(canvas, otherLeft, `vertical-left-${other.id}`)
          newGuideLines.push(line)
          canvas.add(line)
        }
        snapped = true
      }
      
      // Right to right
      if (Math.abs(right - otherRight) < snappingDistance) {
        obj.set({ left: otherRight - width })
        if (!guideLineExists(canvas, `vertical-right-${other.id}`)) {
          const line = createVerticalGuideline(canvas, otherRight, `vertical-right-${other.id}`)
          newGuideLines.push(line)
          canvas.add(line)
        }
        snapped = true
      }
      
      // Left to right
      if (Math.abs(left - otherRight) < snappingDistance) {
        obj.set({ left: otherRight })
        if (!guideLineExists(canvas, `vertical-right-${other.id}`)) {
          const line = createVerticalGuideline(canvas, otherRight, `vertical-right-${other.id}`)
          newGuideLines.push(line)
          canvas.add(line)
        }
        snapped = true
      }
      
      // Right to left
      if (Math.abs(right - otherLeft) < snappingDistance) {
        obj.set({ left: otherLeft - width })
        if (!guideLineExists(canvas, `vertical-left-${other.id}`)) {
          const line = createVerticalGuideline(canvas, otherLeft, `vertical-left-${other.id}`)
          newGuideLines.push(line)
          canvas.add(line)
        }
        snapped = true
      }
      
      // Top to top
      if (Math.abs(top - otherTop) < snappingDistance) {
        obj.set({ top: otherTop })
        if (!guideLineExists(canvas, `horizontal-top-${other.id}`)) {
          const line = createHorizontalGuideline(canvas, otherTop, `horizontal-top-${other.id}`)
          newGuideLines.push(line)
          canvas.add(line)
        }
        snapped = true
      }
      
      // Bottom to bottom
      if (Math.abs(bottom - otherBottom) < snappingDistance) {
        obj.set({ top: otherBottom - height });
        if (!guideLineExists(canvas, `horizontal-bottom-${other.id}`)) {
          const line = createHorizontalGuideline(canvas, otherBottom, `horizontal-bottom-${other.id}`)
          newGuideLines.push(line)
          canvas.add(line)
        }
        snapped = true
      }
      
      // Center alignment (horizontal)
      if (Math.abs(centerX - otherCenterX) < snappingDistance) {
        obj.set({ left: otherCenterX - width / 2 });
        if (!guideLineExists(canvas, `vertical-center-${other.id}`)) {
          const line = createVerticalGuideline(canvas, otherCenterX, `vertical-center-${other.id}`)
          newGuideLines.push(line)
          canvas.add(line)
        }
        snapped = true
      }
      
      // Center alignment (vertical)
      if (Math.abs(centerY - otherCenterY) < snappingDistance) {
        obj.set({ top: otherCenterY - height / 2 })
        if (!guideLineExists(canvas, `horizontal-center-${other.id}`)) {
          const line = createHorizontalGuideline(canvas, otherCenterY, `horizontal-center-${other.id}`)
          newGuideLines.push(line)
          canvas.add(line)
        }
        snapped = true
      }
    })
  }
  
  if (!snapped) {
    clearGuideLines(canvas)
  } else {
    setGuideLines(newGuideLines)
  }
  
  canvas.renderAll()
}


export const guideLineExists = (canvas, id) => {
  return canvas.getObjects().some(obj => obj.id === id);
}


export const createVerticalGuideline = (canvas, x, id) => {
  return new Line([x, 0, x, canvas.height], {
    id,
    stroke: 'red',
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.7,
  })
}

export const createHorizontalGuideline = (canvas, y, id) => {
  return new Line([0, y, canvas.width, y], {
    id,
    stroke: 'red',
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.7,
  })
}

export const clearGuideLines = (canvas) => {
  if (!canvas) return
  
  const objects = canvas.getObjects();
  const guidelines = objects.filter(obj => 
    obj.id && (obj.id.startsWith("vertical-") || obj.id.startsWith("horizontal-"))
  )
  
  guidelines.forEach(obj => {
    canvas.remove(obj)
  })
  
  canvas.renderAll()
}

export const setupSnappingEventListeners = (canvas, setGuideLines) => {
  const onObjectMoving = (e) => {
    handleObjectMoving({
      canvas,
      obj: e.target,
      guideLines: [],
      setGuideLines
    })
  }
  
  const onObjectModified = () => {
    clearGuideLines(canvas)
  }
  
  canvas.on('object:moving', onObjectMoving)
  canvas.on('object:modified', onObjectModified)
  
  // Return cleanup function
  return () => {
    canvas.off('object:moving', onObjectMoving)
    canvas.off('object:modified', onObjectModified)
  }
}