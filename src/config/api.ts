// Configuración de la API
export const API_CONFIG = {
  // URL de tu backend
  BASE_URL: 'http://localhost:3000',
  
  ENDPOINTS: {
    POKEMON: '/pokemon',
    POKEMON_BY_NAME: '/pokemon/:name',
    POKEMON_SPECIES: '/pokemon/:name/species',
    POKEMON_EVOLUTION: '/pokemon/:name/evolution',
    TYPES: '/types',
    TYPE_INFO: '/type/:name',
    SEARCH_BY_TYPE: '/search/type/:type',
    GENERATIONS: '/generations',
    GENERATION_INFO: '/generation/:id'
  }
}

// Función helper para construir URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number>) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value))
    })
  }
  
  return url
}
