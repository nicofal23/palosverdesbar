import {moniessen} from '../NavBar/NavBar.module.css'
import moniessenImage from '../../assets/img/moniessen.png';
import style from './ImagenLogo.module.css';
const Logo = () => {
    return (
        <div className={style.ContenedorImagen}>
           <a href="#" className={style.a}><img src={moniessenImage} alt="MoniEssen" className={style.moniessen}/></a>
        </div>
    );
  };
  export default Logo   