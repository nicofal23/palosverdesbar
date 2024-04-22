import React, { useState } from "react";

const ProductSearch = ({ onSearch}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        // Llama a la función de búsqueda solo si el término de búsqueda tiene al menos tres caracteres
        if (value.length >= 3 || value === '') {
            onSearch(value.toLowerCase()); // Convertir el término de búsqueda a minúsculas antes de pasar a la función
        }
    }

    return (
        <div>
            <label htmlFor="search">Buscar por nombre: </label>
            <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>
    );
}

export default ProductSearch;
