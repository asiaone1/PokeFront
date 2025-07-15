// Utilidades para gestión de caché desde la consola del navegador
import { pokemonService } from '../services/pokemonService';

// Función para exponer utilidades de caché en window (solo en desarrollo)
export const exposeCacheUtils = () => {
  if (import.meta.env.DEV) {
    // Exponer utilidades en window para debugging
    (window as any).pokemonCache = {
      // Obtener estadísticas del caché
      getStats: () => {
        const stats = pokemonService.getCacheStats();
        console.table(stats);
        return stats;
      },
      
      // Limpiar caché
      clear: () => {
        pokemonService.clearCache();
        console.log('🗑️ Cache cleared successfully');
      },
      
      // Precargar caché manualmente
      warmup: async () => {
        console.log('🔥 Starting manual cache warmup...');
        await pokemonService.warmupCache();
        console.log('✅ Manual cache warmup complete');
      },
      
      // Ayuda
      help: () => {
        console.log(`
🎮 Pokemon Cache Utilities
========================

Funciones disponibles:
• pokemonCache.getStats() - Ver estadísticas del caché
• pokemonCache.clear() - Limpiar todo el caché  
• pokemonCache.warmup() - Precargar datos populares
• pokemonCache.help() - Mostrar esta ayuda

Ejemplo de uso:
pokemonCache.getStats()
        `);
      }
    };
    
    console.log('🎮 Pokemon Cache utilities loaded! Type "pokemonCache.help()" for available commands');
  }
};

// Función para mostrar información de rendimiento
export const logPerformanceInfo = () => {
  if (import.meta.env.DEV) {
    const stats = pokemonService.getCacheStats();
    
    console.log(`
📊 Cache Performance Report
==========================
Requests: ${stats.requests}
Cache Hits: ${stats.hits}
Cache Misses: ${stats.misses}
Efficiency: ${stats.efficiency}
Memory Entries: ${stats.memoryItems}
LocalStorage Entries: ${stats.localStorageItems}
Memory Size: ${stats.memorySize}
    `);
  }
};
