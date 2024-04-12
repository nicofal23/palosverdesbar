import React, { useState, useEffect } from 'react';
import ItemList from '../ItemList/ItemList';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'; 
import style from '../ItemListCointainer/ItemListContainer.module.css';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import { useParams } from 'react-router-dom';

const ItemListContainer = ({ greeting }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); // Estado para almacenar la categoría seleccionada
  const [showButtons, setShowButtons] = useState(true); // Estado para controlar la visibilidad de los botones
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    const collectionRef = selectedCategory // Si hay una categoría seleccionada, filtramos por ella
      ? query(collection(db, 'productos'), where('category', '==', selectedCategory))
      : collection(db, 'productos');

    getDocs(collectionRef)
      .then((response) => {
        const productosAdapted = response.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });
        setProductos(productosAdapted);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory]); // Cambiamos el efecto para que se ejecute cuando cambia la categoría seleccionada

  // Función para manejar el clic en las categorías
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowButtons(false); // Ocultar los botones cuando se hace clic en una categoría
  };

  // Función para manejar el clic en el botón "Volver"
  const handleReturnClick = () => {
    setSelectedCategory(null);
    setShowButtons(true); // Mostrar los botones cuando se hace clic en "Volver"
  };

  return (
    <div className={style.container}>
      <div className={style.row}>
        <div className={style.col}>
          <h2 className={`${style.mt5} ${style.greeting}`}>{greeting}</h2>
          {/* Interfaz para seleccionar la categoría */}
          <div className={style.categoryButtons}>
            <div className={style.gridContainer}>
              {showButtons && (
                <>
                  <div className={`${style.gridItem} ${style.resto}`} onClick={() => handleCategoryClick('restaurant')}>
                    <button className={style.button} >Restaurant</button>
                  </div>
                  <div className={`${style.gridItem} ${style.cafe}`}>
                    <button className={style.button} onClick={() => handleCategoryClick('jarras')}>Cafeteria</button>
                  </div>
                  <div className={`${style.gridItem} ${style.cock}`}>
                    <button className={style.button} onClick={() => handleCategoryClick('sarten')}>Cocktails</button>
                  </div>
                  <div className={`${style.gridItem} ${style.vino}`}>
                    <button className={style.button} onClick={() => handleCategoryClick('ollas')}>Vinos y Espumantes</button>
                  </div>
                </>
              )}
              {/* Mostrar el botón "Volver" si hay una categoría seleccionada */}
              {!showButtons && (
                <div>
                  <button className={style.button} onClick={handleReturnClick}>Volver</button>
                </div>
              )}
            </div>
          </div>
          {/* Mostrar los productos solo si hay productos disponibles */}
          {selectedCategory !== null && !loading && productos.length > 0 && (
            <ItemList productos={productos} />
          )}
          {/* Mostrar el spinner de carga mientras se cargan los productos */}
          {loading && <LoadingSpinner />}
          {/* Mensaje de que no hay productos disponibles */}
          {selectedCategory !== null && !loading && productos.length === 0 && (
            <p>No hay productos disponibles en esta categoría.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemListContainer;
