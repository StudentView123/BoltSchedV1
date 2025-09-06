import React, { useState } from 'react';
import { Menu, Calendar, Users, UserPlus, Home, BarChart, Settings } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/schedule', label: 'Schedule', icon: <Calendar className="w-5 h-5" /> },
    { path: '/providers', label: 'Providers', icon: <UserPlus className="w-5 h-5" /> },
    { path: '/staff', label: 'Staff', icon: <Users className="w-5 h-5" /> },
    { path: '/reports', label: 'Reports', icon: <BarChart className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center flex-shrink-0 ml-2 md:ml-0">
              <span className="text-blue-600 text-xl font-bold">EyeScheduler</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <span className="text-sm text-gray-700 mr-2">Dr. Admin</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for larger screens */}
        <aside
          className={`bg-white border-r border-gray-200 w-64 fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition duration-200 ease-in-out md:static md:h-auto z-20 pt-16 md:pt-0`}
        >
          <div className="h-full overflow-y-auto py-4">
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (isSidebarOpen) setIsSidebarOpen(false);
                  }}
                  className={`${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-3 text-sm font-medium rounded-md w-full transition-colors duration-150`}
                >
                  <div className="mr-3">{item.icon}</div>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;