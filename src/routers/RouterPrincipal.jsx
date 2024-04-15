import { Route, Routes, BrowserRouter } from "react-router-dom";
import ItemListContainer from "../components/ItemListCointainer/ItemListContainer";
import ItemDetailContainer from "../components/ItemDetailContainer/ItemDetailContainer";
import { CartProvider } from "../context/CartContext";
import FormularioCargaDatos from "../components/ProductComponent/FormularioCargaDatos.jsx"
import Prueba from "../components/Inicio/Inicio.jsx";

const RouterPrincipal = () => {
  return (
    <BrowserRouter>
      <CartProvider>
          <Routes>
            <Route path="/" element={<ItemListContainer/>} />
            <Route path="/category" element={<Prueba />} />
            <Route path="/category" element={<ItemListContainer />}></Route>
            <Route path="/item/:itemId" element={<ItemDetailContainer />} />
          </Routes>
        </CartProvider>
    </BrowserRouter> 
  );
};

export default RouterPrincipal;
