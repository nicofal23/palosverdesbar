import React, { useState, useEffect } from 'react';
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
  const [showButtons, setShowButtons] = useState(true);
  const { categoryId } = useParams();
  const history = useNavigate();

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
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowButtons(false);
  };

  const handleReturnClick = () => {
    setSelectedCategory(null);
    setShowButtons(true);
    history.goBack();
  };

  const handleSubnombreClick = (subnombre) => {
    const element = document.getElementById(subnombre);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
              {!showButtons && (
                <div>
                  <button className={style.buttonreturn} onClick={handleReturnClick}>Volver</button>
                </div>
              )}
            </div>
          </div>
          
          {/* Aquí creamos los botones de los subnombres */}
          {selectedCategory !== null && !loading && productos.length > 0 && (
            <div className={style.subnombreButtons}>
              {productos.map((grupo) => (
                <button key={grupo.subnombre} onClick={() => handleSubnombreClick(grupo.subnombre)}>
                  {grupo.subnombre}
                </button>
              ))}
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
