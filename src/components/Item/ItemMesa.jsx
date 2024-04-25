import React from 'react';
import styles from './Item.module.css';
import ItemCount from '../ItemCount/ItemCount';

const ItemMesa = ({ id, nombre, precio, stock, cantidad, onAddToCart }) => {
  const handleAddToCart = () => {
    if (cantidad > 0) {
        onAddToCart({ id, nombre, precio, cantidad }); // Pasar id, nombre, precio y cantidad
    } else {
        console.error('La cantidad seleccionada no es válida');
    }
};
      
    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <h3 className={styles.nombre}>{nombre}</h3>
                <p className={styles.precio}>Precio: ${precio}</p>
                <div className={styles.row}>
                    <label htmlFor={`cantidad_${id}`}>Cantidad:</label>
                    <ItemCount stock={stock} inicial={1} onAdd={handleAddToCart} />
                </div>
            </div>
        </div>
    );
};

export default ItemMesa;
