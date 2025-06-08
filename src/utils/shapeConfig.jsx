// Configuration objects for shape and brush properties
export const shapeConfigs = {
  rect: ['width', 'height', 'fill', 'stroke', 'strokeWidth', 'strokeDashArray', 'opacity'],
  square: ['width', 'height', 'fill', 'stroke', 'strokeWidth', 'strokeDashArray', 'opacity'],
  triangle: ['width', 'height', 'fill', 'stroke', 'strokeWidth', 'strokeDashArray', 'opacity'],
  circle: ['diameter', 'fill', 'stroke', 'strokeWidth', 'strokeDashArray', 'opacity'],
  image: ['width', 'height', 'opacity'],
  line: ['stroke', 'strokeWidth', 'strokeDashArray', 'opacity'],
  'i-text': ['text', 'fontSize', 'fill', 'stroke', 'strokeWidth', 'fontFamily', 'opacity']
};

// Brush configurations
export const brushConfigs = {
  pencil: ['color', 'width', 'opacity'],
  pattern: ['color', 'width', 'opacity', 'patternType'],
  spray: ['color', 'width', 'opacity', 'sprayDensity', 'sprayWidth']
};

// Default settings
export const defaultShapeSettings = {
  // Object settings
  width: '',
  height: '',
  diameter: '',
  fill: '',
  stroke: '',
  strokeWidth: '',
  strokeDashArray: 'solid',
  fontSize: '',
  text: '',
  fontFamily: 'Arial',
  opacity: 100,
  
  // Brush settings
  color: '#000000',
  patternType: 'simple',
  sprayDensity: 20,
  sprayWidth: 10,

  shadowColor: '#000000',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
}