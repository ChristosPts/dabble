import React from 'react'
import useCanvasExport from '../hooks/useCanvasExport'

const ExportButtons = ({ canvas,  onExport = () => {} }) => {
  const exportFunctions = useCanvasExport ? useCanvasExport(canvas) : {
    exportToPNG: () => {
      if (!canvas) return
      
      // Create a temporary link element
      const link = document.createElement('a')
      // Set the download attribute with a filename
      link.download = 'canvas-export.png'
      
      // Get the canvas data URL
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
        multiplier: 1
      })
      
      // Set the link's href to the canvas data URL
      link.href = dataURL
      
      // Append the link to the body
      document.body.appendChild(link)
      
      // Trigger the download
      link.click()
      
      // Clean up - remove the link
      document.body.removeChild(link)
      
      // Call the onExport callback (will close dropdown if in dropdown mode)
      onExport();
    },
    
    exportToJPG: () => {
      if (!canvas) return
      
      // Store the original background if it's transparent
      const originalBackground = canvas.backgroundColor
      
      // Set white background temporarily if transparent
      if (!canvas.backgroundColor) {
        canvas.backgroundColor = '#ffffff'
        canvas.renderAll()
      }
      
      const link = document.createElement('a')
      link.download = 'canvas-export.jpg'
      const dataURL = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.9,
        multiplier: 1
      })
      
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      if (!originalBackground) {
        canvas.backgroundColor = null
        canvas.renderAll()
      }
      
      onExport()
    }
  }
  
  const { exportToPNG, exportToJPG } = exportFunctions

  // Handle export actions
  const handleExportPNG = () => {
    exportToPNG()
    onExport()
  }

  const handleExportJPG = () => {
    exportToJPG()
    onExport()
  }

    return (
      <>
        <div className="dropdown-item" onClick={handleExportPNG}>
          Export as PNG
        </div>
        <div className="dropdown-item" onClick={handleExportJPG}>
          Export as JPG
        </div>
      </>
    )
}

export default ExportButtons