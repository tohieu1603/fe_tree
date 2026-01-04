import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/ssr/products';
import { getProductCategories } from '@/lib/ssr/categories';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductTabs from '@/components/ProductTabs';
import ProductGallery from '@/components/ProductGallery';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Khong tim thay san pham' };

  return {
    title: `${product.name} | Tree - Tuong go nghe thuat`,
    description: product.metaDescription || product.summary || `${product.name} - Tuong go dieu khac thu cong`,
    keywords: product.metaKeywords,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.summary,
      type: 'website',
      images: product.featuredImage ? [product.featuredImage] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getProductCategories(),
  ]);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(slug);
  const discount = calculateDiscount(product.price, product.originalPrice);
  const allImages = [product.featuredImage, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="text-xl font-bold text-stone-800">Tree</Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="text-stone-600 hover:text-stone-800">Trang chu</Link>
              <Link href="/products" className="text-stone-600 hover:text-stone-800">San pham</Link>
              <Link href="/about" className="text-stone-600 hover:text-stone-800">Gioi thieu</Link>
              <Link href="/blog" className="text-stone-600 hover:text-stone-800">Blog</Link>
              <Link href="/contact" className="text-stone-600 hover:text-stone-800">Lien he</Link>
            </nav>
            <a href="tel:0123456789" className="text-amber-700 font-medium text-sm">0123 456 789</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-stone-500 mb-6">
          <Link href="/" className="hover:text-stone-700">Trang chu</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-stone-700">San pham</Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-stone-700">
                {product.category.name}
              </Link>
            </>
          )}
        </nav>

        {/* Product Detail */}
        <div className="bg-white rounded-lg p-4 md:p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <ProductGallery images={allImages} productName={product.name} discount={discount} />

            <div>
              {product.category && (
                <Link href={`/category/${product.category.slug}`} className="text-xs text-amber-700 uppercase tracking-wide">
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mt-1 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-500">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-stone-500">(12 danh gia)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl md:text-3xl font-bold text-amber-700">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > (product.price || 0) && (
                  <>
                    <span className="text-lg text-stone-400 line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">-{discount}%</span>
                  </>
                )}
              </div>

              {product.summary && (
                <p className="text-stone-600 mb-6 leading-relaxed">{product.summary}</p>
              )}

              {/* Specs */}
              <div className="border rounded-lg p-4 mb-6 space-y-3 bg-stone-50">
                <h3 className="font-semibold text-stone-800 mb-3">Thong tin san pham</h3>
                {product.sku && <SpecRow label="Ma SP" value={product.sku} />}
                {product.material && <SpecRow label="Chat lieu" value={product.material} />}
                {product.dimensions && <SpecRow label="Kich thuoc" value={product.dimensions} />}
                {product.color && <SpecRow label="Mau sac" value={product.color} />}
                {product.weight && <SpecRow label="Trong luong" value={`${product.weight} kg`} />}
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Tinh trang:</span>
                  <span className={`font-medium ${(product.stockQuantity || 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {(product.stockQuantity || 0) > 0 ? 'Con hang' : 'Het hang'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <a href="tel:0123456789" className="flex-1 bg-amber-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-800 transition text-center">
                  Goi ngay: 0123 456 789
                </a>
                <a href="https://zalo.me/0123456789" target="_blank" rel="noopener noreferrer" className="px-4 py-3 border border-stone-300 rounded-lg hover:border-stone-400 transition flex items-center gap-2">
                  <ZaloIcon />
                  Zalo
                </a>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <TrustBadge title="100%" subtitle="Thu cong" />
                <TrustBadge title="Bao hanh" subtitle="Tron doi" />
                <TrustBadge title="Mien phi" subtitle="Ship noi thanh" />
              </div>
            </div>
          </div>
        </div>

        <ProductTabs description={product.description || ''} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-stone-800 mb-6">San Pham Tuong Tu</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer categories={categories} />
    </div>
  );
}

// ==================== Sub Components ====================

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-stone-500">{label}:</span>
      <span className="font-medium text-stone-700">{value}</span>
    </div>
  );
}

function TrustBadge({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-stone-50 rounded p-3">
      <div className="text-amber-700 font-bold mb-1">{title}</div>
      <div className="text-stone-500">{subtitle}</div>
    </div>
  );
}

function ZaloIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
    </svg>
  );
}

function ProductCard({ product }: { product: { id: string; slug: string; name: string; price?: number; featuredImage?: string } }) {
  return (
    <Link href={`/product/${product.slug}`} className="group bg-white rounded-lg overflow-hidden border border-stone-200 hover:shadow-md transition">
      <div className="relative aspect-square bg-stone-100">
        {product.featuredImage ? (
          <Image src={product.featuredImage} alt={product.name} fill className="object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-stone-800 group-hover:text-amber-700 transition line-clamp-2 mb-1">{product.name}</h3>
        <span className="text-amber-700 font-semibold text-sm">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}

function Footer({ categories }: { categories: { id: string; slug: string; name: string }[] }) {
  return (
    <footer className="bg-stone-800 text-stone-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Tree</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Chuyen cung cap tuong go dieu khac thu cong, tuong Phat, tuong Di Lac, tuong phong thuy.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">San Pham</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="text-stone-400 hover:text-white transition">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Thong Tin</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link href="/about" className="hover:text-white transition">Gioi thieu</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Tin tuc</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Lien he</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Lien He</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>123 Duong ABC, Quan 1, TP.HCM</li>
              <li><a href="tel:0123456789" className="hover:text-white transition">0123 456 789</a></li>
              <li><a href="mailto:info@tree.vn" className="hover:text-white transition">info@tree.vn</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-stone-500">
          © 2025 Tree. Dieu khac tuong go thu cong.
        </div>
      </div>
    </footer>
  );
}
