import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateProduct, FetchProduct, updateProduct } from "./ProductListAPI";
import { FilterProduct } from "./ProductListAPI";
import { selectedProduct } from "./ProductListAPI";

const initialState = {
  products: [],
  allProducts: [],
  status: "idle",
  itemPerPage: 9,
  totalproduct: "",
  selectedProduct: null,
  brands: [],
  category: [],
};

export const FetchProductAsync = createAsyncThunk(
  "product/FetchProduct",
  async (token) => {
    const response = await FetchProduct(token);

    return response;
  }
);
export const CreateProductAsync = createAsyncThunk(
  "product/AddProduct",
  async ({ product, token }) => {
    // console.log(product, "product");

    const response = await CreateProduct(product, token);
    return response;
  }
);
export const FilterProductAsync = createAsyncThunk(
  "product/FilterProduct",
  async ({ filter, sort, pagination, search_qurey, token, id }) => {
    const response = await FilterProduct(
      filter,
      sort,
      pagination,
      search_qurey,
      token,
      id
    );
console.log(response,"rfefefs")
    return response;
  }
);

export const selectedProductAsync = createAsyncThunk(
  "product/product/:id",
  async ({ id, token }) => {
    let response = await selectedProduct(id, token);
    return response;
  }
);
export const updateProductAsync = createAsyncThunk(
  "product/update/:id",
  async ({ product, token }) => {
    console.log(product,"slice")
    let response = await updateProduct(product, token);
    return response;
  }
);



export const ProductList = createSlice({
  name: "product",
  initialState,


  extraReducers: (builder) => {
    builder
      .addCase(FetchProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(FetchProductAsync.fulfilled, (state, action) => {
        state.status = "idle";

        state.allProducts = action.payload;
      })

      .addCase(FilterProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(FilterProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload.data;
        state.totalproduct = action.payload.totalproduct;
        // console.log(action.payload);
      })
      .addCase(selectedProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(selectedProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedProduct = action.payload;
      })
      .addCase(CreateProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(CreateProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products.push(action.payload);
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = "idle";

        const index = state.products.findIndex(
          (product) => product.id == action.payload.id
        );
        state.products[index] = action.payload;
      });
  },
});

export const SelectAllProduct = (state) => state.product.products;
export const productStatus = (state) => state.product.status;
export const SelectedProduct = (state) => state.product.selectedProduct;
export const totalBooks = (state)=> state.product.allProducts;

export default ProductList.reducer;
