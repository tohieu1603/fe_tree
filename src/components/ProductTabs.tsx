'use client';

import { useState } from 'react';

interface ProductTabsProps {
  description: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
}

// Placeholder reviews - in production, fetch from API
const placeholderReviews: Review[] = [
  {
    id: 1,
    name: 'Nguyen Van A',
    rating: 5,
    date: '15/12/2024',
    comment: 'San pham rat dep, dieu khac tinh xao. Giao hang nhanh, dong goi can than. Se ung ho shop tiep.',
  },
  {
    id: 2,
    name: 'Tran Thi B',
    rating: 5,
    date: '10/12/2024',
    comment: 'Tuong go chat luong tot, mau sac tu nhien. Rat hai long voi san pham nay.',
  },
  {
    id: 3,
    name: 'Le Van C',
    rating: 4,
    date: '05/12/2024',
    comment: 'Tuong dep, nhung giao hang hoi cham. Nhin chung van hai long.',
  },
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? 'text-amber-500' : 'text-stone-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductTabs({ description }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  const averageRating = placeholderReviews.reduce((sum, r) => sum + r.rating, 0) / placeholderReviews.length;

  return (
    <div className="bg-white rounded-lg border border-stone-200">
      {/* Tab Headers */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex-1 py-4 px-6 text-center font-medium transition ${
            activeTab === 'description'
              ? 'text-amber-700 border-b-2 border-amber-700 bg-amber-50/50'
              : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          Mo ta san pham
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center gap-2 ${
            activeTab === 'reviews'
              ? 'text-amber-700 border-b-2 border-amber-700 bg-amber-50/50'
              : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          Danh gia
          <span className="bg-stone-200 text-stone-600 text-xs px-2 py-0.5 rounded-full">
            {placeholderReviews.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' ? (
          <div className="prose prose-stone max-w-none">
            <div
              className="text-stone-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description || '<p>Chua co mo ta chi tiet cho san pham nay.</p>' }}
            />

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="font-semibold text-stone-800 mb-3">Thong tin chi tiet</h4>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li className="flex justify-between">
                    <span>Chat lieu:</span>
                    <span className="font-medium text-stone-800">Go tu nhien</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Xuat xu:</span>
                    <span className="font-medium text-stone-800">Viet Nam</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Bao hanh:</span>
                    <span className="font-medium text-stone-800">12 thang</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Hinh thuc:</span>
                    <span className="font-medium text-stone-800">Dieu khac thu cong</span>
                  </li>
                </ul>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="font-semibold text-stone-800 mb-3">Huong dan bao quan</h4>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Dat noi kho rao, tranh anh sang truc tiep</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Lau bui bang vai mem, kho</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Tranh tiep xuc voi nuoc hoac do am cao</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Co the danh vecni dinh ky de bao ve go</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Rating Summary */}
            <div className="flex items-center gap-6 pb-6 border-b border-stone-200 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-stone-800">{averageRating.toFixed(1)}</div>
                <StarRating rating={Math.round(averageRating)} size="md" />
                <div className="text-sm text-stone-500 mt-1">{placeholderReviews.length} danh gia</div>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = placeholderReviews.filter((r) => r.rating === stars).length;
                  const percentage = (count / placeholderReviews.length) * 100;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-stone-600">{stars}</span>
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-stone-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {placeholderReviews.map((review) => (
                <div key={review.id} className="border-b border-stone-100 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-semibold">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-stone-800">{review.name}</span>
                        <span className="text-sm text-stone-400">{review.date}</span>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="mt-2 text-stone-600">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Write Review Button */}
            <div className="mt-6 pt-6 border-t border-stone-200">
              <button className="w-full py-3 border-2 border-amber-700 text-amber-700 font-semibold rounded-lg hover:bg-amber-50 transition">
                Viet danh gia
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
