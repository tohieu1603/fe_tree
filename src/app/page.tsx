import { Category, ApiResponse } from '@/types';
import NavigationBar from '@/components/home/NavigationBar';
import HeroSection from '@/components/home/HeroSection';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import EditorialBanner from '@/components/home/EditorialBanner';
import ServiceSection from '@/components/home/ServiceSection';
import FooterSection from '@/components/home/FooterSection';

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

export const metadata = {
  title: 'Trầm Hương - Tinh Hoa Thiên Nhiên Việt Nam',
  description: 'Chuyên cung cấp vòng tay trầm hương, tượng phật, nhang trầm, tinh dầu trầm hương thiên nhiên 100%. Nghệ thuật thủ công truyền thống.',
  openGraph: {
    title: 'Trầm Hương - Tinh Hoa Thiên Nhiên Việt Nam',
    description: 'Vòng tay trầm hương, tượng phật, nhang trầm cao cấp - Nghệ thuật thủ công',
    type: 'website',
  },
};

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <NavigationBar categories={categories} />

      {/* Hero - Full screen with TRẦM HƯƠNG logo */}
      <HeroSection />

      {/* 4 Category Grid - Giống Gucci */}
      <CategoryShowcase categories={categories} />

      {/* Editorial Banner - Full width image */}
      <EditorialBanner />

      {/* Service Section - Giống Gucci Services */}
      <ServiceSection />

      {/* Footer với logo to */}
      <FooterSection />
    </div>
  );
}
