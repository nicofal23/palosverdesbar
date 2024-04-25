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
      // Obtener la referencia de la mesa actual
      const mesaRef = doc(db, 'mesas', mesaId);
  
      // Obtener los datos actuales de la mesa
      const mesaSnapshot = await getDoc(mesaRef);
      const mesaData = mesaSnapshot.data();
  
      // Verificar si el producto ya está en la mesa
      const productoExistenteIndex = mesaData.productos.findIndex(item => item.id === producto.id);
  
      if (productoExistenteIndex !== -1) {
        // Si el producto ya está en la mesa, actualizar la cantidad
        const productosActualizados = [...mesaData.productos];
        productosActualizados[productoExistenteIndex].cantidad += producto.cantidad;
        
        // Actualizar el campo 'productos' en la mesa con la lista de productos actualizada
        await updateDoc(mesaRef, { productos: productosActualizados });
  
        console.log('Cantidad del producto actualizada en la mesa:', productosActualizados);
      } else {
        // Si el producto no está en la mesa, agregarlo con la cantidad seleccionada
        const nuevosProductos = [...(mesaData.productos || []), { ...producto }];
        
        // Actualizar el campo 'productos' en la mesa con la nueva lista de productos
        await updateDoc(mesaRef, { productos: nuevosProductos });
  
        console.log('Producto agregado a la mesa:', producto);
        console.log('Mesa actualizada con el nuevo producto:', nuevosProductos);
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
                    img={producto.img} 
                    precio={producto.precio}
                    stock={producto.stock}
                    descripcion={producto.descripcion}
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
