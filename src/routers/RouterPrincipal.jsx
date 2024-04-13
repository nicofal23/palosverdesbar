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
            <Route path="/" element={<Prueba/>} />
            <Route path="/category" element={<ItemListContainer />} />
            <Route path="/category/:categoryId" element={<ItemListContainer />}></Route>
            <Route path="/item/:itemId" element={<ItemDetailContainer />} />
            <Route path="/admin" element={<FormularioCargaDatos/>}/>
          </Routes>
        </CartProvider>
    </BrowserRouter> 
  );
};

export default RouterPrincipal;
