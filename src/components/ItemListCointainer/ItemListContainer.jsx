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
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [showButtons, setShowButtons] = useState(true); 
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    const collectionRef = selectedCategory 
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
  }, [selectedCategory]); 

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowButtons(false); 
  };

  const handleReturnClick = () => {
    setSelectedCategory(null);
    setShowButtons(true); 
  };

  return (
    <div className={style.container}>
      <div className={style.row}>
        <div className={style.col}>
          <h2 className={`${style.mt5} ${style.greeting}`}>{greeting}</h2>
          {/* Mostrar el spinner de carga mientras se cargan los productos */}
          {loading && <LoadingSpinner />}
          {/* Interfaz para seleccionar la categoría */}
          <div className={style.categoryButtons} style={{ display: loading ? 'none' : 'block' }}>
            <div className={style.gridContainer}>
              {showButtons && (
                <>
                  <div className={`${style.gridItem} ${style.resto}`} onClick={() => handleCategoryClick('restaurant')}>
                    <button className={style.button}>Restaurant</button>
                  </div>
                  <div className={`${style.gridItem} ${style.cafe}`}>
                    <button className={style.button} onClick={() => handleCategoryClick('cafeteria')}>Cafeteria</button>
                  </div>
                  <div className={`${style.gridItem} ${style.cock}`}>
                    <button className={style.button} onClick={() => handleCategoryClick('cocktails')}>Cocktails</button>
                  </div>
                  <div className={`${style.gridItem} ${style.vino}`}>
                    <button className={style.button} onClick={() => handleCategoryClick('vinos')}>Vinos y Espumantes</button>
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
