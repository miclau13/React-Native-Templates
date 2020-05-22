import { Option } from './More';

const optionList: Option[] = [
  { 
    id: 0,
    screen: "AboutUs",
    title: "About Us",
  },
  { 
    id: 1,
    screen: "Intro",
    title: "Tutorial",
  },
  { 
    id: 2,
    screen: "FAQ",
    title: "FAQ",
  },
  { 
    id: 3,
    screen: "Comments",
    title: "Comments",
  },
  { 
    id: 4,
    screen: "Privacy",
    title: "Privacy",
  },
  { 
    id: 5,
    screen: "Terms",
    title: "Terms & Conditions",
  },
  // { 
  //   id: 6,
  //   screen: "Comments",
  //   title: "Language",
  // },
];

export const getDefaultOptionList = () => {
  return optionList;
}