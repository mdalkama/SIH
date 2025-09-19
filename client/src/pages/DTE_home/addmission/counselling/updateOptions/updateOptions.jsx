import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  RotateCcw, 
  Save, 
  Lock, 
  AlertCircle,
  CheckCircle,
  Clock,
  GraduationCap,
  Filter,
  Building
} from 'lucide-react';

const UpdateOptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState(['All']);
  const [programs, setPrograms] = useState([
    {
      id: 1,
      name: 'IIT • B.Tech Computer Science',
      rank: 'AI Rank: N/A',
      status: 'Open',
      type: 'IIT',
      action: 'add'
    },
    {
      id: 2,
      name: 'IIT • B.Tech Artificial Intelligence',
      rank: 'AI Rank: 220',
      status: 'Open',
      type: 'IIT',
      action: 'add'
    },
    {
      id: 3,
      name: 'NIT • B.Tech Computer Science',
      rank: 'AI Rank: 340',
      status: 'Open',
      type: 'NIT',
      action: 'remove'
    },
    {
      id: 4,
      name: 'NIT • B.Tech Information Technology',
      rank: 'AI Rank: 380',
      status: 'Open',
      type: 'NIT',
      action: 'remove'
    }
  ]);

  const filters = ['All', 'IIT', 'NIT', 'Govt', 'Private'];

  const handleFilterChange = (filter) => {
    if (filter === 'All') {
      setSelectedFilters(['All']);
    } else {
      const newFilters = selectedFilters.filter(f => f !== 'All');
      if (selectedFilters.includes(filter)) {
        const updated = newFilters.filter(f => f !== filter);
        setSelectedFilters(updated.length === 0 ? ['All'] : updated);
      } else {
        setSelectedFilters([...newFilters, filter]);
      }
    }
  };

  const addedPrograms = programs.filter(p => p.action === 'add');
  const removedPrograms = programs.filter(p => p.action === 'remove');

  return (
    <div className="w-full max-w-screen-2xl mx-auto py-1 px-1 sm:px-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Update Options</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Modify your preference list for upcoming counselling rounds</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Eligible Programs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Eligible Programs</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Round 2 Window</span>
              </div>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Add or remove options for upcoming upward movement rounds.</strong>
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Changes take effect only after you lock and submit at the bottom.
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      selectedFilters.includes(filter)
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search programs, institute or branch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Programs List */}
            <div className="space-y-3">
              {programs.map((program) => (
                <div key={program.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{program.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{program.rank}</span>
                      <span>{program.status}</span>
                    </div>
                  </div>
                  <button 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      program.action === 'add'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {program.action === 'add' ? (
                      <>
                        <Plus className="h-4 w-4" />
                        Add
                      </>
                    ) : (
                      <>
                        <Minus className="h-4 w-4" />
                        Remove
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-100">
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <RotateCcw className="h-4 w-4" />
                <span className="text-sm font-medium">Revert Changes</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Save className="h-4 w-4" />
                <span className="font-medium">Save Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3 sm:space-y-4">
          {/* Current Allotment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Current Allotment</h3>
              <span className="text-xs text-green-600">Held</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Program</p>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <p className="font-semibold text-gray-900">NTU • B.Tech Computer Science</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-600 mb-1">Window</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-700">Update allowed until 7:00 PM today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Changes Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Changes Summary</h3>
              <span className="text-xs text-blue-600">Draft</span>
            </div>
            
            <div className="space-y-4">
              {addedPrograms.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">Added:</p>
                  <div className="space-y-1">
                    {addedPrograms.map((program) => (
                      <p key={program.id} className="text-sm text-green-700 bg-green-50 px-2 py-1 rounded">
                        {program.name.split(' • ')[0]} • {program.name.split(' • ')[1]}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {removedPrograms.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">Removed:</p>
                  <div className="space-y-1">
                    {removedPrograms.map((program) => (
                      <p key={program.id} className="text-sm text-red-700 bg-red-50 px-2 py-1 rounded line-through">
                        {program.name.split(' • ')[0]} • {program.name.split(' • ')[1]}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {addedPrograms.length === 0 && removedPrograms.length === 0 && (
                <p className="text-sm text-gray-500">No changes made yet</p>
              )}
            </div>

            {/* Lock Notice */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-orange-800">Lock is required to finalize.</p>
                  <p className="text-xs text-orange-700">You can still reorder in the next step before locking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOptions;