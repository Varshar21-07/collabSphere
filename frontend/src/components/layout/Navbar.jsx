import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Bell, Search, User, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="glass sticky top-0 z-40 w-full flex-none transition-colors duration-500 lg:z-50 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-8xl mx-auto">
        <div className="py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 px-4">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent hidden sm:block">
                CollabSphere
              </h1>
            </div>
            
            <div className="flex px-4 items-center gap-2 md:gap-4 flex-1 justify-end">
              <div className="hidden md:flex relative group max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search across workspace..." 
                  className="w-full bg-gray-100 dark:bg-gray-800/50 text-sm rounded-full pl-10 pr-4 py-2 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                />
              </div>

              <button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative transition-colors duration-200">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </button>

              <button 
                onClick={toggleTheme} 
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                <User size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
