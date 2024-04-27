import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import { groupBy } from 'lodash'; // Importar groupBy desde lodash
import ItemList from '../ItemList/ItemList';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import style from '../ItemListCointainer/ItemListContainer.module.css';

const ItemListContainer = ({ greeting }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const subnombreButtonsRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    setLoading(true);

    const collectionRef = categoryId
      ? query(collection(db, 'productos'), where('category', '==', categoryId))
      : collection(db, 'productos');

    getDocs(collectionRef)
      .then((response) => {
        const productosAdapted = response.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });

        // Agrupar los productos por subnombre
        const groupedProductos = groupBy(productosAdapted, 'subnombre');

        // Transformar el objeto agrupado en un array de objetos
        const groupedProductosArray = Object.keys(groupedProductos).map((subnombre) => ({
          subnombre,
          productos: groupedProductos[subnombre],
        }));

        setProductos(groupedProductosArray);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);

  useEffect(() => {
    const handlePopstate = () => {
      // Recargar la página cuando se detecta un cambio en el historial de navegación (por ejemplo, al hacer clic en el botón de volver del navegador)
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/${category}`); // Usa navigate en lugar de history.push
  };

  const handleReturnClick = () => {
    setSelectedCategory(null); // Resetear la categoría seleccionada
    navigate('/'); // Redirigir a la página de inicio
  };

  const handleSubnombreClick = (subnombre) => {
    const element = document.getElementById(subnombre);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scroll = (scrollOffset) => {
    if (subnombreButtonsRef.current) {
      subnombreButtonsRef.current.style.transform = `translateX(${scrollOffset}px)`;
      setScrollLeft(scrollLeft + scrollOffset);
    }
  };
  return (
    <div className={style.container}>
      <div className={style.row}>
        <div className={style.col}>
          <h2 className={`${style.mt5} ${style.greeting}`}>{greeting}</h2>
          {loading && <LoadingSpinner />}
          <div className={style.categoryButtons} style={{ display: loading ? 'none' : 'block' }}>
            <div className={style.gridContainer}>
              {selectedCategory === null && (
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
              {selectedCategory !== null && (
                <div>
                  <button className={style.buttonreturn} onClick={handleReturnClick}>Volver</button>
                </div>
              )}
            </div>
          </div>
          
          {/* Aquí creamos los botones de los subnombres */}
          {selectedCategory !== null && !loading && productos.length > 0 && (
            <div className={style.subnombreButtonsContainer}>
              <button className={`${style.arrowButton} ${style.arrowLeft}`} onClick={() => scroll(-100)} disabled={scrollLeft === 0}>
                {'<'}
              </button>
              <div className={style.subnombreButtons} ref={subnombreButtonsRef}>
                {productos.map((grupo) => (
                  <button key={grupo.subnombre} className={style.subnombreButton} onClick={() => handleSubnombreClick(grupo.subnombre)}>
                    {grupo.subnombre}
                  </button>
                ))}
              </div>
              <button className={`${style.arrowButton} ${style.arrowRight}`} onClick={() => scroll(100)} disabled={scrollLeft >= subnombreButtonsRef.current?.scrollWidth - subnombreButtonsRef.current?.clientWidth}>
                {'>'}
              </button>
            </div>
          )}

          {selectedCategory !== null && !loading && productos.length > 0 && (
            productos.map((grupo) => (
              <div key={grupo.subnombre} className={style.subnombre}>
                <h3 id={grupo.subnombre}>{grupo.subnombre}</h3>
                <ItemList productos={grupo.productos} />
              </div>
            ))
          )}
          {selectedCategory !== null && !loading && productos.length === 0 && (
            <p>No hay productos disponibles en esta categoría.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemListContainer;
