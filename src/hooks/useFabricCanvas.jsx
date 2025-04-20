import { useEffect, useState, useRef } from 'react'
import { Canvas } from 'fabric'

export function useFabricCanvas(canvasRef, containerRef, defaultWidth, defaultHeight) {
  const [canvas, setCanvas] = useState(null)
  const [dimensions, setDimensions] = useState({ width: defaultWidth, height: defaultHeight })
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    
    const container = containerRef.current
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    
    const initialWidth = Math.min(defaultWidth, containerWidth)
    const initialHeight = Math.min(defaultHeight, containerHeight)
    
    const initCanvas = new Canvas(canvasRef.current, {
      width: initialWidth,
      height: initialHeight,
      backgroundColor: '#ffffff' // Default white background
    })
    
    initCanvas.renderAll()
    setCanvas(initCanvas)
    setDimensions({ width: initialWidth, height: initialHeight })
    
    return () => {
      initCanvas.dispose()
    }
  }, [])
  
  return { canvas, dimensions, setDimensions }
}