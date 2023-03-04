import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Auth(SpecificComponent) {
    function AuthenticationCheck() {
        const navigate = useNavigate();
        let state = useSelector((state) => state);

        useEffect(() => {
          if (!state.user.data.id) {
            console.log(state.user, !state.user.id)
            navigate('/')
          };
        }, [])

        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}

export default Auth;