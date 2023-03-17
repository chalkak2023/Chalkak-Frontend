import { useEffect } from "react";
import MainCollections from "./main/MainCollections";
import MainMeetups from "./main/MainMeetups";
import MainCarousel from "./main/MainCarousel";

const Main = () => {
  useEffect(() => {
    console.log(`host: ${process.env.REACT_APP_SERVER_ADDRESS}`);
  })
  return (
    <>
      <MainCarousel />
      <MainCollections />
      <MainMeetups />
    </>
  )
};

export default Main;
