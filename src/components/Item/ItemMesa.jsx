// ItemMesa.js
import React from 'react';
import styles from './ItemMesa.module.css';
import ItemCount from '../ItemCount/ItemCount';

const ItemMesa = ({ id, nombre, precio, stock, onAddToCart }) => {
    const handleAddToCart = (cantidadSeleccionada) => {
            onAddToCart({ id, nombre, precio }, cantidadSeleccionada); // Eliminando la propiedad cantidad
        };
    
    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <h3 className={styles.nombre}>{nombre}</h3>
                <p className={styles.precio}>Precio: ${precio}</p>
                <div className={styles.row}>
                    <label>Cantidad:</label>
                    <ItemCount stock={stock} inicial={1} onAdd={(cantidad) => handleAddToCart(cantidad)} />
                </div>
            </div>
        </div>
    );
};

export default ItemMesa;

