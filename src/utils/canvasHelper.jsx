// Helper function to convert hex to rgb
export function hexToRgb(hex) {
  if (!hex) return null;
  
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Update object properties
export function updateObject(selectedObj, key, value, canvas) {
  if (!selectedObj) return;

  switch (key) {
    case 'width':
      selectedObj.set('width', parseFloat(value) / selectedObj.scaleX);
      break;
    case 'height':
      selectedObj.set('height', parseFloat(value) / selectedObj.scaleY);
      break;
    case 'diameter':
      selectedObj.set('radius', parseFloat(value) / 2 / selectedObj.scaleX);
      break;
    case 'fill':
      selectedObj.set('fill', value === 'transparent' ? null : value);
      break;
    case 'stroke':
      selectedObj.set('stroke', value);
      break;
    case 'strokeWidth':
      selectedObj.set('strokeWidth', parseFloat(value));
      break;
    case 'strokeDashArray':
      selectedObj.set('strokeDashArray', value === 'dashed' ? [5, 5] : []);
      break;
    case 'text':
      selectedObj.set('text', value);
      selectedObj.initDimensions(); 
      break;
    case 'fontSize':
      selectedObj.set('fontSize', parseInt(value));
      break;
    case 'fontFamily':
      selectedObj.set('fontFamily', value);
      break;
    case 'opacity':
      selectedObj.set('opacity', parseFloat(value) / 100);
      break;
    default:
      break;
  }

  selectedObj.setCoords();
  canvas.requestRenderAll();
}

// Update brush properties
export function updateBrush(brush, key, value, canvas) {
  if (!brush) return;
  
  switch (key) {
    case 'color':
      brush.color = value;
      break;
    case 'width':
      brush.width = Math.max(1, Math.min(100, parseInt(value)));
      break;
    case 'opacity':
      const opacityValue = parseFloat(value) / 100;
      
      if (brush.constructor.name === 'SprayBrush') {
        brush.opacity = opacityValue;
      } else {
        if (brush.color && brush.color.indexOf('rgba') === -1) {
          const rgb = hexToRgb(brush.color) || { r: 0, g: 0, b: 0 };
          brush.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityValue})`;
        }
      }
      break;
    case 'sprayDensity':
      if (typeof brush.density !== 'undefined') {
        brush.density = parseInt(value);
      }
      break;
    case 'sprayWidth':
      if (typeof brush.sprayWidth !== 'undefined') {
        brush.sprayWidth = parseInt(value);
      }
      break;
    default:
      break;
  }
  
  canvas.requestRenderAll();
}

// Delete selected objects
export function deleteSelectedObjects(canvas) {
  if (!canvas) return;
  
  const activeObject = canvas.getActiveObject();
  
  if (activeObject) {
    if (activeObject.type === 'activeSelection') {
      activeObject.forEachObject((obj) => {
        canvas.remove(obj);
      });
    } else {
      canvas.remove(activeObject);
    }
    
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}