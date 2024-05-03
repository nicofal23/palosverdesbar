// Item.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Item/Item.module.css';

const Item = ({ id, nombre, img, precio, stock, descripcion }) => {
    const isStockAvailable = stock > 0;

    // Obtener los primeros 19 caracteres de la descripción
    const shortDescription = descripcion.slice(0, 19);
    const remainingDescription = descripcion.slice(19);

    return (
        <article className={styles.CardItem}>
            <div className={styles.Description}>
                <div className={styles.Header}>
                    <h2 className={styles.ItemHeader}>
                        {nombre}
                    </h2>
                    <p className={styles.ItemDescription}>
                        {/* Mostrar los primeros 19 caracteres de la descripción */}
                        {shortDescription}
                        {descripcion.length > 19 && (
                            <Link to={`/item/${id}`} className={styles.ViewMore}>
                                ...ver más
                            </Link>
                        )}
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
