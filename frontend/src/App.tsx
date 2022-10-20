import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Login from './pages/LoginPage';
import Admin from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import Exports from './aws-exports.json';

Amplify.configure({
  aws_cognito_region: Exports.SearchAppStack.cognitoRegion,
  aws_user_pools_id: Exports.SearchAppStack.userPoolId,
  aws_user_pools_web_client_id: Exports.SearchAppStack.userPoolClientId,
  aws_cognito_identity_pool_id: Exports.SearchAppStack.userIdentityPoolId,
  aws_appsync_authenticationType: 'AWS_IAM',
  aws_appsync_graphqlEndpoint: Exports.ApiStack.GraphQLAPIEndpoint,
  aws_appsync_region: Exports.SearchAppStack.cognitoRegion,
});

export default function App() {
  return (
    <Authenticator.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  );
}
