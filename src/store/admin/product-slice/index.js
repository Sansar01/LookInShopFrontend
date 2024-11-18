import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

 export const addNewProducts = createAsyncThunk(
  "/products/addnewProduct",
  async (formData) => {
    const response = await axios.post(
      "https://look-in-shop.vercel.app/api/admin/products/add",
      formData
    );

    return response?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchallProduct",
  async () => {
    const response = await axios.get(
      "https://look-in-shop.vercel.app/api/admin/products/get"
    );

    return response?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const response = await axios.put(
      `https://look-in-shop.vercel.app/api/admin/products/edit/${id}`,
      formData
    );

    return response?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const response = await axios.delete(
      `https://look-in-shop.vercel.app/api/admin/products/delete/${id}`
    );

    return response?.data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default  productSlice.reducer;

