import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../ItemListCointainer/ItemListContainer.module.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ItemListCategorySelector = ({ loading }) => { // Asegúrate de pasar 'loading' como prop
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/${category}`);
    };

    return (
        <div className={style.container}>
            <div className={style.row}>
                <div className={style.col}>
                    {loading && <LoadingSpinner />}
                    <div className={style.categoryButtons} style={{ display: loading ? 'none' : 'block' }}>
                        <div className={style.gridContainer}>
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
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${style.gridkiosko} ${style.kiosko}`} onClick={() => handleCategoryClick('kiosko')}>
                <button className={style.button}>Kiosko</button>
            </div>
        </div>
    );
};

export default ItemListCategorySelector;
