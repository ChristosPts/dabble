import { useEffect } from 'react'

export function useCanvasResize(canvas, containerRef, setDimensions) {
  useEffect(() => {
    if (!canvas || !containerRef.current) return

    const handleResize = () => {
      const container = containerRef.current
      const newWidth = Math.min(canvas.width, container.clientWidth)
      const newHeight = Math.min(canvas.height, container.clientHeight)

      canvas.setWidth(newWidth)
      canvas.setHeight(newHeight)
      canvas.renderAll()

      setDimensions({ width: newWidth, height: newHeight })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [canvas, containerRef, setDimensions])
}
