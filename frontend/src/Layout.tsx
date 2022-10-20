import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function Layout() {
  return (
    <div>
      <Navbar />
      <div className="container relative flex flex-wrap items-center justify-start p-8 mx-auto lg:justify-between xl:px-0">
        <Outlet />
      </div>
    </div>
  );
}
