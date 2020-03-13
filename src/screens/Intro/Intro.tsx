import React from 'react';
import { Alert, ImageProps } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { getDefaultPageList } from './utils';
import IntroView from './IntroView';
import { StackParamList } from '../../navigator/Navigator';

type IntroScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'Intro'
>;

type Props = {
  navigation: IntroScreenNavigationProp;
};

export type Page = {
  backgroundColor: string;
  description: string;
  fontColor: string;
  img: ImageProps['source'];
  imgStyle: ImageProps['style'];
  level: number;
  title: string;
};

export interface IntroViewProps {
  pageList: Page[];
  _doneBtnHandle(): void;
  _nextBtnHandle(index: number): void;
  _onSlideChangeHandle(index: number, total: number): void;
  _onSkipBtnHandle(index: number): void;
};

const pageList = getDefaultPageList();

const Intro: React.ComponentType<Props> = (props) => {
  const { navigation } = props;

  const _doneBtnHandle: IntroViewProps['_doneBtnHandle'] = () => {
    navigation.navigate("HomeTabs");
  };
  const _nextBtnHandle: IntroViewProps['_nextBtnHandle'] = (index) => {
  };
  const _onSlideChangeHandle: IntroViewProps['_onSlideChangeHandle'] = (index, total) => {
  };
  const _onSkipBtnHandle: IntroViewProps['_onSkipBtnHandle'] = (index) => {
    navigation.navigate("HomeTabs");
  };

  return (
    <IntroView
      _doneBtnHandle={_doneBtnHandle}
      _nextBtnHandle={_nextBtnHandle}
      _onSlideChangeHandle={_onSlideChangeHandle}
      _onSkipBtnHandle={_onSkipBtnHandle}
      pageList={pageList}
    />
  )
};

export default React.memo(Intro);