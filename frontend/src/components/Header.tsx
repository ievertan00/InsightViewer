import { User, Settings, Bell, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 md:ml-64 sticky top-0 z-30">
      <div className="flex items-center">
        <button className="mr-4 md:hidden text-gray-500">
            <Menu className="w-6 h-6" />
        </button>
        {/* Breadcrumb or Page Title could go here */}
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-primary transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            U
          </div>
          <span className="text-sm font-medium text-gray-700">User</span>
        </div>
      </div>
    </header>
  );
}
