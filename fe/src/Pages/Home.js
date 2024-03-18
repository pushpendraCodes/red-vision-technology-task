import React, { useEffect } from "react";
import Navbar from "../features/Navbar/Navbar";
import { ProductList } from "../features/ProductList/Component/ProductList";
import Crousal from "../Component/Crousal";
import Footer from "../features/common/Footer";
import { useDispatch, useSelector } from "react-redux";
import { SelectedLoggedUser } from "../features/Auth/AuthSlice";
import { getUserCartAsync } from "../features/Cart/CartSlice";
import { FetchProductAsync } from "../features/ProductList/ProductListSlice";


export default function Home() {
  let dispatch = useDispatch();

  let user = useSelector(SelectedLoggedUser)
  let {token} = JSON.parse(localStorage.getItem("user"))
  useEffect(() => {
    if (user) {

      dispatch(getUserCartAsync(user));
      dispatch(FetchProductAsync(token))
    }
  }, [dispatch, user]);
  return (
    <>
      <Navbar />
      <Crousal />
      <ProductList />
      <Footer/>
    </>
  );
}
