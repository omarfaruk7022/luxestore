import LuxeHero from './HeroSection';
import LuxeCategories from './FeaturedCategories';
import { FeaturedProducts, BrandValues, NewArrivals, Testimonials } from './FeaturedProducts';

export default function LuxeHomePage() {
  return (
    <>
      <LuxeHero />
      <LuxeCategories />
      <FeaturedProducts />
      <BrandValues />
      <NewArrivals />
      <Testimonials />
    </>
  );
}
