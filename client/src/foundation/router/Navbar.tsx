import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../context';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-ios" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-xl font-bold text-ios-blue dark:text-blue-400 transition-colors"
            >
              Clean Architecture
            </Link>
            <div className="hidden md:flex space-x-4" role="menubar">
              <Link
                to="/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-ios-blue dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="menuitem"
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className="text-gray-700 dark:text-gray-300 hover:text-ios-blue dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="menuitem"
              >
                Tasks
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 dark:text-gray-300 hover:text-ios-blue dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="menuitem"
              >
                Profile
              </Link>
              <Link
                to="/comparison"
                className="text-gray-700 dark:text-gray-300 hover:text-ios-blue dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="menuitem"
              >
                Comparison
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300" aria-label="Current user">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-ios-red hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
