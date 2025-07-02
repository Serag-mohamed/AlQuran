export default function Loading() {
  return (
    <main
      dir='rtl'
      className='min-h-screen flex flex-col items-center justify-center bg-[#fdfaf3] text-green-800 font-bold text-xl'
    >
      <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mb-6'></div>
      <p>جارٍ التحميل، الرجاء الانتظار...</p>
    </main>
  );
}
