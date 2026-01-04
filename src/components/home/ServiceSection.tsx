'use client';

import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    id: 1,
    image: '/uploads/products/vong-tay-tram-huong-2.jpg',
    title: 'GIAO HÀNG TẬN NƠI',
    description: 'Miễn phí giao hàng toàn quốc cho đơn hàng từ 2 triệu đồng. Đóng gói cẩn thận, bảo quản nguyên vẹn.',
    link: '/about',
    linkText: 'Tìm Hiểu Thêm',
  },
  {
    id: 2,
    image: '/uploads/products/tuong-phat-tram-huong-1.jpg',
    title: 'TƯ VẤN CHUYÊN GIA',
    description: 'Đội ngũ chuyên gia trầm hương tư vấn miễn phí, giúp bạn chọn sản phẩm phù hợp với nhu cầu và ngân sách.',
    link: '/contact',
    linkText: 'Liên Hệ Ngay',
  },
  {
    id: 3,
    image: '/uploads/products/nhang-tram-huong.jpg',
    title: 'BẢO HÀNH TRỌN ĐỜI',
    description: 'Cam kết bảo hành trọn đời cho tất cả sản phẩm trầm hương. Đổi trả trong 30 ngày nếu không hài lòng.',
    link: '/warranty',
    linkText: 'Chính Sách Bảo Hành',
  },
];

export default function ServiceSection() {
  return (
    <section className="bg-white py-20 md:py-32">
      {/* Title */}
      <div className="text-center mb-16 md:mb-20">
        <h2
          className="text-xl md:text-2xl tracking-[0.2em] uppercase font-light"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          DỨC VIỆT SERVICES
        </h2>
      </div>

      {/* 3 Services Grid */}
      <div className="px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {services.map((service) => (
            <div key={service.id} className="group text-center">
              {/* Service Image with play button overlay style */}
              <div className="relative aspect-square overflow-hidden bg-[#f5f5f5] mb-8">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Play button overlay like Gucci */}
                <div className="absolute top-4 right-4">
                  <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-black ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Service Title */}
              <h3
                className="text-sm md:text-base tracking-[0.15em] uppercase font-medium mb-4"
              >
                {service.title}
              </h3>

              {/* Service Description */}
              <p
                className="text-[13px] md:text-sm leading-relaxed text-gray-600 mb-6 max-w-sm mx-auto"
              >
                {service.description}
              </p>

              {/* Link with underline */}
              <Link
                href={service.link}
                className="inline-block text-[13px] tracking-[0.05em] underline underline-offset-4 hover:no-underline transition-all"
              >
                {service.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
