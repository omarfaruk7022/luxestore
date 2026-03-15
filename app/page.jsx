import HeroSection from '@/components/shop/HeroSection';
import FeaturedCategories from '@/components/shop/FeaturedCategories';
import { FeaturedProducts, BrandValues, NewArrivals, Testimonials } from '@/components/shop/FeaturedProducts';
import CartDrawer from '@/components/cart/CartDrawer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <BrandValues />
      <NewArrivals />
      <Testimonials />
      <CartDrawer />
    </>
  );
}
