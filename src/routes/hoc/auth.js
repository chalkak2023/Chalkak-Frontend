import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Auth(SpecificComponent) {
    function AuthenticationCheck() {
        const navigate = useNavigate();
        let state = useSelector((state) => state);

        useEffect(() => {
          // authValidation();
          if (!state.user.data.id) {
            alert('로그인 후 이용 가능합니다.')
            navigate('/')
          };
        }, [])

        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck

    // function authValidation() {
    //   axios.get('http://localhost:8080/api/auth/refresh').then((response) => {
    //     console.log(response);
    //   })
    // }
}

export default Auth;