import React, { useState } from "react";
import styles from './ProductSearch.module.css';

const ProductSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Función para manejar el cambio de término de búsqueda
    const handleSearch = (term) => {
        setSearchTerm(term);
        // Pasar el término de búsqueda al componente padre solo si tiene al menos 2 letras
        if (term.length >= 2) {
            onSearch(term);
        } else {
            // Si el término de búsqueda tiene menos de 2 letras, borrar los resultados mostrados
            onSearch('');
        }
    }

    return (
        <div className={styles.searchContainer}>
            <label htmlFor="search" className={styles.label}>Buscar por nombre: </label>
            <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className={styles.input}
            />
            {/* Mostrar un mensaje para indicar que la búsqueda comienza a partir de la segunda letra */}
            {searchTerm.length >= 2 && (
                <p className={styles.infoMessage}>La búsqueda comienza a partir de la segunda letra.</p>
            )}
        </div>
    );
}

export default ProductSearch;

