/**
 * Hook personalizado para debouncing - Evita múltiples llamadas innecesarias
 * @param callback Función a ejecutar después del delay
 * @param delay Tiempo de espera en milisegundos (recomendado: 500-800ms)
 * @returns Función debounced y función de cancelación
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debouncedFunction = ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  }) as T;

  // Agregar función de cancelación
  (debouncedFunction as any).cancel = () => {
    clearTimeout(timeoutId);
  };

  return debouncedFunction as T & { cancel: () => void };
}

/**
 * Función de debouncing simple para usar en componentes de clase o funciones
 * @param func Función a ejecutar
 * @param delay Tiempo de espera en milisegundos
 * @returns Función debounced
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Función de throttling - Limita la frecuencia de ejecución
 * @param func Función a ejecutar
 * @param delay Tiempo mínimo entre ejecuciones
 * @returns Función throttled
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}
