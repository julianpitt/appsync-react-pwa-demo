import { Amplify } from 'aws-amplify';
import { Authenticator, Radio, RadioGroupField, useAuthenticator, useTheme, View } from '@aws-amplify/ui-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Admin from './pages/AdminPage';
import LocalTestPage from './pages/LocalTestPage';
import RegistrationPage from './pages/RegistrationPage';
import {default as Exports} from './aws-exports.json';
import { ToastContainer } from 'react-toastify';
import { WebsocketProvider } from './providers/websocket';
import UserGroups from '../../shared/groups';

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

const services = {
  async validateCustomSignUp(formData: any) {
    if (!formData['custom:groupName']) {
      return {
        'custom:groupName': 'You must select at least one employee group',
      };
    }
  },
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

  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();
      return (
        <>
          {/* Re-use default `Authenticator.SignUp.FormFields` */}
          <Authenticator.SignUp.FormFields />

          <RadioGroupField
            errorMessage={validationErrors.groupName as string}
            hasError={!!validationErrors.groupName}
            name="custom:groupName"
            label="Employee group"
            labelPosition='top'
            size='large'
            style={{gap: 15}}
          >
            {UserGroups.map(groupName => {
              return <Radio labelPosition='end' key={groupName} value={groupName}>{groupName}</Radio>
            })}
          </RadioGroupField>
        </>
      );
    },
  }
}

export default function App() {
  return (
    <Authenticator signUpAttributes={['custom:groupName'] as any[]} formFields={formFields} components={components} services={services}>
    <Authenticator.Provider>
      <WebsocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LocalTestPage />} />
                <Route path='/registration' element={<RegistrationPage />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WebsocketProvider>
        <ToastContainer />
    </Authenticator.Provider>
    </Authenticator>
  );
}
