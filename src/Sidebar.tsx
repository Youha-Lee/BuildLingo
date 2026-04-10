import React from 'react';
import { Home, Search, Star, Clock, BarChart3, BookOpen, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'status', label: 'Study Status', icon: BarChart3 },
];

const secondaryItems = [
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-slate-50/50 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">BuildLingo</span>
        </div>

        <nav className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t bg-white/50">
        <nav className="space-y-1">
          {secondaryItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-6 p-4 bg-blue-600 rounded-xl text-white">
          <p className="text-xs font-medium opacity-80 mb-1">Pro Plan</p>
          <p className="text-sm font-bold mb-3">Unlimited AI Insights</p>
          <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
