import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
