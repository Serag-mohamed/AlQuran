'use client';

import { useEffect, useRef } from 'react';
interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  page: number;
}
interface Props {
  a: Ayah;
  surahId: string | string[];
  setOpenAyah: (num: number | null) => void;
  setTafsirAyah: (t: { num: number; text: string } | null) => void;
  setTranslatedAyah: (t: { num: number; text: string } | null) => void;
}

export default function AyahPopup({
  a,
  surahId,
  setOpenAyah,
  setTafsirAyah,
  setTranslatedAyah,
}: Props) {
  const popupRef = useRef<HTMLUListElement>(null);

  const play = async () => {
    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${a.number}/ar.alafasy`
    );
    const j = await res.json();
    const url = j.data.audioSecondary?.[0] || j.data.audio;
    new Audio(url).play();
    setOpenAyah(null);
  };

  const translate = async () => {
    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surahId}:${a.numberInSurah}/en.asad`
    );
    const j = await res.json();
    setTranslatedAyah({ num: a.numberInSurah, text: j.data.text });
    setTafsirAyah(null);
    setOpenAyah(null);
  };

  const tafsir = async () => {
    try {
      const res = await fetch(
        `https://dev0kch.github.io/tfasir_iben_kathir/${surahId}.json`
      );
      if (!res.ok) throw new Error('تعذّر تحميل التفسير');
      const data = await res.json();
      const tafEntry = data.ayets.find(
        (t: { id: number; tafsir: string }) => t.id === a.numberInSurah
      );
      if (tafEntry) {
        setTafsirAyah({ num: a.numberInSurah, text: tafEntry.tafsir });
        setTranslatedAyah(null);
      }
      setOpenAyah(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpenAyah(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul
      ref={popupRef}
      className='absolute text-2xl bg-white rounded-lg top-full mt-2 left-1/2 transform -translate-x-1/2 w-28 text-right z-50 border-2 border-gray-300 shadow-lg'
    >
      <li>
        <button
          onClick={play}
          className='block w-full p-2 hover:text-green-800'
        >
          تشغيل
        </button>
      </li>
      <hr className='border-gray-300' />
      <li>
        <button
          onClick={tafsir}
          className='block w-full p-2 hover:text-green-800'
        >
          تفسير
        </button>
      </li>
      <hr className='border-gray-300' />
      <li>
        <button
          onClick={translate}
          className='block w-full p-2 hover:text-green-800'
        >
          ترجمة
        </button>
      </li>
    </ul>
  );
}
