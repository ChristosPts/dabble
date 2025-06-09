import {  FabricImage } from 'fabric'
import { ImageUp } from 'lucide-react'
import React from 'react'

function ImageUploader({ canvas }) {
  const handleAddImage = (e) => {
    const imgObj = e.target.files[0]
    if (!imgObj) return

    const reader = new FileReader()
    reader.readAsDataURL(imgObj)
    reader.onload = (e) => {
      const imageUrl = e.target.result
      const imageElement = document.createElement('img')
      imageElement.src = imageUrl
      imageElement.onload = () => {
        const image = new FabricImage(imageElement, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5,
        })
        canvas.add(image)
      }
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        id="upload"
        hidden
        onChange={handleAddImage}
      />
      <label htmlFor="upload" className="btn"><ImageUp size={50}/></label>
    </div>
  )
}

export default ImageUploader
