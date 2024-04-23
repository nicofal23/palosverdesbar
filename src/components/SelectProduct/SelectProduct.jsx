import React from "react";
import styles from '../SelectProduct/SelectCategory.module.css'

const SelectCategory = ({ value, onChange }) => {
    return (
        <div className={styles.Select}>
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
