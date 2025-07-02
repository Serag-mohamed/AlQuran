import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='bg-white shadow-lg sticky top-0 z-50'>
      <div className='container mx-auto px-6 py-5 flex items-center justify-between'>
        <Link
          href='/'
          className='text-3xl font-semibold text-green-700 hover:text-green-800 transition-colors duration-300'
        >
          القرآن الكريم
        </Link>
      </div>
    </nav>
  );
}
