interface Props {
  content: {
    num: number;
    text: string;
  } | null;
  type: 'tafsir' | 'translate'; // النوع: تفسير أو ترجمة
  onClose: () => void;
}

export default function TafsirAndTranslatePopup({
  content,
  type,
  onClose,
}: Props) {
  if (!content) return null;

  const title =
    type === 'tafsir'
      ? `تفسير الآية ${content.num}`
      : `ترجمة الآية ${content.num}`;

  const titleColor = type === 'tafsir' ? 'text-green-800' : 'text-blue-800';

  return (
    <div className='mt-4 p-4 bg-white border rounded-lg shadow-md text-right'>
      <div className='flex justify-between items-center mb-2'>
        <p className={`font-bold text-xl ${titleColor}`}>{title}</p>
        <button onClick={onClose} className='text-red-600 font-bold'>
          ✖
        </button>
      </div>
      <p className='leading-relaxed text-xl'>{content.text}</p>
    </div>
  );
}
