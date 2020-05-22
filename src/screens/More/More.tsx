import React from 'react';
import { ListItemProps } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';

import { getDefaultOptionList } from './utils';
import MoreView from './MoreView';
import { useMoreInfoContext, MoreInfo } from '../../context/MoreInfoContext';
import LoadingComponent from '../../components/LoadingComponent';
import { BarCodeScannerStackParamList } from '../../navigator/NavigationStack/BarCodeScannerStack';

type MoreScreenNavigationProp = StackNavigationProp<
  BarCodeScannerStackParamList,
  'More'
>;

type Props = {
  navigation: MoreScreenNavigationProp;
};

export type Option = {
  id: number;
  screen: keyof BarCodeScannerStackParamList;
  title: string;
}

export interface MoreViewProps {
  handleListItemOnPress(id: Option['id']): ListItemProps['onPress'];
  optionList: Option[];
  navigation: Props['navigation'];
  version: MoreInfo['version']['content'];
};


const More: React.ComponentType<Props> = (props) => {
  const { navigation } = props;

  const [loading] = React.useState(false);
  const optionList = React.useMemo(() => getDefaultOptionList(),[]);
  const { moreInfo } = useMoreInfoContext();

  const handleListItemOnPress = React.useCallback(id => () => {
    // console.log(optionList[id].screen);
    navigation.navigate(optionList[id].screen);
  }, [optionList])
  
  if (loading) {
    return (
      <LoadingComponent />
    );
  };

  return (
    <MoreView 
      handleListItemOnPress={handleListItemOnPress}
      optionList={optionList}
      navigation={navigation}
      version={moreInfo.version.content}
    />
  )
};

export default React.memo(More);