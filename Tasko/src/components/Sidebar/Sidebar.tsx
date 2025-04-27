import React from 'react';
import { Home, ListTodo, Settings, Calendar, Timer, Focus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Category } from '../../types';
import { useFocusStore } from '../../stores/focusStore';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  categories,
  isOpen,
  onClose
}) => {
  const { t } = useLanguage();
  const { rewards } = useFocusStore();
  const unlockedRewards = rewards.filter(r => r.unlocked).length;
  
  const mainNavItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'weekly', label: t('weekly'), icon: Calendar },
    { id: 'all', label: t('all_tasks'), icon: ListTodo },
    { id: 'timer', label: 'Timer', icon: Timer },
    { 
      id: 'focus', 
      label: 'Focus',
      icon: Focus,
      badge: `${unlockedRewards}/${rewards.length}`,
      badgeColor: unlockedRewards === rewards.length ? 'bg-violet-500' : 'bg-violet-400'
    },
  ];
  
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };
  
  return (
    <>
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={onClose}
        ></div>
      )}
    
      <aside 
        className={`
          fixed md:sticky top-0 bottom-0 left-0 z-20
          w-64 h-screen md:h-[calc(100vh-4rem)] 
          bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl
          border-r border-white/20 dark:border-dark-700/20
          shadow-xl shadow-violet-500/5
          overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 sticky top-0 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl z-10 border-b border-white/20 dark:border-dark-700/20">
          <h2 className="text-xl font-semibold gradient-text">{t('app.title')}</h2>
        </div>
        
        <nav className="px-3 py-4">
          <div className="mb-6">
            <p className="px-3 mb-2 text-xs font-medium text-violet-500 dark:text-violet-400 uppercase tracking-wider">
              Menu
            </p>
            <ul>
              {mainNavItems.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="mb-1">
                    <button
                      onClick={() => handleTabClick(item.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-xl
                        transition-colors duration-200
                        ${activeTab === item.id 
                          ? 'bg-gradient-to-r from-violet-500/10 to-violet-400/10 dark:from-violet-500/20 dark:to-violet-400/20 text-violet-700 dark:text-violet-300 font-medium' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20'}
                      `}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className={`
                          ${item.badgeColor} text-white text-xs px-2 py-1 rounded-full
                          flex items-center justify-center min-w-[2rem]
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {categories.length > 0 && (
            <div>
              <p className="px-3 mb-2 text-xs font-medium text-violet-500 dark:text-violet-400 uppercase tracking-wider">
                {t('categories')}
              </p>
              <ul>
                {categories.map(category => (
                  <li key={category.id} className="mb-1">
                    <button
                      onClick={() => handleTabClick(category.id)}
                      className={`
                        w-full flex items-center px-3 py-2.5 text-sm rounded-xl
                        transition-colors duration-200
                        ${activeTab === category.id 
                          ? 'bg-gradient-to-r from-violet-500/10 to-violet-400/10 dark:from-violet-500/20 dark:to-violet-400/20 text-violet-700 dark:text-violet-300 font-medium' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20'}
                      `}
                    >
                      <div 
                        className="w-5 h-5 mr-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-6">
            <button
              onClick={() => handleTabClick('settings')}
              className={`
                w-full flex items-center px-3 py-2.5 text-sm rounded-xl
                transition-colors duration-200
                ${activeTab === 'settings'
                  ? 'bg-gradient-to-r from-violet-500/10 to-violet-400/10 dark:from-violet-500/20 dark:to-violet-400/20 text-violet-700 dark:text-violet-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20'}
              `}
            >
              <Settings className="h-5 w-5 mr-3" />
              {t('settings')}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;