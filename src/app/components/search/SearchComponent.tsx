import React, { useState } from 'react';
import { useSearch } from '../services/search/SearchService'; // Asegúrate de importar correctamente
import { Product } from '../../models/product.model'; // Correcta la importación del tipo 'Product'
import './SearchComponent.scss';

const SearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Se mantiene la gestión del estado
  const { products, categories, loading } = useSearch(searchQuery); // Desestructuración correcta desde useSearch

  const openElement = (product: Product): void => {
    console.log('Abriendo producto:', product);
    // Aquí se implementa la lógica para abrir los detalles del producto
  };

  return (
    <div className="search-component">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Correcto manejo de evento para el cambio de texto
        placeholder="Buscar productos..."
      />
      <button onClick={() => {}} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {Array.isArray(products) && products.length > 0 && (
        <div>
          <h3>Resultados de productos:</h3>
          <ul>
            {products.map((product: Product) => (
              <li key={product.id}>
                <span>{product.name}</span>
                <button onClick={() => openElement(product)}>Abrir</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(categories) && categories.length > 0 && (
        <div>
          <h3>Resultados de categorías:</h3>
          <ul>
            {categories.map((category: { id: string; name: string }) => (
              <li key={category.id}>
                <span>{category.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
