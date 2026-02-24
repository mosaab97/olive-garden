import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/common/ProductCard';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const Home = () => {
  const { products, loading, fetchAll } = useProducts();

  useEffect(() => { fetchAll({ active: true }); }, []);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-20 px-4">
        <p className="text-earth-500 text-sm font-medium uppercase tracking-widest mb-3">
          Handcrafted in Illinois
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-olive-900 mb-5 leading-tight">
          Olives Worth<br />Savoring
        </h1>
        <p className="text-olive-500 text-lg max-w-xl mx-auto mb-8">
          Premium olives stuffed with carrot, labaneh, cheese, and more.
          Shipped fresh across the Midwest.
        </p>
        <Link to="/products">
          <Button size="lg">Shop Now</Button>
        </Link>
      </section>

      {/* Products */}
      <section className="py-10">
        <h2 className="font-serif text-3xl text-olive-900 mb-8 text-center">Our Products</h2>
        {loading ? (
          <Spinner className="py-16" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        {products.length > 6 && (
          <div className="text-center mt-10">
            <Link to="/products"><Button variant="outline">View All Products</Button></Link>
          </div>
        )}
      </section>

      {/* Why us */}
      <section className="bg-olive-50 rounded-2xl p-10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { icon: '🫒', title: 'Handcrafted', desc: 'Made in small batches with fresh, quality ingredients.' },
          { icon: '📦', title: 'Shipped Fresh', desc: 'Carefully packed and shipped across Illinois and surrounding states.' },
          { icon: '🎁', title: 'Gift Ready', desc: 'Perfect for charcuterie boards, entertaining, or gifting.' },
        ].map(({ icon, title, desc }) => (
          <div key={title}>
            <p className="text-4xl mb-3">{icon}</p>
            <h3 className="font-semibold text-olive-800 mb-1">{title}</h3>
            <p className="text-sm text-olive-500">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
