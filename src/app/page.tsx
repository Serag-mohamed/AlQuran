'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Surah = {
  number: number;
  name: string;
  englishName: string;
  revelationType: string; // "Meccan" أو "Medinan"
  numberOfAyahs: number;
};

export default function Quran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then((res) => res.json())
      .then((data) => {
        setSurahs(data.data);
        setLoading(false);
      });
  }, []);

  return (
    <div className='container mx-auto px-6 py-10'>
      <div className="text-center mb-10 border-b-2 border-gray-300 pb-14" dir="rtl">
      <h2 className="text-4xl font-semibold text-green-800">
        أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَا
      </h2>
      <div className="mt-4 flex justify-center">
    <div className="text-sm text-gray-600 border border-gray-400 px-3 py-1 rounded-md ms-32">
      صدق الله العظيم
    </div>
  </div>
</div>




      {loading ? (
        <p className='text-gray-600'>جاري التحميل...</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {surahs.map((surah) => (
            <Link
              key={surah.number}
              href={`/quran/${surah.number}`}
              className='bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden'
            >
              {/* صورة تعبيرية */}
              <div className='h-40 bg-green-50 flex items-center justify-center'>
                <span className='text-5xl text-green-300'>﷽</span>
              </div>

              <div className='p-4'>
                <h3 className='text-2xl font-bold text-green-700'>
                  {surah.name}
                </h3>
                <p className='text-gray-600'>{surah.englishName}</p>
                <div className='flex justify-between items-center mt-2 text-sm text-gray-500'>
                  <span>
                    مكان النزول:{' '}
                    {surah.revelationType === 'Meccan'
                      ? 'مكة المكرمة'
                      : 'المدينة'}
                  </span>
                  <span>عدد الآيات: {surah.numberOfAyahs}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
