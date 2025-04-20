import { saveAs } from 'file-saver'


export const exportAsPNG = (canvas, filename = 'canvas-export.png') => {
  if (!canvas) return;
  
  // Get the data URL of the canvas with transparent background
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 1
  });
  
  const blob = dataURLToBlob(dataURL)
  saveAs(blob, filename)
}


export const exportAsJPG = (canvas, filename = 'canvas-export.jpg') => {
  if (!canvas) return
  
  // Store the current background color
  const originalBgColor = canvas.backgroundColor
  
  // Set white background for JPG (JPG doesn't support transparency)
  canvas.backgroundColor = '#FFFFFF'
  canvas.renderAll()
  
  // Get the data URL as a JPG
  const dataURL = canvas.toDataURL({
    format: 'jpeg',
    quality: 0.9,
    multiplier: 1
  })
  
  // Restore the original background color
  canvas.backgroundColor = originalBgColor;
  canvas.renderAll();
  
  const blob = dataURLToBlob(dataURL);
  saveAs(blob, filename)
}


const dataURLToBlob = (dataURL) => {
  const parts = dataURL.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)
  
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  
  return new Blob([uInt8Array], { type: contentType })
}


export const exportCanvasViaLink = (canvas, format = 'png') => {
  if (!canvas) return
  
  // Store original background for jpeg
  let originalBgColor;
  if (format === 'jpeg') {
    originalBgColor = canvas.backgroundColor
    canvas.backgroundColor = '#FFFFFF'
    canvas.renderAll()
  }
  
  // Create the data URL
  const dataURL = canvas.toDataURL({
    format: format,
    quality: format === 'jpeg' ? 0.9 : 1,
    multiplier: 1
  })
  
  // Restore background for jpeg
  if (format === 'jpeg') {
    canvas.backgroundColor = originalBgColor
    canvas.renderAll()
  }
  
  // Create a link element and trigger the download
  const link = document.createElement('a')
  link.href = dataURL
  link.download = `canvas-export.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}