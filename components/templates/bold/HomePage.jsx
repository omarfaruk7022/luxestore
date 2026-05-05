import BoldHero from './HeroSection';
import { BoldFeaturedProducts, BoldBrandValues, BoldNewArrivals, BoldTestimonials } from './FeaturedProducts';

export default function BoldHomePage() {
  return (
    <>
      <BoldHero />
      <BoldBrandValues />
      <BoldFeaturedProducts />
      <BoldNewArrivals />
      <BoldTestimonials />
    </>
  );
}
