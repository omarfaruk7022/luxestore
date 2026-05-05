import NatureHero from './HeroSection';
import { NatureFeaturedProducts, NatureBrandValues, NatureNewArrivals, NatureTestimonials } from './FeaturedProducts';

export default function NatureHomePage() {
  return (
    <>
      <NatureHero />
      <NatureFeaturedProducts />
      <NatureBrandValues />
      <NatureNewArrivals />
      <NatureTestimonials />
    </>
  );
}
