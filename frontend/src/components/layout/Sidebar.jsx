import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, FileText, Users, Home, Settings, Hash } from 'lucide-react';

const Sidebar = ({ isOpen, setSidebarOpen }) => {
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Teams', icon: Users, path: '/teams' },
    { name: 'Channels', icon: Hash, path: '/channels' },
    { name: 'Documents', icon: FileText, path: '/documents' },
    { name: 'Direct Messages', icon: MessageSquare, path: '/messages' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen transition-transform duration-300 ease-in-out transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 pt-20 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="mb-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors duration-200`} />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}

          <div className="mt-8 mb-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-between items-center group">
            <span>Your Teams</span>
            <button className="text-blue-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">+</button>
          </div>
          {/* Example Team Items */}
          <div className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
            <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mr-3 font-semibold text-xs border border-indigo-500/30">D</div>
            Design Team
          </div>
          <div className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mr-3 font-semibold text-xs border border-emerald-500/30">E</div>
            Engineering
          </div>

        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <NavLink
            to="/settings"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
