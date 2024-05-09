import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import { groupBy } from 'lodash'; // Importar groupBy desde lodash
import ItemList from '../ItemList/ItemList';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import style from '../ItemListCointainer/ItemListContainer.module.css';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/system';

const ItemListContainer = ({ greeting }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();
  const subnombreButtonsRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navigate = useNavigate();

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

        const groupedProductos = groupBy(productosAdapted, 'subnombre');

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
    const handleNavigation = (event) => {
      if (event.persisted) {
        window.history.replaceState(null, null, '/');
      }
    };

    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  const handleReturnClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubnombreClick = (subnombre) => {
    const element = document.getElementById(subnombre);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scroll = (scrollOffset) => {
    if (subnombreButtonsRef.current) {
      subnombreButtonsRef.current.style.transform = `translateX(${scrollLeft + scrollOffset}px)`;
      setScrollLeft(scrollLeft + scrollOffset);
    }
  };

  const ThickArrowUpwardIcon = styled(ExpandLessIcon)({
    fontSize: '36px',
    fontWeight: 'bold',
  });

  return (
    <div className={style.container}>
      <div className={style.row}>
        <div className={style.col}>
          <h2 className={`${style.mt5} ${style.greeting}`}>{greeting}</h2>
          {loading && <LoadingSpinner />}
          <div className={style.categoryButtons} style={{ display: loading ? 'none' : 'block' }}>
            <div className={style.gridContainer}></div>
          </div>

          {loading ? null : productos.length > 0 && (
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

          {!loading && productos.length > 0 && (
            productos.map((grupo) => (
              <div key={grupo.subnombre} className={style.subnombre}>
                <h3 id={grupo.subnombre}>{grupo.subnombre}</h3>
                <ItemList productos={grupo.productos} categoryId={categoryId} />
              </div>
            ))
          )}
          {!loading && productos.length === 0 && (
            <p>No hay productos disponibles en esta categoría.</p>
          )}
        </div>
      </div>
      <div>
        <button className={style.buttonreturn} onClick={handleReturnClick}>
          <ThickArrowUpwardIcon />
        </button>
      </div>
    </div>
  );
};

export default ItemListContainer;
