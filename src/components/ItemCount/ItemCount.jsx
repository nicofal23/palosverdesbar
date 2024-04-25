// ItemCount.js
import React, { useState } from 'react';

const ItemCount = ({ stock, inicial, onAdd }) => {
  const [count, setCount] = useState(inicial);

  const handleAdd = () => {
    if (count < stock) {
      setCount(count + 1);
    }
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
    <div>
      <button onClick={handleRemove}>-</button>
      <span>{count}</span>
      <button onClick={handleAdd}>+</button>
      <button onClick={handleOnAdd}>Agregar al carrito</button>
    </div>
  );
};

export default ItemCount;
