import React from "react";

const SelectCategory = ({ value, onChange }) => {
    return (
        <div>
            <label htmlFor="categoria">Filtrar por categoría: </label>
            <select id="categoria" value={value} onChange={onChange}>
                <option value="">Todos</option>
                <option value="restaurant">Restaurant</option>
                <option value="cafeteria">Cafetería</option>
                <option value="cocktails">Cocktails</option>
                <option value="vinos">Vinos</option>
            </select>
        </div>
    );
}

export default SelectCategory;
