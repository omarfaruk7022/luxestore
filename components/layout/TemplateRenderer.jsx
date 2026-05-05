'use client';
import dynamic from 'next/dynamic';
import { useStore } from '@/components/layout/StoreProvider';

// ── Loading skeletons ────────────────────────────────────────────────────────
const NavbarSkeleton = () => <div className="h-16 bg-background border-b" />;
const FooterSkeleton = () => <div className="h-32 bg-card border-t" />;
const PageSkeleton = () => <div className="min-h-screen" />;

// ── Luxe ─────────────────────────────────────────────────────────────────────
const LuxeNavbar = dynamic(() => import('@/components/templates/luxe/Navbar'), {
  loading: NavbarSkeleton, ssr: false,
});
const LuxeFooter = dynamic(() => import('@/components/templates/luxe/Footer'), {
  loading: FooterSkeleton, ssr: false,
});
const LuxeHomePage = dynamic(() => import('@/components/templates/luxe/HomePage'), {
  loading: PageSkeleton, ssr: false,
});

// ── Minimal ───────────────────────────────────────────────────────────────────
const MinimalNavbar = dynamic(() => import('@/components/templates/minimal/Navbar'), {
  loading: NavbarSkeleton, ssr: false,
});
const MinimalFooter = dynamic(() => import('@/components/templates/minimal/Footer'), {
  loading: FooterSkeleton, ssr: false,
});
const MinimalHomePage = dynamic(() => import('@/components/templates/minimal/HomePage'), {
  loading: PageSkeleton, ssr: false,
});

// ── Bold ──────────────────────────────────────────────────────────────────────
const BoldNavbar = dynamic(() => import('@/components/templates/bold/Navbar'), {
  loading: NavbarSkeleton, ssr: false,
});
const BoldFooter = dynamic(() => import('@/components/templates/bold/Footer'), {
  loading: FooterSkeleton, ssr: false,
});
const BoldHomePage = dynamic(() => import('@/components/templates/bold/HomePage'), {
  loading: PageSkeleton, ssr: false,
});

// ── Nature ────────────────────────────────────────────────────────────────────
const NatureNavbar = dynamic(() => import('@/components/templates/nature/Navbar'), {
  loading: NavbarSkeleton, ssr: false,
});
const NatureFooter = dynamic(() => import('@/components/templates/nature/Footer'), {
  loading: FooterSkeleton, ssr: false,
});
const NatureHomePage = dynamic(() => import('@/components/templates/nature/HomePage'), {
  loading: PageSkeleton, ssr: false,
});

// ── Template map ──────────────────────────────────────────────────────────────
const TEMPLATES = {
  luxe:    { Navbar: LuxeNavbar,    Footer: LuxeFooter,    HomePage: LuxeHomePage    },
  minimal: { Navbar: MinimalNavbar, Footer: MinimalFooter, HomePage: MinimalHomePage },
  bold:    { Navbar: BoldNavbar,    Footer: BoldFooter,    HomePage: BoldHomePage    },
  nature:  { Navbar: NatureNavbar,  Footer: NatureFooter,  HomePage: NatureHomePage  },
};

function useTemplate() {
  const { settings } = useStore();
  const key = settings?.activeTemplate || 'luxe';
  return TEMPLATES[key] || TEMPLATES.luxe;
}

export function TemplateNavbar() {
  const { Navbar } = useTemplate();
  return <Navbar />;
}

export function TemplateFooter() {
  const { Footer } = useTemplate();
  return <Footer />;
}

export function TemplateHomePage() {
  const { HomePage } = useTemplate();
  return <HomePage />;
}
