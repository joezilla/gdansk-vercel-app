import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-600 dark:text-gray-400 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-500 dark:text-gray-500 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link href="/" className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300">
          Go back home
        </Link>
      </div>
    </div>
  )
}