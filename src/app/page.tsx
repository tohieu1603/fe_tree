import { Category, ApiResponse } from '@/types';
import NavigationBar from '@/components/home/NavigationBar';
import HeroSection from '@/components/home/HeroSection';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import EditorialBanner from '@/components/home/EditorialBanner';
import ServiceSection from '@/components/home/ServiceSection';
import FooterSection from '@/components/home/FooterSection';
import ThemeSwitcher from '@/components/home/ThemeSwitcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<Category[]> = await res.json();
    return data.data.filter(cat => cat.sortOrder >= 10);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar categories={categories} />
      <HeroSection />
      <CategoryShowcase categories={categories} />
      <EditorialBanner />
      <ServiceSection />
      <FooterSection />
      <ThemeSwitcher />
    </div>
  );
}
