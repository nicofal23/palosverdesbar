import React, { useState, useEffect } from 'react';
import { getDocs, collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import style from '../ItemListCointainer/ItemListContainer.module.css';
import ProductSearch from '../ProductSearch/ProductSearch';
import ItemMesa from '../Item/ItemMesa';

const ItemListMesa = ({ greeting, mesaId, onAddToMesa, productosMesa }) => {
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

  const addToMesa = async (producto, cantidadSeleccionada) => {
    try {
      const mesaRef = doc(db, 'mesas', mesaId);
      const mesaSnapshot = await getDoc(mesaRef);
      const mesaData = mesaSnapshot.data();
  
      // Agregar el nuevo producto a la lista de productos de la mesa
      const nuevosProductos = [
        ...(mesaData.productos || []),
        { nombre: producto.nombre, precio: producto.precio, cantidad: cantidadSeleccionada }
      ];
  
      // Actualizar la lista de productos de la mesa con los nuevos productos
      await updateDoc(mesaRef, { productos: nuevosProductos });
  
      console.log('Producto agregado a la mesa exitosamente.');

      // Llamar a la función para actualizar la lista de productos en MesaDetail
      onAddToMesa();
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
  onAddToCart={(producto, cantidadSeleccionada) => addToMesa(producto, cantidadSeleccionada)} // Pasando producto y cantidadSeleccionada
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
