import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import styles from './ItemDetail.module.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'; // Importa el componente LoadingSpinner

const ItemDetail = () => {
  const { id } = useParams(); // Obtener el ID del parámetro de la URL
  const [producto, setProducto] = useState(null); // Estado para almacenar el producto
  const [loading, setLoading] = useState(true); // Estado para controlar si se está cargando

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        // Obtener el documento del producto de Firebase Firestore usando el ID
        const docSnap = await getDoc(doc(db, 'productos', id));
        if (docSnap.exists()) {
          // Si el documento existe, establecer el estado del producto
          setProducto(docSnap.data());
        } else {
          console.log('No se encontró el producto');
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      } finally {
        setLoading(false); // Cuando termina la carga, establece loading en false
      }
    };

    fetchProducto(); // Llamar a la función para cargar el producto cuando el componente se monte

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Ejecutar el efecto cada vez que cambie el ID en la URL

  return (
    <div>
      <h2 className={styles.detalleTitulo}>Detalles del producto</h2>
      {loading ? ( // Si está cargando, muestra el spinner
        <LoadingSpinner />
      ) : producto ? ( // Si el producto existe, muestra los detalles
        <div className={styles.detalleContenedor}>
          <div className={styles.contenedor}>
            <img src={producto.img} alt={producto.nombre} className={styles.imagenProducto} />
          </div>
          <div className={styles.datosContenedor}>
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            {/* Agregar más detalles del producto aquí según sea necesario */}
          </div>
        </div>
      ) : (
        <p>No se encontró el producto</p>
      )}
    </div>
  );
};

export default ItemDetail;
