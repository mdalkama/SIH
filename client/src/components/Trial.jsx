import React, { useState } from 'react';
import {
    Menu,
    X,
    Home,
    Folder,
    Users,
    Settings,
    Bell,
    Search,
    User,
    ChevronDown,
    Plus,
    Filter,
    MoreHorizontal
} from 'lucide-react';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('projects');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'projects', label: 'Projects', icon: Folder },
        { id: 'teams', label: 'Teams', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const sampleComponents = [
        { id: 1, name: 'Header Component', type: 'React', status: 'Active', updated: '2 hours ago' },
        { id: 2, name: 'Navigation Bar', type: 'React', status: 'In Progress', updated: '5 hours ago' },
        { id: 3, name: 'User Profile Card', type: 'React', status: 'Review', updated: '1 day ago' },
        { id: 4, name: 'Data Table', type: 'React', status: 'Active', updated: '2 days ago' },
        { id: 5, name: 'Modal Dialog', type: 'React', status: 'Active', updated: '3 days ago' },
        { id: 6, name: 'Form Validator', type: 'React', status: 'Testing', updated: '1 week ago' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Review': return 'bg-yellow-100 text-yellow-800';
            case 'Testing': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
                <div className="px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Left side */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                            >
                                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>

                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">J</span>
                                </div>
                                <span className="font-semibold text-gray-900 hidden sm:block">Jira Clone</span>
                            </div>

                            {/* Search bar */}
                            <div className="hidden md:block relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
                                <Bell className="h-5 w-5" />
                            </button>

                            <div className="relative">
                                <button className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex pt-16">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-16 
          lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-200 ease-in-out`}>

                    <div className="h-full px-4 py-6 overflow-y-auto">
                        <nav className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveMenu(item.id)}
                                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                                            ${activeMenu === item.id
                                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Project Section */}
                        <div className="mt-8">
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Recent Projects
                            </h3>
                            <div className="mt-2 space-y-1">
                                {['Component Library', 'Dashboard UI', 'Mobile App'].map((project) => (
                                    <a key={project} href="#" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
                                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-3"></span>
                                        <span className="truncate">{project}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 lg:pl-0">
                    <div className="px-6 py-8">
                        {/* Page Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Components</h1>
                                    <p className="mt-1 text-sm text-gray-600">Manage your React components and their status</p>
                                </div>
                                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Component
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="mb-6 flex items-center space-x-4">
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </button>
                            <select className="block w-40 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
                                <option>All Status</option>
                                <option>Active</option>
                                <option>In Progress</option>
                                <option>Review</option>
                                <option>Testing</option>
                            </select>
                        </div>

                        {/* Components List */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {sampleComponents.map((component) => (
                                    <li key={component.id} className="hover:bg-gray-50">
                                        <div className="px-6 py-4 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Folder className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {component.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {component.type} • Updated {component.updated}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(component.status)}`}>
                                                    {component.status}
                                                </span>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{' '}
                                <span className="font-medium">6</span> results
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-not-allowed opacity-50">
                                    Previous
                                </button>
                                <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                                    1
                                </button>
                                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-not-allowed opacity-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}
        </div>
    );
};

export default Dashboard;