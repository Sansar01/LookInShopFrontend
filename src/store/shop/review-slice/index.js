import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formData) => {
    const response = await axios.post(
      "https://look-in-shop.vercel.app/api/shop/review/add",
        formData
    );

    return response?.data;
  }
);

export const getReviews = createAsyncThunk("/order/getReview", async (id) => {
  const response = await axios.get(
    `https://look-in-shop.vercel.app/api/shop/review/get/${id}`
  );

  return response?.data;
});

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
