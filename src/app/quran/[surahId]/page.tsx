'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AyahPopup from '@/components/ayahPopup';
import TafsitAndtranslatePopup from '@/components/tafsirAndtranslatePopup';

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  page: number;
}

interface SurahResponse {
  data: { ayahs: Ayah[]; name: string };
}

async function getSurah<T>(url: RequestInfo): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<T>;
}

export default function SurahPage() {
  const params = useParams();
  const router = useRouter();
  const surahId = params.surahId;

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [surahName, setSurahName] = useState<string>('');
  const [openAyah, setOpenAyah] = useState<number | null>(null);
  const [translatedAyah, setTranslatedAyah] = useState<{
    num: number;
    text: string;
  } | null>(null);
  const [tafsirAyah, setTafsirAyah] = useState<{
    num: number;
    text: string;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!surahId) return;
    getSurah<SurahResponse>(
      `https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`
    )
      .then((res) => {
        setAyahs(res.data.ayahs);
        setSurahName(res.data.name);
      })
      .catch(console.error);
  }, [surahId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openAyah !== null &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenAyah(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openAyah]);

  const ayahsByPage = ayahs.reduce((acc, ay) => {
    (acc[ay.page] ||= []).push(ay);
    return acc;
  }, {} as Record<number, Ayah[]>);

  const ayahNumberStyle = `text-xl font-bold border rounded-full mx-2 px-2 py-1
    after:content-[" "] after:absolute after:border-2
    after:bg-white after:rounded-full after:w-2 after:h-2
    after:top-1/2 after:left-0 after:-translate-y-1/2
    after:-translate-x-1/2 before:content-[" "] before:absolute
    before:w-2 before:h-2 before:border-2 before:bg-white
    before:right-0 before:top-1/2 before:-translate-y-1/2
    before:translate-x-1/2 before:rounded-full relative cursor-pointer
    hover:text-green-600 hover:after:bg-green-600 hover:before:bg-green-600
    transition-colors duration-300 ease-in-out active:text-green-800
    active:after:bg-green-800 active:before:bg-green-800 active:scale-90`;

  if (!surahId) return <p>السورة غير موجودة.</p>;

  return (
    <main dir='rtl' className='bg-[#fdfaf3]  font-quran p-6'>
      <div className='max-w-4xl mx-auto' ref={containerRef}>
        <button
          onClick={() => router.back()}
          className='cursor-pointer mb-6 px-2 py-0.5 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition'
        >
          <span className='text-2xl font-bold'>→</span>
        </button>

        <h1 className='text-center text-5xl font-bold text-green-800 mb-10'>
          {surahName}
        </h1>

        {surahName !== 'سُورَةُ التَّوۡبَةِ' && (
          <span className='block text-4xl font-bold text-green-700 mb-4 text-center'>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ{' '}
            {surahName === 'سُورَةُ ٱلْفَاتِحَةِ' && (
              <span className={ayahNumberStyle}> 1</span>
            )}
          </span>
        )}
        <div className='leading-loose text-center text-3xl text-gray-900'>
          {Object.entries(ayahsByPage).map(([page, pageAyahs]) => (
            <div key={page} className='mb-10'>
              {pageAyahs.map((a) => (
                <div key={a.number} className='mb-6 inline text-[1.8rem]'>
                  <span>
                    {surahName === 'سُورَةُ ٱلْفَاتِحَةِ' &&
                    a.numberInSurah === 1
                      ? ''
                      : a.text.startsWith('بِسْمِ ٱللَّهِ')
                      ? a.text.slice(
                          'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'.length
                        )
                      : a.text}
                  </span>
                  <div className='relative inline-block ml-2'>
                    {!(
                      surahName === 'سُورَةُ ٱلْفَاتِحَةِ' &&
                      a.numberInSurah === 1
                    ) && (
                      <button
                        onClick={() =>
                          setOpenAyah(openAyah === a.number ? null : a.number)
                        }
                        className={ayahNumberStyle}
                      >
                        {a.numberInSurah}
                      </button>
                    )}

                    {openAyah === a.number && (
                      <AyahPopup
                        setOpenAyah={setOpenAyah}
                        setTafsirAyah={setTafsirAyah}
                        setTranslatedAyah={setTranslatedAyah}
                        surahId={surahId}
                        a={a}
                      />
                    )}
                  </div>

                  {tafsirAyah?.num === a.numberInSurah && (
                    <TafsitAndtranslatePopup
                      content={tafsirAyah}
                      type='tafsir'
                      onClose={() => setTafsirAyah(null)}
                    />
                  )}

                  {translatedAyah?.num === a.numberInSurah && (
                    <TafsitAndtranslatePopup
                      content={translatedAyah}
                      type='translate'
                      onClose={() => setTranslatedAyah(null)}
                    />
                  )}
                </div>
              ))}
              <p className='text-sm text-gray-600 mt-6'>صفحة {page}</p>
              <hr className='my-6 border-green-300' />
            </div>
          ))}
        </div>
        <div className='flex justify-between'>
          <button
            onClick={() => {
              if (surahName === 'سُورَةُ ٱلْفَاتِحَةِ')
                router.replace(`/quran/114`);
              else router.replace(`/quran/${Number(surahId) - 1}`);
            }}
            className='cursor-pointer mb-6 px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition'
          >
            <span className='text-2xl font-bold'>→</span> السورة السابقة
          </button>
          <button
            onClick={() => {
              if (surahName === 'سُورَةُ النَّاسِ') router.replace(`/quran/1`);
              else router.replace(`/quran/${Number(surahId) + 1}`);
            }}
            className='cursor-pointer mb-6 px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition'
          >
            السورة التالية <span className='text-2xl font-bold'> ←</span>
          </button>
        </div>
      </div>
    </main>
  );
}
