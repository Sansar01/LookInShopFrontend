import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../store/auth-Slice/index";
import adminproductSlice from './admin/product-slice/index'
import adminOrderSlice from './admin/order-slice/index'

import shoppingProductSlice from './shop/product-slice/index'
import shoppingCartSlice from './shop/cart-slice/index'
import addressSlice from './shop/address-slice/index'
import orderSlice from './shop/order-slice/index'
import shopSearchSlice from './shop/search-slice/index'
import shopReviewSlice from './shop/review-slice'

import featureSlice from './common-slice/index'

const store = configureStore({
  reducer: {
    auth: authSlice,
    adminProduct:adminproductSlice,
    adminOrder:adminOrderSlice,

    shopProducts:shoppingProductSlice,
    shopCart:shoppingCartSlice,
    shopAddress:addressSlice,
    shopOrder:orderSlice,
    shopSearch:shopSearchSlice,
    shopReview:shopReviewSlice,
    commonFeature:featureSlice
  },
});

export default store;