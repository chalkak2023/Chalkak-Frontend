import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { setLogin } from '../../store/user.slice';
import apiAxios from '../../utils/api-axios';
import Main from '../Main';

function Auth(SpecificComponent) {
  let state = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation();
  const componentList = ['/photospot']
  useEffect(() => {
    const fetchData = async () => {
      await apiAxios
        .get('/api/auth/islogin', {
          withCredentials: true,
        })
        .then((response) => {
          dispatch(setLogin(true));
        })
        .catch((e) => {
          console.log(e);
          dispatch(setLogin(false));
        });
    };
    if (componentList.includes(location.pathname)) {
      fetchData();
    }
  }, [location]);

  if (state.user.loginState) {
    return SpecificComponent;
  } else {
    return Main;
  }
}

export default Auth;
