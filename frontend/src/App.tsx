import { Amplify } from 'aws-amplify';
import { Authenticator, useTheme, View } from '@aws-amplify/ui-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Admin from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import {default as Exports} from './aws-exports.json';
import { ToastContainer } from 'react-toastify';

Amplify.configure({
  aws_cognito_region: Exports.PWADemoAuthStack.cognitoRegion,
  aws_user_pools_id: Exports.PWADemoAuthStack.userPoolId,
  aws_user_pools_web_client_id: Exports.PWADemoAuthStack.userPoolClientId,
  aws_cognito_identity_pool_id: Exports.PWADemoAuthStack.userIdentityPoolId,
  aws_appsync_authenticationType: 'AWS_COGNITO_USER_POOL',
  aws_appsync_graphqlEndpoint: Exports.PWADemoApiStack.GraphQLAPIEndpoint,
  aws_appsync_region: Exports.PWADemoAuthStack.cognitoRegion,
});

const formFields = {
  signIn: {
    username: {
      labelHidden: true,
      placeholder: 'Email',
      isRequired: true,
      className: 'test'
    },
  },
  signUp: {
    username: {
      labelHidden: true,
      placeholder: 'Email',
      isRequired: true
    }
  }
}

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <h1 className='text-xl'>Notifications Demo App</h1>
      </View>
    );
  },

  Footer() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <p className='text-neutral-400'>Created by Julian Pittas. <a href="https://github.com/julianpitt/appsync-react-pwa-demo">View Repo</a> </p>
      </View>
    );
  },
}

export default function App() {
  return (
    <Authenticator formFields={formFields} components={components}>
    <Authenticator.Provider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer />
    </Authenticator.Provider>
    </Authenticator>
  );
}
