import * as SecureStore from 'expo-secure-store';
import { find } from 'lodash';
import React from 'react';
import { FlatListProps, TouchableOpacityProps } from 'react-native';
import { ButtonGroupProps, IconProps, ListItemProps, TileProps } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';

import { getDefaultAllList } from './utils';
import RecordsView, { RecordsListItemView } from './RecordsView';
import LoadingComponent from '../../components/LoadingComponent';
import { BarCodeScannerStackParamList } from '../../navigator/NavigationStack/BarCodeScannerStack';
import { useProductListContext } from '../../context/ProductListContext';
import { useProductComparisonListContext } from '../../context/ProductComparisonListContext';
import { useFavoritedProductListContext } from '../../context/FavoritedProductListContext';
import mapping from '../../languages/CN/mapping';
import favoriteProduct from '../../api/favoriteProduct';

type RecordsScreenNavigationProp = StackNavigationProp<
  BarCodeScannerStackParamList,
  'Records'
>;

type Props = {
  navigation: RecordsScreenNavigationProp;
};

// export type Buttons = 'Products' | 'Comparisons' | 'Saved';
export type Records = TileProps;
export interface RecordsItem extends ListItemProps {
  favorite: boolean;
  id: string;
};

export interface RecordsViewProps {
  buttons: string[];
  onButtonIndexPress: ButtonGroupProps['onPress'];
  recordsItemsList: RecordsItem[];
  selectedButtonIndex: number;

  // For RecordItems
  isRefreshing: boolean;
  onRefresh: FlatListProps<RecordsItem>['onRefresh'];
  renderItem: FlatListProps<RecordsItem>['renderItem'];
  navigation: Props['navigation'];
};

export interface RecordsListItemViewProps {
  // favoriteIconOnPress(id: string): IconProps['onPress'];
  handleProductOnPress(id: string): TouchableOpacityProps['onPress'];
  item: RecordsItem;
};

const buttons = [mapping['Products'] || "Products", mapping['Comparisons'] || "Comparisons", mapping['Saved'] || "Saved"];

const Records: React.ComponentType<Props> = (props) => {
  const { navigation } = props;
  const { productList: productDataList, refetch: productListRefetch } = useProductListContext();
  const { productComparisonList, refetch: productComparisonListRefetch } = useProductComparisonListContext();
  const { favoritedProductList, refetch: favoritedProductListtRefetch } = useFavoritedProductListContext();
  const [loading] = React.useState(false);
  const [selectedButtonIndex, setSelectedButtonIndex] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  // const [favoritedProductList, setFavoritedProductList] = React.useState(productDataList.filter(product => product.saved).map(product => product.id));

  const recordsItemsList = React.useMemo(() => { 
    const productIdList = productComparisonList.filter(productComparison => productComparison.comparionsList).map(productComparison => productComparison.productId);
    const result = getDefaultAllList(productIdList.map(productId => {
      return find(productDataList, (product) => product.id === productId);
    }), favoritedProductList);
    return result || [];
  }, [productComparisonList, productDataList, favoritedProductList]);

  const recordsItemsComparisonList = React.useMemo(() => {
    const productIdList = productComparisonList.filter(productComparison => productComparison.comparionsList.length > 0).map(productComparison => productComparison.productId);
    const result = getDefaultAllList(productIdList.map(productId => {
      return find(productDataList, (product) => product.id === productId);
    }), favoritedProductList)
    return result || [];
  }, [productComparisonList, productDataList, favoritedProductList]);

  const recordsItemsFavoritList = React.useMemo(() => {
    // const productList = productDataList.filter(product => favoritedProductList.includes(product.id));
    const result = getDefaultAllList(productDataList, favoritedProductList).filter(product => product.favorite);
    return result || [];
  }, [favoritedProductList, productDataList]);

  const renderRecordsItemsList = React.useMemo(() => {
    switch (selectedButtonIndex) {
      case 0:
        return recordsItemsList;
      case 1:
        return recordsItemsComparisonList;
      case 2:
        return recordsItemsFavoritList;
    }
  }, [favoritedProductList, recordsItemsList, recordsItemsComparisonList, selectedButtonIndex, recordsItemsFavoritList]);

  // const favoriteIconOnPress = React.useCallback<RecordsListItemViewProps['favoriteIconOnPress']>((id) => async () => {
  //   if (favoritedProductList.includes(id)) {
  //     setFavoritedProductList(productIdlist => productIdlist.filter(productId => productId !== id));
  //   } else {
  //     setFavoritedProductList(productIdlist => [ ...productIdlist, id]);
  //   };
  //   const deviceId = await SecureStore.getItemAsync("deviceId");
  //   await favoriteProduct(id, deviceId);
  //   await productListRefetch();
  // }, [favoritedProductList]);

  const onButtonIndexPress = React.useCallback<RecordsViewProps['onButtonIndexPress']>((index) => {
    setSelectedButtonIndex(index);
  }, [selectedButtonIndex]);

  const handleProductOnPress = React.useCallback<RecordsListItemViewProps['handleProductOnPress']>(id => () => {
    navigation.navigate("ProductInfo", { 
      productId: id,
    });
  }, []);

  const onRefresh = React.useCallback<RecordsViewProps['onRefresh']>(async () => {
    setIsRefreshing(true); // true isRefreshing flag for enable pull to refresh indicator
    try {
      // await myRehabRequestsRefetch();
      await productListRefetch();
      await productComparisonListRefetch();
      await favoritedProductListtRefetch();
    } catch (error) {
      console.log("refetch error", error)
    };
    setIsRefreshing(false);
  }, [isRefreshing]);

  const renderItem = React.useCallback<RecordsViewProps['renderItem']>(({ item }) => {
    return (
      <RecordsListItemView
        // favoriteIconOnPress={favoriteIconOnPress}
        handleProductOnPress={handleProductOnPress}
        item={item}
      />
    );
  },[handleProductOnPress]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', async() => {
      await productListRefetch();
      await productComparisonListRefetch();
      await favoritedProductListtRefetch();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <LoadingComponent />
    );
  };

  return (
    <RecordsView 
      buttons={buttons}
      onButtonIndexPress={onButtonIndexPress}
      selectedButtonIndex={selectedButtonIndex}

      // For RecordItems
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      renderItem={renderItem}
      recordsItemsList={renderRecordsItemsList}
      navigation={navigation}
    />
  )
};

export default React.memo(Records);