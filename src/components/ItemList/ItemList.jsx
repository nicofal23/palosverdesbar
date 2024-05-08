import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import Item from '../Item/Item';
import styles from '../ItemList/ItemList.module.css';

const ItemList = ({ productos }) => {
  return (
    <div className={`ListaGrupo ${styles.ListaGrupo}`}>
      {productos.map((prod) => (
        <div key={prod.id} className={`CardItem ${styles.CardItem}`}>
          {/* Envuelve cada Item dentro de un Link */}
          <Link to={`/item/${prod.id}`} className={styles.CardItem}>
            <Item {...prod} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
