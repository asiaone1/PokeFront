/**
 * Optimizaciones avanzadas para la búsqueda de Pokemon
 */

// Cache de sugerencias para autocompletado
const suggestionCache = new Map<string, string[]>();

/**
 * Función para obtener sugerencias de Pokemon basadas en la entrada del usuario
 * @param input Texto ingresado por el usuario
 * @returns Array de sugerencias
 */
export async function getPokemonSuggestions(input: string): Promise<string[]> {
  if (!input || input.length < 2) return [];
  
  const key = input.toLowerCase();
  
  // Verificar caché de sugerencias
  if (suggestionCache.has(key)) {
    return suggestionCache.get(key) || [];
  }
  
  try {
    // Lista de Pokemon populares para sugerencias rápidas
    const popularPokemon = [
      'pikachu', 'charizard', 'blastoise', 'venusaur', 'alakazam',
      'gengar', 'dragonite', 'mewtwo', 'mew', 'typhlosion',
      'feraligatr', 'meganium', 'lugia', 'ho-oh', 'blaziken',
      'swampert', 'sceptile', 'rayquaza', 'dialga', 'palkia',
      'arceus', 'victini', 'reshiram', 'zekrom', 'kyurem'
    ];
    
    // Filtrar Pokemon que coincidan con la entrada
    const suggestions = popularPokemon
      .filter(pokemon => pokemon.toLowerCase().includes(key))
      .slice(0, 5); // Limitar a 5 sugerencias
    
    // Guardar en caché por 5 minutos
    suggestionCache.set(key, suggestions);
    setTimeout(() => suggestionCache.delete(key), 5 * 60 * 1000);
    
    return suggestions;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
}

/**
 * Función para validar si un ID de Pokemon es válido
 * @param id ID del Pokemon
 * @returns boolean indicando si es válido
 */
export function isValidPokemonId(id: string): boolean {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0 && numId <= 1010; // Generaciones 1-9
}

/**
 * Función para limpiar y formatear la entrada del usuario
 * @param input Entrada del usuario
 * @returns Entrada limpia y formateada
 */
export function cleanPokemonInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '') // Solo letras, números y guiones
    .replace(/\s+/g, '-'); // Espacios a guiones
}

/**
 * Hook para gestionar el historial de búsquedas
 */
export class SearchHistory {
  private static readonly STORAGE_KEY = 'pokemon_search_history';
  private static readonly MAX_HISTORY = 10;

  static getHistory(): string[] {
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  static addToHistory(pokemon: string): void {
    try {
      const history = this.getHistory();
      const cleanName = cleanPokemonInput(pokemon);
      
      // Remover si ya existe
      const filtered = history.filter(item => item !== cleanName);
      
      // Agregar al principio
      filtered.unshift(cleanName);
      
      // Limitar tamaño
      const limited = filtered.slice(0, this.MAX_HISTORY);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limited));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }
}

/**
 * Función para precargar Pokemon relacionados (optimización avanzada)
 * @param pokemonName Nombre del Pokemon actual
 */
export async function preloadRelatedPokemon(pokemonName: string): Promise<void> {
  try {
    // Esta función se puede expandir para precargar evoluciones, tipos similares, etc.
    console.log(`🔄 Preloading related Pokemon for: ${pokemonName}`);
    
    // Ejemplo: precargar Pokemon del mismo tipo (requiere implementación en backend)
    // await pokemonService.getPokemonByType(pokemon.types[0]);
    
  } catch (error) {
    console.log('Preload failed, but continuing:', error);
  }
}

/**
 * Métricas de rendimiento de búsqueda
 */
export class SearchMetrics {
  private static searches = 0;
  private static cacheHits = 0;
  private static averageTime = 0;
  private static searchTimes: number[] = [];

  static startSearch(): number {
    this.searches++;
    return Date.now();
  }

  static endSearch(startTime: number, fromCache = false): void {
    const duration = Date.now() - startTime;
    
    if (fromCache) {
      this.cacheHits++;
    }
    
    this.searchTimes.push(duration);
    if (this.searchTimes.length > 100) {
      this.searchTimes = this.searchTimes.slice(-50); // Mantener últimas 50
    }
    
    this.averageTime = this.searchTimes.reduce((a, b) => a + b, 0) / this.searchTimes.length;
  }

  static getStats() {
    const cacheHitRate = this.searches > 0 ? (this.cacheHits / this.searches) * 100 : 0;
    
    return {
      totalSearches: this.searches,
      cacheHits: this.cacheHits,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      averageSearchTime: Math.round(this.averageTime),
      lastSearchTimes: this.searchTimes.slice(-5)
    };
  }

  static reset(): void {
    this.searches = 0;
    this.cacheHits = 0;
    this.averageTime = 0;
    this.searchTimes = [];
  }
}

// Exponer métricas en desarrollo
if (import.meta.env.DEV) {
  (window as any).searchMetrics = SearchMetrics;
}
