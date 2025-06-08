import { filters } from 'fabric'

export const filterTypes = {
  grayscale: {
    name: 'Grayscale',
    filter: filters.Grayscale,
    options: {},
    intensityProperty: 'opacity', 
    defaultValue: 1
  },
  sepia: {
    name: 'Sepia',
    filter: filters.Sepia,
    options: {},
    intensityProperty: 'opacity',
    defaultValue: 1
  },
  invert: {
    name: 'Invert',
    filter: filters.Invert,
    options: {},
    intensityProperty: 'opacity',
    defaultValue: 1
  },
  blur: {
    name: 'Blur',
    filter: filters.Blur,
    options: {},
    intensityProperty: 'blur',
    defaultValue: 0.2,
    maxValue: 1.0
  },
  brightness: {
    name: 'Brightness',
    filter: filters.Brightness,
    options: {},
    intensityProperty: 'brightness',
    defaultValue: 0.1,
    minValue: -1,
    maxValue: 1
  },
  contrast: {
    name: 'Contrast',
    filter: filters.Contrast,
    options: {},
    intensityProperty: 'contrast',
    defaultValue: 0.1,
    minValue: -1,
    maxValue: 1
  },
  saturation: {
    name: 'Saturation',
    filter: filters.Saturation,
    options: {},
    intensityProperty: 'saturation',
    defaultValue: 0.1,
    minValue: -1,
    maxValue: 1
  },
  noise: {
    name: 'Noise',
    filter: filters.Noise,
    options: {},
    intensityProperty: 'noise',
    defaultValue: 25,
    maxValue: 100
  },
  pixelate: {
    name: 'Pixelate',
    filter: filters.Pixelate,
    options: {},
    intensityProperty: 'blocksize',
    defaultValue: 4,
    minValue: 2,
    maxValue: 20
  },
  sharpen: {
    name: 'Sharpen',
    filter: filters.Convolute,
    options: {
      matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0]
    },
    intensityProperty: 'opacityRate',
    defaultValue: 1
  }
};

// Apply filter to image
export const applyFilter = (imageObj, filterType, intensity) => {
  if (!imageObj || !filterTypes[filterType]) return false
  
  const config = filterTypes[filterType]
  const filter = new config.filter(config.options)
  
  // Set the intensity based on the filter's intensity property
  filter[config.intensityProperty] = intensity
  
  // Store filter info for tracking
  filter.filterType = filterType
  
  // Add the filter to the image
  imageObj.filters.push(filter)
  imageObj.applyFilters()
  
  return true
}

// Remove specific filter from image
export const removeFilter = (imageObj, filterType) => {
  if (!imageObj || !imageObj.filters) return false
  
  const filterIndex = imageObj.filters.findIndex(filter => filter.filterType === filterType)
  
  if (filterIndex >= 0) {
    imageObj.filters.splice(filterIndex, 1)
    imageObj.applyFilters()
    return true
  }
  
  return false
}

// Update filter intensity
export const updateFilterIntensity = (imageObj, filterType, intensity) => {
  if (!imageObj || !imageObj.filters) return false
  
  const filter = imageObj.filters.find(filter => filter.filterType === filterType)
  
  if (filter) {
    const config = filterTypes[filterType]
    filter[config.intensityProperty] = intensity
    imageObj.applyFilters()
    return true
  }
  
  return false
}

// Remove all filters
export const clearAllFilters = (imageObj) => {
  if (!imageObj) return false
  
  imageObj.filters = []
  imageObj.applyFilters()
  
  return true
}

// Check if an object is an image
export const isImage = (obj) => {
  return obj && (obj.type === 'image')
}