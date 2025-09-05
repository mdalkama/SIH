
import React from 'react';

const Loading = () => {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center z-50">
            {/* Single professional spinner */}
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
            </div>

            {/* Single text */}
            <p className="mt-6 text-slate-700 text-lg font-medium">Please Wait !</p>
        </div>
    );
};

export default Loading;