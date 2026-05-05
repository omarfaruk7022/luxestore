import { TemplateHomePage } from '@/components/layout/TemplateRenderer';
import CartDrawer from '@/components/cart/CartDrawer';

export default function HomePage() {
  return (
    <>
      <TemplateHomePage />
      <CartDrawer />
    </>
  );
}
