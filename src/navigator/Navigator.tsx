import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { omit } from 'lodash';
import React from 'react';

import RootTab from './TabNavigator/RootTab';
import RootStack from './NavigationStack/RootStack';
import LoadingComponent from '../components/LoadingComponent';
import { DisplayIntroContextProvider } from '../context/DisplayIntroContext';
import { MoreInfo, MoreInfoContextProvider } from '../context/MoreInfoContext';
import { Product, ProductListContextProvider } from '../context/ProductListContext';
import { ProductComparison, ProductComparisonListContextProvider } from '../context/ProductComparisonListContext';
import { SelectCategoryContextProvider } from '../context/SelectCategoryContext';

export type StackParamList = {};

interface State {
  displayIntro: "YES" | "NO";
  loading: boolean;
  selectedCategory: string;
  productList: Array<Product> | [] ,
  productComparisonList: Array<ProductComparison> | [] ,
  moreInfo: MoreInfo,
}

interface Action {
  type: 'REMOVE_INTRO' | 'UPDATE_SELECTED_CATEGORY' | 'DISABLE_LOADING' | 'UPDATE_PRODUCT_LIST' | 'UPDATE_PRODUCT_COMPARISON_LIST' | 'UPDATE_MORE_INFO';
  value?: string;
  productList?: State['productList'];
  productComparisonList?: State['productComparisonList'];
  moreInfo?: State['moreInfo'];
};

const initialState = {
  displayIntro: "YES",
  loading: true,
  selectedCategory: "",
  productList: [],
  productComparisonList: [],
  moreInfo: {
    aboutUs: {
      title: "",
      content: "",
      footer: "",
    },
    faq: {
      content: "",
    }
  },
};

const reducer = (prevState: State, action: Action) => {
  switch (action.type) {
    case 'REMOVE_INTRO':
      return {
        ...prevState,
        displayIntro: "NO",
      };
    case 'UPDATE_SELECTED_CATEGORY':
      return {
        ...prevState,
        selectedCategory: action.value.toLowerCase(),
      };
    case 'DISABLE_LOADING':
      return {
        ...prevState,
        loading: false,
      };
    case 'UPDATE_PRODUCT_LIST':
      return {
        ...prevState,
        productList: action.productList,
      };
    case 'UPDATE_PRODUCT_COMPARISON_LIST':
      return {
        ...prevState,
        productComparisonList: action.productComparisonList,
      };
    case 'UPDATE_MORE_INFO':
      return {
        ...prevState,
        moreInfo: action.moreInfo,
      };
  }
};

const Navigator = () => {

  const [state, dispatch] = React.useReducer(
    reducer,
    initialState
  );

  const displayIntroContext = React.useMemo(() => ({
    removeIntro: () => dispatch({ type: 'REMOVE_INTRO' }),
    displayIntro: state.displayIntro
  }), [state.displayIntro]);

  const selectCategoryContext = React.useMemo(() => ({
    updateCategoryList: (value: string) => dispatch({ type: 'UPDATE_SELECTED_CATEGORY', value }),
    selectedCategory: state.selectedCategory
  }), [state.selectedCategory]);

  const productListContext = React.useMemo(() => ({
    refetch: () => fetchProductList(),
    productList: state.productList,
  }), [state.productList]);

  const productComparisonListContext = React.useMemo(() => ({
    refetch: () => fetchProductComparisonList(),
    productComparisonList: state.productComparisonList,
  }), [state.productComparisonList]);

  const moreInfoContext = React.useMemo(() => ({
    refetch: () => fetchMoreInfo(),
    moreInfo: state.moreInfo,
  }), [state.moreInfo]);

  const fetchProductList = async () => {
    try {
      const response = await fetch(`https://miclo1.azurewebsites.net/products`, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json() || [];
      const productList = result.map(product => {
        return omit({
          id: product._id,
          ...product,
        },['__v', '_id'])
      })
      dispatch({ type: 'UPDATE_PRODUCT_LIST', productList });
    } catch (error) {
      console.log(" fetchProductList error:", error);
    } finally {
      dispatch({ type: 'DISABLE_LOADING' });
    }
  }

  const fetchProductComparisonList = async () => {
    try {
      // const response = await fetch(`https://miclo1.azurewebsites.net/products`, {
      // const response = await fetch(`http://192.168.0.106:5000/product-comparisons`, {    
      const response =  await fetch(`https://miclo1.azurewebsites.net/product-comparisons`, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json() || [];
      const productComparisonList = result.map(productComparison => {
        const comparionsList = productComparison.comparionsList.map(product => {
          return omit({
            id: product._id,
            ...product,
          },['__v', '_id'])
        });
        return { ...omit(productComparison, ['__v', '_id', 'createdAt']), comparionsList }
      })
      dispatch({ type: 'UPDATE_PRODUCT_COMPARISON_LIST', productComparisonList });
    } catch (error) {
      console.log(" fetchProductComparisonList error:", error);
    } finally {
      dispatch({ type: 'DISABLE_LOADING' });
    }
  }

  const fetchMoreInfo = async () => {
    try {
      const response = await fetch(`https://miclo1.azurewebsites.net/admin`, {
      // const response = await fetch(`http://192.168.0.106:5000/admin`, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json() || [];
      dispatch({ type: 'UPDATE_MORE_INFO', moreInfo: result[0] });
    } catch (error) {
      console.log(" fetchMoreInfo error:", error);
    } finally {
      dispatch({ type: 'DISABLE_LOADING' });
    }
  }

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let displayIntro, selectedCategory, deviceID;
      try {
        deviceID = await SecureStore.getItemAsync("deviceId");
        if (!deviceID) {
          const sessionId = Constants.sessionId;
          await SecureStore.setItemAsync("deviceId", sessionId);
        }
        // await SecureStore.setItemAsync("selectedCategory", "");
        // await SecureStore.setItemAsync("displayIntro", "YES");
        displayIntro = await SecureStore.getItemAsync("displayIntro");
        selectedCategory = await SecureStore.getItemAsync("selectedCategory");
      } catch (e) {
        dispatch({ type: 'DISABLE_LOADING' });
      }
      if (displayIntro === "NO") {
        dispatch({ type: 'REMOVE_INTRO' });
      };
      if (selectedCategory) {
        dispatch({ type: 'UPDATE_SELECTED_CATEGORY', value: selectedCategory });
      };
    };
    bootstrapAsync();
    fetchProductList();
    fetchProductComparisonList();
    fetchMoreInfo();
    return () => {}
  }, []);

  // console.log(" navigator productComparisonList", state.productComparisonList)
  // console.log("productList", state.productList)
  // console.log("moreInfo",state.moreInfo)
  if (state.loading) {
    return (
      <LoadingComponent />
    );
  };

  return (
    <DisplayIntroContextProvider value={displayIntroContext}>
    <SelectCategoryContextProvider value={selectCategoryContext}>
      <ProductListContextProvider value={productListContext}>
        <ProductComparisonListContextProvider value={productComparisonListContext}>
          <MoreInfoContextProvider value={moreInfoContext}>
            <RootTab />
          </MoreInfoContextProvider>
        </ProductComparisonListContextProvider>
      </ProductListContextProvider>
    </SelectCategoryContextProvider>
    </DisplayIntroContextProvider>
  )
};

export default Navigator;