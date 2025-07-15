# 🔴⚪ PokeDex React - Frontend

Una moderna aplicación web PokeDex construida con React, TypeScript y Vite, conectada a un backend personalizado que utiliza la PokeAPI.

![Pokemon](https://img.shields.io/badge/Pokemon-FFCB05?style=for-the-badge&logo=pokemon&logoColor=3D7DCA)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Características

- 🎨 **Diseño Pokemon temático** con gradientes y animaciones
- 🔍 **Búsqueda avanzada** por nombre o ID de Pokemon
- 📱 **Interfaz responsiva** que se adapta a todos los dispositivos
- 📄 **Paginación inteligente** con navegación por números
- 🖼️ **Múltiples sprites** (frontal, trasero, shiny, artwork oficial)
- 📊 **Información completa** (tipos, habilidades, estadísticas)
- ⚡ **Carga automática** de Pokemon al iniciar
- 🎭 **Animaciones suaves** y efectos hover
- 🌐 **Backend personalizado** con endpoints optimizados
- 💾 **Sistema de caché inteligente** para mejor rendimiento
- 🔥 **Precarga automática** de datos populares
- 📈 **Métricas de caché** en tiempo real (modo desarrollo)

## 🚀 Instalación y Configuración

### Prerrequisitos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Tu backend Pokemon corriendo en `http://localhost:3000`

### 1. Clonar o descargar el proyecto

```bash
# Si tienes git
git clone <tu-repositorio>
cd PokeFront

# O simplemente navega a la carpeta del proyecto
cd path/to/PokeFront
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar el backend

Asegúrate de que tu backend esté corriendo en el puerto 3000. La configuración actual apunta a:

```typescript
// src/config/api.ts
BASE_URL: 'http://localhost:3000'
```

Si tu backend corre en otro puerto, edita el archivo `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:TUPUERTO', // Cambia por tu puerto
  // ...
}
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173** o **http://localhost:5174**

## 🎮 Cómo usar

### Búsqueda de Pokemon
1. **Por nombre:** Escribe "pikachu", "charizard", etc.
2. **Por ID:** Escribe "25", "1", "150", etc.
3. **Presiona Enter** o haz clic en "Buscar Pokemon"

### Navegación por lista
1. **Exploración automática:** Al cargar, aparecen los primeros 20 Pokemon
2. **Navegación por páginas:** Usa los números 1, 2, 3... para cambiar páginas
3. **Selección directa:** Haz clic en cualquier Pokemon de la lista

### Información mostrada
- 🖼️ **Imágenes:** Frontal, trasero, shiny y artwork oficial
- 📏 **Medidas:** Altura y peso del Pokemon
- 🏷️ **Tipos:** Con colores distintivos
- ⚡ **Habilidades:** Normales y ocultas (marcadas en rojo)
- 📊 **Estadísticas:** HP, Attack, Defense, etc.
- 🎯 **Experiencia base** y **movimientos disponibles**

## 🛠️ Scripts disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la construcción

# Linting
npm run lint         # Ejecuta ESLint para revisar el código
```

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes React
│   └── PokemonList.tsx  # Lista con paginación
├── config/             # Configuración
│   └── api.ts          # URLs y endpoints del backend
├── services/           # Servicios HTTP
│   └── pokemonService.ts # Lógica de peticiones a la API
├── assets/             # Recursos estáticos
├── App.tsx             # Componente principal
├── App.css             # Estilos Pokemon
├── index.css           # Estilos globales
└── main.tsx            # Punto de entrada
```

## 🔧 Configuración del Backend

Tu backend debe proporcionar estos endpoints:

### Endpoints requeridos:
```
GET /pokemon/:name     # Buscar Pokemon por nombre o ID
GET /pokemon           # Lista con paginación (?limit=20&offset=0)
```

### Estructura de respuesta esperada:
```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "base_experience": 112,
  "types": ["electric"],
  "abilities": [
    {"name": "static", "is_hidden": false},
    {"name": "lightning-rod", "is_hidden": true}
  ],
  "stats": [
    {"name": "hp", "base_stat": 35},
    {"name": "attack", "base_stat": 55}
  ],
  "sprites": {
    "front_default": "url_imagen",
    "back_default": "url_imagen",
    "front_shiny": "url_imagen",
    "official_artwork": "url_imagen"
  },
  "moves": ["move1", "move2"]
}
```

## 🚀 Sistema de Caché

### Características del Caché

El frontend implementa un sistema de caché de dos niveles para optimizar el rendimiento:

#### 📊 Caché en Memoria
- **Almacenamiento temporal** para respuestas de la API
- **TTL configurable** (por defecto 5 minutos)
- **Límite de entradas** (1000 por defecto)
- **Limpieza automática** cada 30 segundos

#### 💾 Caché en localStorage
- **Persistencia** entre sesiones del navegador
- **Respaldo automático** del caché en memoria
- **Detección de cambios** en la estructura de datos

#### 🔥 Precarga Inteligente
- **Warmup automático** al cargar la aplicación
- **Pokemon populares** precargados (Pikachu, Charizard, etc.)
- **Primera página** de resultados siempre disponible

#### 📈 Métricas en Tiempo Real
En modo desarrollo, puedes ver estadísticas del caché:
- Total de peticiones realizadas
- Hits y misses del caché
- Porcentaje de eficiencia
- Memoria utilizada

### Configuración del Caché

```typescript
// Personalizar TTL (tiempo de vida)
cacheService.set(url, data, 10 * 60 * 1000); // 10 minutos

// Limpiar caché manualmente
pokemonService.clearCache();

// Obtener estadísticas
const stats = pokemonService.getCacheStats();
```

## 🌐 Despliegue

### Para producción:

1. **Construir la aplicación:**
```bash
npm run build
```

2. **Los archivos generados** estarán en la carpeta `dist/`

3. **Subir a tu servidor** web o plataforma de hosting (Vercel, Netlify, etc.)

4. **Actualizar la configuración** del backend en producción:
```typescript
// src/config/api.ts
BASE_URL: 'https://tu-backend-en-produccion.com'
```

## 🎨 Personalización

### Cambiar colores Pokemon:
Edita las variables CSS en `src/index.css`:
```css
:root {
  --pokemon-red: #FF6B6B;
  --pokemon-blue: #4ECDC4;
  --pokemon-yellow: #FFE66D;
  /* ... más colores */
}
```

### Agregar nuevas funcionalidades:
- El servicio `pokemonService.ts` ya incluye métodos para evoluciones y especies
- Puedes expandir fácilmente con más endpoints de tu backend

## 🐛 Solución de problemas

### Error de CORS:
```bash
# Asegúrate de que tu backend permita peticiones desde localhost:5173
# En tu backend Express.js:
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));
```

### Pokemon no aparecen:
1. Verifica que el backend esté corriendo en puerto 3000
2. Revisa la consola del navegador (F12) para errores
3. Comprueba que los endpoints respondan correctamente

### Problemas de instalación:
```bash
# Limpia caché y reinstala
rm -rf node_modules package-lock.json
npm install
```

---

**¡Atrapa todos los Pokemon!** 🔴⚪

Desarrollado por Alejandro CHuy Zhou con ❤️.
