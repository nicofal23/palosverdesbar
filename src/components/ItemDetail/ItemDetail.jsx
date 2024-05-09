import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Cambiado a useNavigate
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import styles from './ItemDetail.module.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ItemDetail = () => {
  const { id, categoryId } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Cambiado a useNavigate

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'productos', id));
        if (docSnap.exists()) {
          setProducto(docSnap.data());
        } else {
          console.log('No se encontró el producto');
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();

  }, [id]);

  const handleReturnClick = () => {
    navigate(`/${categoryId}` ); // Navega de regreso a la categoría seleccionada
  };
  
  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : producto ? (
        <div className={styles.detalleContenedor}>
          <IconButton onClick={handleReturnClick} className={styles.botonback}>
                            <ArrowBackIcon style={{ color: '#ae8e4a', fontSize: '36px', fontWeight: 'bold'  }}/>
                        </IconButton>
          <div className={styles.contenedor}>
            <img src={producto.img} alt={producto.nombre} className={styles.imagenProducto} />
          </div>
          <div className={styles.datosContenedor}>
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p className={styles.precio}>Precio: ${producto.precio}</p>
          </div>
        </div>
      ) : (
        <p>No se encontró el producto</p>
      )}
      
    </div>
  );
};

export default ItemDetail;
