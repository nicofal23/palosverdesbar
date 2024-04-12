import {moniessen} from '../NavBar/NavBar.module.css'
import moniessenImage from '../../assets/img/moniessen.png';
import style from './ImagenLogo.module.css';
const Logo = () => {
    return (
        <div className={style.ContenedorImagen}>
           <a href="#"><img src={moniessenImage} alt="MoniEssen" className={moniessen}/></a>
        </div>
    );
  };
  export default Logo   