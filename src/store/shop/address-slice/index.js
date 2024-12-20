import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
      
    const response = await axios.post(
      "https://look-in-shop.vercel.app/api/shop/address/add",
      formData
    );

    return response?.data;
  }
);

export const fetchAllAddress = createAsyncThunk(
    "/addresses/fetchAllAddress",
    async ({userId}) => {
      
      const response = await axios.get(
        `https://look-in-shop.vercel.app/api/shop/address/get/${userId}`
      );
  
      return response?.data;
    }
  );

  export const editAddress = createAsyncThunk(
    "/addresses/editAddress",
    async ({userId,addressId,formData}) => {
      const response = await axios.put(
        `https://look-in-shop.vercel.app/api/shop/address/update/${userId}/${addressId}`,
        formData
      );
  
      return response?.data;
    }
  );

  export const deleteAddress = createAsyncThunk(
    "/addresses/deleteAddress",
    async ({userId,addressId}) => {
      console.log("id ",userId,addressId);
      
      const response = await axios.delete(
        `https://look-in-shop.vercel.app/api/shop/address/delete/${userId}/${addressId}`);
  
      return response?.data;
    }
  );
  
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer