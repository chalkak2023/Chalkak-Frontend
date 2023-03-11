import { useEffect } from "react";
import apiAxios from "../../utils/api-axios";
import Loading from '../components/loading/Loading'

const KaKaoLoginRedirect = () => {

  useEffect(() => {
    const queryParams = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      queryParams[key] = value;
    });

    window.opener?.requestSocialLogin(queryParams)
    window.close()
  }, []);

  return (
    <div>
      <Loading />
    </div>
  );
};

export default KaKaoLoginRedirect;
