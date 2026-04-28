import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout wrapper for public pages (Home, Login, SignUp).
 * Renders the shared Header and Footer around the page content.
 */
export default function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
