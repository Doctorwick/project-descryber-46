import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Descryber Logo" className="h-8 w-auto animate-float" />
              <span className="ml-2 text-xl font-semibold text-purple-600">Descryber</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/simulation"
              className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Try Demo
            </Link>
            <Link
              to="/history"
              className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              History
            </Link>
          </div>
          {/* Mobile menu */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-600 hover:text-purple-600 p-2"
              onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu panel */}
      <div className="hidden md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            to="/simulation"
            className="block text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
          >
            Try Demo
          </Link>
          <Link
            to="/history"
            className="block text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
          >
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}