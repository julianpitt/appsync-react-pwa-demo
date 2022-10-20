import { useEffect } from 'react';

import { Authenticator, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { useNavigate, useLocation } from 'react-router';

export default function Login() {
  const { route } = useAuthenticator(context => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();
  let from = (location.state as undefined | { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    if (route === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);

  return (
    <View className="auth-wrapper justify-center container">
      <Authenticator
        loginMechanisms={['email']}
        signUpAttributes={['given_name', 'family_name']}
        initialState="signIn"
      ></Authenticator>
    </View>
  );
}
