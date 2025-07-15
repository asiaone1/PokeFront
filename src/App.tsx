import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { pokemonService } from './services/pokemonService'
import type { PokemonData } from './services/pokemonService'
import { PokemonList } from './components/PokemonList'

function App() {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pokemonDetailsRef = useRef<HTMLDivElement>(null)

  // Inicializar caché al cargar la aplicación
  useEffect(() => {
    const initializeCache = async () => {
      try {
        await pokemonService.warmupCache();
        console.log('🚀 App initialized with cache warmup');
      } catch (error) {
        console.log('Cache warmup failed, but app will continue:', error);
      }
    };

    initializeCache();
  }, []);

  const searchPokemon = async (query?: string) => {
    const searchQuery = query || searchTerm.trim()
    console.log('Buscando Pokemon:', searchQuery) // Debug
    if (!searchQuery) return

    setLoading(true)
    setError('')
    
    try {
      const pokemonData = await pokemonService.searchPokemon(searchQuery)
      console.log('Pokemon encontrado:', pokemonData) // Debug
      setPokemon(pokemonData)
      setSearchTerm(searchQuery) // Actualizar el input con la búsqueda exitosa
      
      // Scroll automático a los detalles del Pokemon
      setTimeout(() => {
        pokemonDetailsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }, 100)
      
    } catch (err) {
      console.error('Error buscando Pokemon:', err)
      setError('Pokemon no encontrado. Verifica que tu backend esté funcionando y que el Pokemon exista.')
      setPokemon(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePokemonSelect = (pokemonName: string) => {
    console.log('Pokemon seleccionado:', pokemonName) // Debug
    searchPokemon(pokemonName)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPokemon()
    }
  }

  const handleSearchClick = () => {
    searchPokemon()
  }

  return (
    <>
      {/* <div>
        <a href="https://pokeapi.co" target="_blank">
          <img src={viteLogo} className="pokeball-logo" alt="Pokeball logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="pokemon-logo" alt="React logo" />
        </a>
      </div> */}
      
      <h1 className="pokemon-title">PokeDex React+Vite+ExpressJs</h1>
      
      <div className="pokemon-card">
        <input
          type="text"
          placeholder="Busca un Pokemon (ej: pikachu, charizard...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pokemon-search"
        />
        
        <button onClick={handleSearchClick} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar Pokemon'}
        </button>
        
        {error && (
          <p style={{ color: '#e74c3c', fontWeight: 'bold', marginTop: '1rem' }}>
            {error}
          </p>
        )}
        
        <p className="pokemon-info">
          Escribe el nombre o ID de un Pokemon y presiona Enter o haz clic en "Buscar Pokemon"
          <br />
          <small>Conectado a tu backend Pokemon API</small>
        </p>
      </div>

      {/* Detalles del Pokemon seleccionado - Aparece arriba */}
      {pokemon && (
        <div ref={pokemonDetailsRef} className="pokemon-card" style={{ marginTop: '2rem', border: '3px solid #FF6B6B' }}>
          <h2 style={{ color: '#2C3E50', textTransform: 'capitalize' }}>
            {pokemon.name} (#{pokemon.id})
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <img 
              src={pokemon.sprites.official_artwork || pokemon.sprites.front_default} 
              alt={`${pokemon.name} frontal`}
              style={{ 
                width: '200px', 
                height: '200px',
                background: 'radial-gradient(circle, #f0f0f0 0%, #e0e0e0 100%)',
                borderRadius: '15px',
                border: '4px solid #4ECDC4',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                objectFit: 'contain'
              }}
            />
            {pokemon.sprites.back_default && (
              <img 
                src={pokemon.sprites.back_default} 
                alt={`${pokemon.name} trasero`}
                style={{ 
                  width: '150px', 
                  height: '150px',
                  background: 'radial-gradient(circle, #f0f0f0 0%, #e0e0e0 100%)',
                  borderRadius: '15px',
                  border: '4px solid #FF6B6B',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  objectFit: 'contain'
                }}
              />
            )}
            {pokemon.sprites.front_shiny && (
              <img 
                src={pokemon.sprites.front_shiny} 
                alt={`${pokemon.name} shiny`}
                style={{ 
                  width: '150px', 
                  height: '150px',
                  background: 'radial-gradient(circle, #fff700 0%, #ffed4e 100%)',
                  borderRadius: '15px',
                  border: '4px solid #FFE66D',
                  boxShadow: '0 8px 25px rgba(255, 230, 109, 0.4)',
                  objectFit: 'contain'
                }}
                title="Versión Shiny"
              />
            )}
          </div>

          {/* Información básica */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
            {pokemon.height && (
              <div style={{ textAlign: 'center' }}>
                <strong>Altura</strong>
                <br />
                {pokemon.height / 10} m
              </div>
            )}
            {pokemon.weight && (
              <div style={{ textAlign: 'center' }}>
                <strong>Peso</strong>
                <br />
                {pokemon.weight / 10} kg
              </div>
            )}
          </div>

          {/* Tipos */}
          <div style={{ marginBottom: '1rem' }}>
            <strong>Tipos: </strong>
            {pokemon.types.map((type, index) => (
              <span 
                key={index}
                style={{ 
                  background: '#4ECDC4',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  margin: '0 0.5rem',
                  textTransform: 'capitalize',
                  fontWeight: 'bold'
                }}
              >
                {type}
              </span>
            ))}
          </div>

          {/* Habilidades */}
          {pokemon.abilities && pokemon.abilities.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Habilidades: </strong>
              {pokemon.abilities.map((ability, index) => (
                <span 
                  key={index}
                  style={{ 
                    background: ability.is_hidden ? '#E74C3C' : '#95E1D3',
                    color: ability.is_hidden ? 'white' : '#2C3E50',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '15px',
                    margin: '0 0.3rem',
                    textTransform: 'capitalize',
                    fontWeight: 'bold'
                  }}
                  title={ability.is_hidden ? 'Habilidad oculta' : 'Habilidad normal'}
                >
                  {ability.name} {ability.is_hidden && '(Oculta)'}
                </span>
              ))}
            </div>
          )}

          {/* Estadísticas */}
          {pokemon.stats && pokemon.stats.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <strong>Estadísticas Base:</strong>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}>
                {pokemon.stats.map((stat, index) => (
                  <div 
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ textTransform: 'capitalize', fontSize: '0.9rem' }}>
                      {stat.name.replace('-', ' ')}
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#FF6B6B' }}>
                      {stat.base_stat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-around', fontSize: '0.9rem' }}>
            {pokemon.base_experience && (
              <div style={{ textAlign: 'center' }}>
                <strong>Exp. Base</strong>
                <br />
                {pokemon.base_experience}
              </div>
            )}
            {pokemon.moves && pokemon.moves.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <strong>Movimientos</strong>
                <br />
                {pokemon.moves.length} disponibles
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de Pokemon - Aparece debajo de los detalles */}
      <PokemonList onSelectPokemon={handlePokemonSelect} />
      
      <p className="pokemon-footer">
        ¡Atrapa todos los Pokemon! 🔴⚪
      </p>
    </>
  )
}

export default App
