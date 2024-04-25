import React, { useState, useEffect } from 'react';
import { getDocs, collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import style from '../ItemListCointainer/ItemListContainer.module.css';
import ProductSearch from '../ProductSearch/ProductSearch';
import ItemMesa from '../Item/ItemMesa';

const ItemListMesa = ({ greeting, mesaId }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);

    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProductos(productosData);
      } catch (error) {
        console.error('Error fetching productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Función para manejar el cambio de término de búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
  }

  // Función para filtrar productos por nombre
  const filtrarProductos = () => {
    if (!searchTerm) {
      return productos;
    }
    return productos.filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const addToMesa = async (producto) => {
    try {
        const mesaRef = doc(db, 'mesas', mesaId);
        const mesaSnapshotPromise = getDoc(mesaRef); // Removed await here
        const productoExistenteIndexPromise = mesaSnapshotPromise.then(mesaSnapshot => {
            const mesaData = mesaSnapshot.data();
            return mesaData.productos.findIndex(item => item.id === producto.id);
        }); // Removed await here
        
        const [mesaSnapshot, productoExistenteIndex] = await Promise.all([mesaSnapshotPromise, productoExistenteIndexPromise]);

        const mesaData = mesaSnapshot.data();
        
        if (productoExistenteIndex !== -1) {
            const productosActualizados = [...mesaData.productos];
            const productoExistente = productosActualizados[productoExistenteIndex];
            
            // Agregar la cantidad seleccionada al objeto del producto
            productoExistente.cantidad = producto.cantidad;
            
            // Actualizar el producto en la lista de productos
            productosActualizados[productoExistenteIndex] = productoExistente;

            updateDoc(mesaRef, { productos: productosActualizados }); // Removed await here
        } else {
            const nuevosProductos = [...(mesaData.productos || []), { ...producto }];
            
            updateDoc(mesaRef, { productos: nuevosProductos }); // Removed await here
        }
    } catch (error) {
        console.error('Error al agregar el producto a la mesa:', error);
    }
};





  

  return (
    <div className={style.container}>
      <div className={style.row}>
        <div className={style.col}>
          <ProductSearch onSearch={handleSearch} /> {/* Pasar la función handleSearch al componente ProductSearch */}
          <h2 className={`${style.mt5} ${style.greeting}`}>{greeting}</h2>
          {loading && <LoadingSpinner />}
          <div className={style.cardContainer}>
            {!loading && filtrarProductos().length > 0 ? (
              filtrarProductos().map((producto) => (
                <ItemMesa
                key={producto.id}
                id={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
                stock={producto.stock}
                cantidad={producto.cantidad}
                onAddToCart={() => addToMesa(producto)}
              />

              ))
            ) : (
              <p>No hay productos disponibles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemListMesa;
