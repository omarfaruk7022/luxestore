import MinimalHero from './HeroSection';
import { MinimalFeaturedProducts, MinimalBrandValues, MinimalNewArrivals, MinimalTestimonials } from './FeaturedProducts';

export default function MinimalHomePage() {
  return (
    <>
      <MinimalHero />
      <MinimalBrandValues />
      <MinimalFeaturedProducts />
      <MinimalNewArrivals />
      <MinimalTestimonials />
    </>
  );
}
