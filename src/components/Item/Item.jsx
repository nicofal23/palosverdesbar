// item.jsx
import { Link } from 'react-router-dom';
import styles from '../Item/Item.module.css';

const Item = ({ id, nombre, img, precio, stock, descripcion}) => {
    const isStockAvailable = stock > 0;

    return (
        <article className={styles.CardItem}>
            <div className={styles.Description}>
                <div className={styles.Header}>
                    <h2 className={styles.ItemHeader}>
                        {nombre}
                    </h2>
                    <p className={styles.ItemDescription}>
                         {descripcion}
                    </p>
                    <p className={styles.Precio}>
                         ${precio} 
                    </p>
                </div>
                <footer className={styles.ItemFooter}>
                    {isStockAvailable ? (
                        <Link to={`/item/${id}`} className={styles.Option}>
                            Ver detalle
                        </Link>
                    ) : (
                        <button className={styles.OptionDisabled} disabled>
                            no disponible
                        </button>
                    )}
                </footer>
            </div>
            <div className={styles.imga}>
                <picture>
                    <img src={img} alt={nombre} className={styles.ItemImg} />
                </picture>
            </div>
        </article>
    );
};

export default Item;
