// ItemDetail.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../ItemDetail/ItemDetail.module.css';

const ItemDetail = ({ nombre, img, precio, category, descripcion }) => {
    return (
        <div className={styles.divcard}>
            <article className={styles.CardItem}>
                <header className={styles.Header}>
                    <h2 className={styles.ItemHeader}>
                        {nombre}
                    </h2>
                </header>
                <picture>
                    <img src={img} alt={nombre} className={styles.ItemImg} />
                </picture>
                <section>
                    <p className={styles.Info}>
                        Categoria: {category}
                    </p>
                    <p className={styles.Info}>
                        Descripcion: {descripcion}
                    </p>
                    <p className={styles.Info}>
                        Precio: ${precio}
                    </p>
                </section>
                <div className={styles.ItemFooter}>
                    <Link to='/cart' className={styles.boton}>Terminar mi compra</Link>
                    <Link to='/' className={styles.boton}>Seguir comprando</Link>
                </div>
            </article>
        </div>
    );
};

export default ItemDetail;
