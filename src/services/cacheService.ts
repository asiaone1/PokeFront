// Servicio de caché para mejorar la experiencia del usuario
export interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

export class CacheService {
  private memoryCache = new Map<string, CacheItem<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutos en memoria
  private readonly LOCALSTORAGE_TTL = 30 * 60 * 1000 // 30 minutos en localStorage
  private readonly MAX_MEMORY_ITEMS = 100

  // Métricas de rendimiento
  private stats = {
    hits: 0,
    misses: 0,
    requests: 0
  }

  // Limpiar caché expirado automáticamente
  constructor() {
    this.startCleanupInterval()
  }

  /**
   * Obtener datos del caché (memoria primero, luego localStorage)
   */
  get<T>(key: string): T | null {
    this.stats.requests++

    // Intentar obtener de memoria primero (más rápido)
    const memoryItem = this.memoryCache.get(key)
    if (memoryItem && !this.isExpired(memoryItem)) {
      this.stats.hits++
      console.log(`📦 Cache HIT (memoria): ${key}`)
      return memoryItem.data
    }

    // Si no está en memoria, intentar localStorage
    const localStorageItem = this.getFromLocalStorage<T>(key)
    if (localStorageItem) {
      this.stats.hits++
      console.log(`💾 Cache HIT (localStorage): ${key}`)
      // Mover a memoria para acceso más rápido
      this.setInMemory(key, localStorageItem, this.DEFAULT_TTL)
      return localStorageItem
    }

    this.stats.misses++
    console.log(`❌ Cache MISS: ${key}`)
    return null
  }

  /**
   * Guardar datos en caché (memoria y localStorage)
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const memoryTTL = ttl || this.DEFAULT_TTL
    const localStorageTTL = ttl || this.LOCALSTORAGE_TTL

    // Guardar en memoria
    this.setInMemory(key, data, memoryTTL)

    // Guardar en localStorage para persistencia
    this.setInLocalStorage(key, data, localStorageTTL)

    console.log(`💾 Cached: ${key} (TTL: ${memoryTTL}ms)`)
  }

  /**
   * Guardar en memoria con límite de elementos
   */
  private setInMemory<T>(key: string, data: T, ttl: number): void {
    // Si llegamos al límite, eliminar el más antiguo
    if (this.memoryCache.size >= this.MAX_MEMORY_ITEMS) {
      const firstKey = this.memoryCache.keys().next().value
      if (firstKey) {
        this.memoryCache.delete(firstKey)
      }
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    }

    this.memoryCache.set(key, item)
  }

  /**
   * Guardar en localStorage
   */
  private setInLocalStorage<T>(key: string, data: T, ttl: number): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl
      }

      localStorage.setItem(`pokemon_cache_${key}`, JSON.stringify(item))
    } catch (error) {
      console.warn('Error guardando en localStorage:', error)
      // Si localStorage está lleno, limpiar caché viejo
      this.clearExpiredLocalStorage()
    }
  }

  /**
   * Obtener de localStorage
   */
  private getFromLocalStorage<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(`pokemon_cache_${key}`)
      if (!stored) return null

      const item: CacheItem<T> = JSON.parse(stored)
      if (this.isExpired(item)) {
        localStorage.removeItem(`pokemon_cache_${key}`)
        return null
      }

      return item.data
    } catch (error) {
      console.warn('Error leyendo localStorage:', error)
      return null
    }
  }

  /**
   * Verificar si un elemento ha expirado
   */
  private isExpired<T>(item: CacheItem<T>): boolean {
    return Date.now() > item.expiresAt
  }

  /**
   * Limpiar elementos expirados de memoria
   */
  private cleanupMemoryCache(): void {
    const expired: string[] = []
    
    this.memoryCache.forEach((item, key) => {
      if (this.isExpired(item)) {
        expired.push(key)
      }
    })

    expired.forEach(key => {
      this.memoryCache.delete(key)
    })

    if (expired.length > 0) {
      console.log(`🧹 Limpiados ${expired.length} elementos expirados de memoria`)
    }
  }

  /**
   * Limpiar elementos expirados de localStorage
   */
  private clearExpiredLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage)
      const pokemonKeys = keys.filter(key => key.startsWith('pokemon_cache_'))
      let cleaned = 0

      pokemonKeys.forEach(key => {
        try {
          const stored = localStorage.getItem(key)
          if (stored) {
            const item: CacheItem<any> = JSON.parse(stored)
            if (this.isExpired(item)) {
              localStorage.removeItem(key)
              cleaned++
            }
          }
        } catch (error) {
          // Si hay error parseando, eliminar
          localStorage.removeItem(key)
          cleaned++
        }
      })

      if (cleaned > 0) {
        console.log(`🧹 Limpiados ${cleaned} elementos expirados de localStorage`)
      }
    } catch (error) {
      console.warn('Error limpiando localStorage:', error)
    }
  }

  /**
   * Iniciar limpieza automática cada 5 minutos
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupMemoryCache()
      this.clearExpiredLocalStorage()
    }, 5 * 60 * 1000) // 5 minutos
  }

  /**
   * Invalidar caché por clave o patrón
   */
  invalidate(keyOrPattern: string): void {
    // Limpiar de memoria
    if (keyOrPattern.includes('*')) {
      // Patrón con wildcard
      const pattern = keyOrPattern.replace('*', '')
      const keysToDelete: string[] = []
      
      this.memoryCache.forEach((_, key) => {
        if (key.includes(pattern)) {
          keysToDelete.push(key)
        }
      })
      
      keysToDelete.forEach(key => {
        this.memoryCache.delete(key)
      })
    } else {
      // Clave específica
      this.memoryCache.delete(keyOrPattern)
    }

    // Limpiar de localStorage
    try {
      if (keyOrPattern.includes('*')) {
        const pattern = keyOrPattern.replace('*', '')
        const keys = Object.keys(localStorage)
        const keysToDelete = keys.filter(key => 
          key.startsWith('pokemon_cache_') && key.includes(pattern)
        )
        
        keysToDelete.forEach(key => {
          localStorage.removeItem(key)
        })
      } else {
        localStorage.removeItem(`pokemon_cache_${keyOrPattern}`)
      }
    } catch (error) {
      console.warn('Error invalidando localStorage:', error)
    }

    console.log(`🗑️ Cache invalidado: ${keyOrPattern}`)
  }

  /**
   * Limpiar todo el caché
   */
  clear(): void {
    this.memoryCache.clear()
    
    try {
      const keys = Object.keys(localStorage)
      const pokemonKeys = keys.filter(key => key.startsWith('pokemon_cache_'))
      pokemonKeys.forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.warn('Error limpiando localStorage:', error)
    }

    // Resetear estadísticas
    this.stats = {
      hits: 0,
      misses: 0,
      requests: 0
    }

    console.log('🧹 Cache completamente limpiado')
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats(): {
    memoryItems: number
    localStorageItems: number
    memorySize: string
    hits: number
    misses: number
    requests: number
    efficiency: string
  } {
    let localStorageItems = 0
    try {
      const keys = Object.keys(localStorage)
      localStorageItems = keys.filter(key => key.startsWith('pokemon_cache_')).length
    } catch (error) {
      localStorageItems = 0
    }

    const efficiency = this.stats.requests > 0 
      ? ((this.stats.hits / this.stats.requests) * 100).toFixed(1)
      : '0'

    return {
      memoryItems: this.memoryCache.size,
      localStorageItems,
      memorySize: `${Math.round(this.memoryCache.size * 0.1)}KB`, // Estimación
      hits: this.stats.hits,
      misses: this.stats.misses,
      requests: this.stats.requests,
      efficiency: `${efficiency}%`
    }
  }

  /**
   * Precargar datos importantes
   */
  async warmup(warmupData: Array<{ key: string; data: any }>) {
    console.log('🔥 Iniciando precarga de caché...')
    
    warmupData.forEach(({ key, data }) => {
      this.set(key, data, this.LOCALSTORAGE_TTL)
    })

    console.log(`🔥 Precarga completada: ${warmupData.length} elementos`)
  }
}

// Instancia singleton del caché
export const cacheService = new CacheService()
