import { Link, useNavigate } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { Button, useAuthenticator } from '@aws-amplify/ui-react';
import ServiceWorkerSubscription from './SWSubscription';
import WebSocketSubscription from './WSsubscription';

export default function Navbar() {
  const { route, signOut } = useAuthenticator(context => [context.route, context.signOut]);
  const navigation: {label: string, route: string}[] = [];
  if (route === 'authenticated') {
    navigation.push({ label: 'Admin', route: '/admin' });
  }

  const navigate = useNavigate();

  function logOut() {
    signOut();
    navigate('/');
  }

  return (
    <div className="w-full">
      <nav className="container relative flex flex-wrap items-center justify-start p-8 mx-auto lg:justify-between xl:px-0">
        {/* Logo  */}
        <Disclosure>
          {({ open }: {open: boolean}) => (
            <>
              <div className="flex flex-wrap items-center justify-start w-full lg:w-auto">
                <Link to="/" className="flex items-center space-x-2 text-2xl font-medium text-gray-900 dark:text-gray-100">
                    <span>Notifications Demo App</span>
                </Link>

                <div className="hidden text-left lg:flex lg:items-center ml-10">
                  <ul className="items-left justify-start flex-1 pt-6 list-none lg:pt-0 lg:flex">
                    {navigation.map((menu, index) => (
                      <li className="mr-3 nav__item" key={index}>
                        <Link to={menu.route} className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                            {menu.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="px-2 py-1 ml-auto text-gray-900 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700"
                >
                  <svg
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    {open && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    )}
                    {!open && (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="flex flex-wrap w-full text-left my-5 lg:hidden">
                  <>
                    {navigation.map((item, index) => (
                      <Link key={index} to={item.route}>
                        <a className="w-full px-4 py-2 -ml-4 text-gray-900 rounded-md dark:text-gray-900 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none dark:focus:bg-trueGray-700">
                          {item.label}
                        </a>
                      </Link>
                    ))}
                      <Button
                        onClick={logOut}
                        className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5"
                      >
                        Logout
                      </Button>

                      <ServiceWorkerSubscription />
                      <WebSocketSubscription />
                  </>
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>

        <div className="hidden mr-3 space-x-4 lg:flex nav__item">
        <ServiceWorkerSubscription />
        <WebSocketSubscription />
            <Button
              onClick={logOut}
              className="px-6 py-2 text-white bg-indigo-600 rounded-md md:ml-5"
            >
              Logout
            </Button>
        </div>
      </nav>
    </div>
  );
}
