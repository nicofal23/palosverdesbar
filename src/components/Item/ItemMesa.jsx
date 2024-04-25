// Item.jsx
import React, { useState } from 'react';
import styles from './Item.module.css';

const ItemMesa = ({ id, nombre, img, precio, stock, descripcion, onAddToCart }) => {
    const [cantidad, setCantidad] = useState(1); // Estado para la cantidad seleccionada

    // Función para manejar el cambio en la cantidad seleccionada
    const handleChangeCantidad = (event) => {
        setCantidad(parseInt(event.target.value));
    };

    // Función para agregar el producto a la mesa
    const handleAddToCart = () => {
        onAddToCart({ id, nombre, precio, cantidad }); // Llama a la función onAddToCart con los detalles del producto
    };

    return (
        <div className={styles.card}>
            
            <div className={styles.info}>
                <h3 className={styles.nombre}>{nombre}</h3>
                <p className={styles.precio}>Precio: ${precio}</p>
                <div className={styles.row}>
                    <label htmlFor={`cantidad_${id}`}>Cantidad:</label>
                    <input
                        type="number"
                        id={`cantidad_${id}`}
                        value={cantidad}
                        min="1"
                        max={stock}
                        onChange={handleChangeCantidad}
                        className={styles.inputCantidad}
                    />
                </div>
                <button onClick={handleAddToCart} className={styles.botonAgregar}>
                    Agregar a mesa
                </button>
            </div>
        </div>
    );
};

export default ItemMesa;
