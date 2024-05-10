// LoadingSpinner.js
import style from '../LoadingSpinner/LoadingSpinner.module.css'
import { Spinner } from 'reactstrap';

const LoadingSpinner = () => {
  return (
    <div className={style.loading}>
    <Spinner color="secondary" size="sm" type="grow" />
    <p>Cargando...</p>
  </div>
  );
};

export default LoadingSpinner;
 