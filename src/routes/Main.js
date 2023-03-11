import { useEffect } from "react";

const Main = () => {
  useEffect(() => {
    console.log(`host: ${process.env.REACT_APP_SERVER_ADDRESS}`);
  })
  return (
    <>
      <h2>메인페이지</h2>
    </>
  )
};

export default Main;
