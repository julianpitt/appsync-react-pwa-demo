import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Admin from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import {default as Exports} from './aws-exports.json';

Amplify.configure({
  aws_cognito_region: Exports.PWADemoAuthStack.cognitoRegion,
  aws_user_pools_id: Exports.PWADemoAuthStack.userPoolId,
  aws_user_pools_web_client_id: Exports.PWADemoAuthStack.userPoolClientId,
  aws_cognito_identity_pool_id: Exports.PWADemoAuthStack.userIdentityPoolId,
  aws_appsync_authenticationType: 'AWS_COGNITO_USER_POOL',
  aws_appsync_graphqlEndpoint: Exports.PWADemoApiStack.GraphQLAPIEndpoint,
  aws_appsync_region: Exports.PWADemoAuthStack.cognitoRegion,
});

export default function App() {
  return (
    <Authenticator>
    <Authenticator.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
    </Authenticator>
  );
}
