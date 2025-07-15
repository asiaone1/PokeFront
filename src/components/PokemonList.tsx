import { useState, useEffect } from 'react'
import { pokemonService } from '../services/pokemonService'
import type { PokemonListItem } from '../services/pokemonService'

interface PokemonListProps {
  onSelectPokemon: (pokemonName: string) => void
}

export function PokemonList({ onSelectPokemon }: PokemonListProps) {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const loadPokemonList = async (page = 1) => {
    setLoading(true)
    try {
      const limit = 20
      const offset = (page - 1) * limit
      const response = await pokemonService.getPokemonList(limit, offset)
      
      setPokemonList(response.results)
      setCurrentPage(page)
      setTotalCount(response.count)
      setTotalPages(Math.ceil(response.count / limit))
      
    } catch (error) {
      console.error('Error cargando lista de Pokemon:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar la primera página automáticamente
  useEffect(() => {
    loadPokemonList(1)
  }, [])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadPokemonList(page)
    }
  }

  const getPaginationNumbers = () => {
    const delta = 2 // Mostrar 2 páginas a cada lado de la actual
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages)
      }
    }

    return rangeWithDots
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ color: '#2C3E50', textAlign: 'center' }}>
        Lista de Pokemon {totalCount > 0 && `(${totalCount} total)`}
      </h3>
      
      {loading && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <p style={{ color: '#4ECDC4', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Cargando Pokemon...
          </p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
        opacity: loading ? 0.5 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        {pokemonList.map((pokemon, index) => (
          <div
            key={`${pokemon.id}-${index}`}
            onClick={() => onSelectPokemon(pokemon.name)}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid transparent',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.borderColor = '#4ECDC4'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            {pokemon.sprite && (
              <img 
                src={pokemon.official_artwork || pokemon.sprite}
                alt={pokemon.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                  marginBottom: '0.5rem'
                }}
              />
            )}
            <h4 style={{ 
              margin: '0.5rem 0', 
              color: '#2C3E50', 
              textTransform: 'capitalize',
              fontSize: '1rem'
            }}>
              #{pokemon.id} {pokemon.name}
            </h4>
            <div>
              {pokemon.types.map((type, typeIndex) => (
                <span
                  key={typeIndex}
                  style={{
                    background: '#4ECDC4',
                    color: 'white',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    margin: '0 0.2rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sistema de paginación */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* Botón anterior */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              background: currentPage === 1 ? '#95a5a6' : 'linear-gradient(45deg, #4ECDC4, #95E1D3)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          >
            ←
          </button>

          {/* Números de página */}
          {getPaginationNumbers().map((pageNum, index) => (
            <button
              key={index}
              onClick={() => typeof pageNum === 'number' ? goToPage(pageNum) : null}
              disabled={pageNum === '...' || loading}
              style={{
                background: pageNum === currentPage 
                  ? 'linear-gradient(45deg, #FF6B6B, #FFE66D)'
                  : pageNum === '...' 
                    ? 'transparent'
                    : 'linear-gradient(45deg, #4ECDC4, #95E1D3)',
                color: pageNum === '...' ? '#666' : 'white',
                border: pageNum === '...' ? 'none' : '2px solid transparent',
                padding: '0.5rem 0.8rem',
                borderRadius: '8px',
                cursor: pageNum === '...' || loading ? 'default' : 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                minWidth: '40px',
                transition: 'all 0.3s ease',
                boxShadow: pageNum === currentPage ? '0 4px 15px rgba(255, 107, 107, 0.3)' : 'none'
              }}
            >
              {pageNum}
            </button>
          ))}

          {/* Botón siguiente */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              background: currentPage === totalPages ? '#95a5a6' : 'linear-gradient(45deg, #4ECDC4, #95E1D3)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          >
            →
          </button>
        </div>
      )}

      {/* Información de la página actual */}
      {totalPages > 1 && (
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          Página {currentPage} de {totalPages}
        </div>
      )}
    </div>
  )
}
