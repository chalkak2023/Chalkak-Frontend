import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from '../components/loading/Loading'

const OauthLoginRedirect = () => {
  const { provider } = useParams()

  useEffect(() => {
    const queryParams = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      queryParams[key] = value;
    });

    window.opener?.requestSocialLogin(provider, queryParams)
    window.close()
  }, []);

  return (
    <div>
      <Loading />
    </div>
  );
};

export default OauthLoginRedirect;
