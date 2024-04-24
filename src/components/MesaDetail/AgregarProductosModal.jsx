import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/cliente';

const AgregarProductosModal = ({ onClose }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchProductos = async () => {
      try {
        const productosCollectionRef = collection(db, 'productos');
        const productosQuery = query(productosCollectionRef);
        const querySnapshot = await getDocs(productosQuery);

        const productosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombre,
          precio: doc.data().precio
        }));

        setProductos(productosData);
      } catch (error) {
        console.error('Error fetching productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div>
      <h2>Selecciona un producto para agregar:</h2>
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <ul>
          {productos.map(producto => (
            <li key={producto.id}>
              {producto.nombre} - ${producto.precio}
            </li>
          ))}
        </ul>
      )}
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default AgregarProductosModal;
