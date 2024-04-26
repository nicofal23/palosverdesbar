// ItemCount.js
import React, { useState } from 'react';
import styles from './ItemCount.module.css'

const ItemCount = ({ inicial, onAdd }) => {
  const [count, setCount] = useState(inicial);

  const handleAdd = () => {
      setCount(count + 1);
  };

  const handleRemove = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleOnAdd = () => {
    onAdd(count);
  };

  return (
    <div className={styles.conteiner}>
      <div className={styles.conteinerCount}>
          <button onClick={handleRemove} className={styles.button}>-</button>
          <span className={styles.contador}>{count}</span>
          <button onClick={handleAdd} className={styles.button}>+</button>
      </div>
      <div className={styles.continerAgregar}>
        <button onClick={handleOnAdd} className={styles.agregar}>Agregar</button>
      </div>
    </div>
  );
};

export default ItemCount;
