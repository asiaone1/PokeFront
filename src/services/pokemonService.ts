import { API_CONFIG, buildApiUrl } from '../config/api'
import { cacheService } from './cacheService'

// Interfaz para los datos del Pokemon desde tu backend
export interface PokemonData {
  id: number
  name: string
  height: number
  weight: number
  base_experience?: number
  types: string[] // Tu backend devuelve array de strings
  abilities: Array<{
    name: string
    is_hidden: boolean
  }>
  stats: Array<{
    name: string
    base_stat: number
  }>
  sprites: {
    front_default: string
    front_shiny?: string
    back_default?: string
    back_shiny?: string
    official_artwork?: string
  }
  moves?: string[] // Movimientos como array de strings
}

// Interfaz para la lista de Pokemon
export interface PokemonListItem {
  id: number
  name: string
  types: string[]
  sprite: string
  official_artwork?: string
}

class PokemonService {
  private async makeRequest<T>(url: string): Promise<T> {
    try {
      // Verificar caché primero
      const cachedData = cacheService.get(url);
      if (cachedData) {
        console.log(`🎯 Cache hit for: ${url}`);
        return cachedData as T;
      }

      console.log(`🌐 Making request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar headers adicionales si tu backend los requiere
          // 'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Guardar en caché con TTL de 5 minutos
      cacheService.set(url, data, 5 * 60 * 1000);
      console.log(`💾 Cached data for: ${url}`);

      return data
    } catch (error) {
      console.error('Error en la petición:', error)
      throw error
    }
  }

  // Buscar Pokemon por nombre o ID 
  async getPokemonByName(name: string): Promise<PokemonData> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.POKEMON_BY_NAME, { name: name.toLowerCase() })
    return this.makeRequest<PokemonData>(url)
  }

  // Buscar Pokemon por ID (usa el mismo endpoint que por nombre)
  async getPokemonById(id: number): Promise<PokemonData> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.POKEMON_BY_NAME, { name: id.toString() })
    return this.makeRequest<PokemonData>(url)
  }

  // Obtener lista de Pokemon (endpoint principal)
  async getPokemonList(limit = 20, offset = 0): Promise<{ 
    count: number
    next: string | null
    previous: string | null
    results: PokemonListItem[] 
  }> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}?limit=${limit}&offset=${offset}`
    return this.makeRequest(url)
  }

  // Buscar Pokemon (puede ser por nombre o ID)
  async searchPokemon(query: string): Promise<PokemonData> {
    // Backend maneja tanto nombres como IDs en el mismo endpoint
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.POKEMON_BY_NAME, { name: query.toLowerCase() })
    return this.makeRequest<PokemonData>(url)
  }

  // Método para precargar datos importantes
  async warmupCache(): Promise<void> {
    try {
      console.log('🔥 Warming up cache with popular Pokemon...');
      
      // Precargar la primera página de Pokemon
      await this.getPokemonList(1, 20);
      
      // Precargar algunos Pokemon populares
      const popularPokemon = ['pikachu', 'charizard', 'blastoise', 'venusaur'];
      
      const warmupPromises = popularPokemon.map(async (pokemonName) => {
        try {
          await this.searchPokemon(pokemonName);
        } catch (error) {
          console.log(`Could not preload ${pokemonName}:`, error);
        }
      });
      
      await Promise.all(warmupPromises);
      console.log('✅ Cache warmup complete!');
    } catch (error) {
      console.log('Cache warmup failed:', error);
    }
  }

  // Método para obtener estadísticas de caché
  getCacheStats() {
    return cacheService.getStats();
  }

  // Método para limpiar caché
  clearCache() {
    cacheService.clear();
  }

  // Nuevos métodos específicos de tu backend
  
  // Obtener información de la especie
  async getPokemonSpecies(name: string): Promise<any> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.POKEMON_SPECIES, { name: name.toLowerCase() })
    return this.makeRequest(url)
  }

  // Obtener cadena evolutiva
  async getPokemonEvolution(name: string): Promise<any> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.POKEMON_EVOLUTION, { name: name.toLowerCase() })
    return this.makeRequest(url)
  }

  // Buscar Pokemon por tipo
  async getPokemonByType(type: string, limit = 20): Promise<any> {
    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.SEARCH_BY_TYPE, { type: type.toLowerCase() })}?limit=${limit}`
    return this.makeRequest(url)
  }
}

export const pokemonService = new PokemonService()
