import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { screenOptions } from './NavigatorOptions';
import LoadingComponent from '../../../components/LoadingComponent';
import BarCodeScannerScreen, { options as BarCodeScannerScreenOptions } from '../../../screens/BarCodeScanner';
import ProductCategoriesScreen, { options as ProductCategoriesScreenOptions } from '../../../screens/ProductCategories';
import AddProductScreen, { options as AddProductScreenOptions } from "../../../screens/AddProduct";
import ProductComparisonScreen, { options as ProductComparisonScreenOptions } from "../../../screens/ProductComparison";
import ProductInfoScreen, { options as ProductInfoScreenOptions } from "../../../screens/ProductInfo";
import ProductSearchScreen, { options as ProductSearchScreenOptions } from "../../../screens/ProductSearch";
import RecordsScreen, { options as RecordsScreenOptions } from "../../../screens/Records";
import RecordsHistoryScreen, { options as RecordsHistoryScreenOptions } from "../../../screens/RecordsHistory";
import RecordsSavedScreen, { options as RecordsSavedScreenOptions } from "../../../screens/RecordsSaved";

export type BarCodeScannerStackParamList = {
  AddProduct: undefined;
  BarCodeScanner: undefined;
  ProductCategories: undefined;
  ProductComparison: undefined;
  ProductInfo: undefined;
  ProductSearch: undefined;
  Records: undefined;
  RecordsHistory: undefined;
  RecordsSaved: undefined;
};

const BarCodeScannerStack = createStackNavigator<BarCodeScannerStackParamList>();

const BarCodeScannerStackScreen = (props) => {
  const [selectCategory, setSelectCategory] = React.useState("YES");
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const bootStrapAsync = async () => {
      const selectCategory = await SecureStore.getItemAsync("selectCategory");
      console.log("BarCodeScannerStackScreen useEffect selectCategory",selectCategory)
      setSelectCategory(selectCategory);
      setLoading(false);
    }
    bootStrapAsync();
  }, []);

  if (loading) {
    return (
      <LoadingComponent />
    );
  };

  return (
    <BarCodeScannerStack.Navigator
      initialRouteName={selectCategory === "YES" ? "ProductCategories" : "BarCodeScanner"}
      // initialRouteName="BarCodeScanner"
      screenOptions={screenOptions}
    >
      <BarCodeScannerStack.Screen name="BarCodeScanner" component={BarCodeScannerScreen} options={BarCodeScannerScreenOptions}/>
      <BarCodeScannerStack.Screen name="ProductCategories" component={ProductCategoriesScreen} options={ProductCategoriesScreenOptions}/>
      <BarCodeScannerStack.Screen name="AddProduct" component={AddProductScreen} options={AddProductScreenOptions}/>
      <BarCodeScannerStack.Screen name="ProductComparison" component={ProductComparisonScreen} options={ProductComparisonScreenOptions}/>
      <BarCodeScannerStack.Screen name="ProductInfo" component={ProductInfoScreen} options={ProductInfoScreenOptions}/>
      <BarCodeScannerStack.Screen name="ProductSearch" component={ProductSearchScreen} options={ProductSearchScreenOptions}/>
      <BarCodeScannerStack.Screen name="Records" component={RecordsScreen} options={RecordsScreenOptions}/>
      <BarCodeScannerStack.Screen name="RecordsHistory" component={RecordsHistoryScreen} options={RecordsHistoryScreenOptions}/>
      <BarCodeScannerStack.Screen name="RecordsSaved" component={RecordsSavedScreen} options={RecordsSavedScreenOptions}/>
    </BarCodeScannerStack.Navigator>
  );
};

export default BarCodeScannerStackScreen;