import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectedProductAsync } from "../ProductListSlice";
import { SelectedProduct } from "../ProductListSlice";
import { addToCartAsync, cart } from "../../Cart/CartSlice";
import { SelectedLoggedUser } from "../../Auth/AuthSlice";
import star from "../../../icons/star.png";
import truck from "../../../icons/delivery-truck.png";
import Switch from "../../../icons/switch.png";
import guarantee from "../../../icons/guarantee.png";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { price_Calc } from "../../../app/Costant";
import { useAlert } from "react-alert";
import CartPage from "../../../Pages/CartPage";
const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


export default function ProductDetails() {
  const spanStyle = {
    padding: "20px",
    background: "#efefef",
    color: "#000000",
  };

  const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    height: "400px",
  };

  const dispatch = useDispatch();
  const param = useParams();
  let { id } = useParams();
  // console.log(id);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"))
    dispatch(selectedProductAsync({id,token:user.token}));
  }, [id, dispatch]);

  const product = useSelector(SelectedProduct);
  console.log(product, "products");


 ;
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const user = useSelector(SelectedLoggedUser);
  const Cart = useSelector(cart);
  console.log(Cart,"Cart");
  let navigate = useNavigate();
  let alert = useAlert();

  const addCart = (e) => {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem("user"))
    if  ( Cart?.findIndex((item) => item.book.id === product.id)< 0) {

      const newItem = {
        book: product.id,
        user: user.user,
        quantity: 1,
      };
      // if (selectedColor) {
      //   newItem.color = selectedColor;
      // }
      // if (selectedSize) {
      //   newItem.size = selectedSize;
      // }
      // console.log(newItem)
      dispatch(addToCartAsync({ item: newItem, alert ,token:user.token}));
      navigate("/")
    } else {
      alert.error("Item Already added");
    }
  };
  const [index, setIndex] = useState(0);
  return (
    <div className="bg-white">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <li className="text-sm">
              <Link
                to="/"
                aria-current="page"
                className="font-medium text-gray-500 mx-4 hover:text-gray-600"
              >
                home
              </Link>
            </li>

            <li>
              <div className="flex items-center">
                <p className="mr-1 text-sm font-medium mx-2 text-gray-900">
                  {product?.category}
                </p>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>

            <li className="text-sm">
              <p
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {product?.title}
              </p>
            </li>
          </ol>
        </nav>



        {/* desktop image gallery */}

        <div className=" hidden py-5 sm:flex justify-center items-center ">
          <div>
            {product?.images.slice(0, 4).map((item, i) => {
              return (
                <div className=" outline-dotted my-2 ">
                  <img
                    onClick={() => {
                      setIndex(i);
                    }}
                    style={{ width: "200px", height: "150px" }}
                    className="w-30 object-cover cursor-pointer h-30"
                    src={item}
                    alt={item}
                  />
                </div>
              );
            })}
          </div>
          <div className="px-10 ">
            <img style={{maxHeight:"400px"}} src={product?.images[index]} alt={product?.images[index]} />
          </div>
        </div>

        {/* mobile image gallery */}
        <div className="slide-container  sm:hidden p-1">
          <Slide>
            {product?.images.map((slideImage, index) => (
              <div key={index}>
                <div
                  style={{ ...divStyle, backgroundImage: `url(${process.env.REACT_APP_URL}/${slideImage})` }}
                ></div>
              </div>
            ))}
          </Slide>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-6xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 flex justify-between items-center lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-red-500 sm:text-3xl">
              {product?.title}
            </h1>

            <p className="text-sm font-serif">By : {product?.author} (author)</p>

          </div>
          <div className="mt-3">
           <p className="text-sm font-serif">{product?.pages} pages</p>
            <p className="text-sm font-serif">Released:{product?.year} year</p>
           </div>
          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>

            <div className="flex gap-3">
              <p className="text-2xl font-bold tracking-tight m text-gray-900">
                ₹{price_Calc(product?.price, product?.discountPercentage)}
              </p>
              <p className="text-xl font-semibold tracking-tight line-through mt-1 text-gray-900">
                ${product?.price}
              </p>

              <p
                style={{ alignSelf: "center" }}
                className="text-sm align-baseline text-green-400"
              >
                {product?.discountPercentage}% off
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  <button className="rounded-md flex gap-2 bg-green-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    {product?.rating}
                    <img className="w-5 h-5" src={star} alt="" />
                  </button>
                </div>
                <p className="sr-only">{product?.rating} out of 5 stars</p>
                <a
                  href={reviews.href}
                  className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <div className="divide-y mt-10 divide-gray-100">


              <div className="flex mt-5">
                <h4 className="font-semibold">Availbale: </h4>{" "}
                <p style={{ alignSelf: "center" }} className="text-sm mx-1">
                  In stock
                </p>
              </div>


            </div>
            <br />
            <Link
              to="/cart"
              onClick={(e) => {
                addCart(e);
              }}
              className="flex mt-5 items-center justify-center rounded-full border border-transparent bg-pink-600 px-3 py-2  text-base font-medium text-white shadow-sm hover:bg-pink-700"
            >
              Add to Cart
            </Link>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">
                  {product?.description}
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
