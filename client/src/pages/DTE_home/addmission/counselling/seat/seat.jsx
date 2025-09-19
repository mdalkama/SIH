import React from "react";
import {
  MapPin,
  School,
  Clock,
  FileText,
  Download,
  Printer,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AllotmentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Current Allotment */}
        <div className="md:col-span-2 border rounded-xl bg-white shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Current Allotment</h3>
            <span className="text-sm text-blue-600 font-medium">Round 1</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">Aditi Sharma</p>
              <p className="text-sm text-gray-500">Rank: 154 | Category: UR</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Allotted Institute</p>
              <p className="font-medium">National Tech University</p>
              <p className="text-sm text-gray-500">Program: B.Tech Computer Science</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin size={16} className="text-gray-500" /> Location: Delhi
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <School size={16} className="text-gray-500" /> Quota: All India
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock size={16} className="text-gray-500" /> Reporting By: 12 Aug, 5:00 PM
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle size={16} className="text-green-600" /> Status: Allotted
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow text-sm">
              Accept & Freeze
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 shadow text-sm">
              Accept & Float
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow text-sm">
              Reject & Exit
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            • Freeze = Confirm this seat &nbsp;&nbsp; • Float = Keep this seat, try for better
          </p>
        </div>

        {/* Timeline */}
        <div className="border rounded-xl bg-white shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Timeline</h3>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-4 text-sm text-blue-700 font-medium">
            Freeze window: 02d : 11h : 24m
          </div>

          <p className="text-sm text-gray-700 mb-4">
            <strong>Note:</strong> Report physically if you choose Freeze.  
            Bring documents: Admit card, Merit proof, Photo ID.
          </p>

          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-blue-600 hover:bg-blue-50">
              <Download size={16} /> Download Allotment Letter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-blue-600 hover:bg-blue-50">
              <Printer size={16} /> Print Instructions
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="border rounded-xl bg-white shadow-sm p-6 md:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Notifications</h3>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">3</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="border p-2 rounded-md hover:bg-gray-50">
              Institute reporting dates updated
            </li>
            <li className="border p-2 rounded-md hover:bg-gray-50">
              Provisional allotment published
            </li>
            <li className="border p-2 rounded-md hover:bg-gray-50">
              Upload documents for verification
            </li>
          </ul>
        </div>

        {/* Round History */}
        <div className="md:col-span-2 border rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">Round History</h3>
            <span className="text-sm text-gray-500">Summary</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Round</th>
                  <th className="px-4 py-2 text-left">Institute</th>
                  <th className="px-4 py-2 text-left">Program</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">National Tech University</td>
                  <td className="px-4 py-2">B.Tech CSE</td>
                  <td className="px-4 py-2 text-gray-600">Allotted</td>
                  <td className="px-4 py-2 text-yellow-600 font-medium">
                    Pending Decision
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 flex justify-between items-center text-xs text-gray-600">
            <span>Your choices will reflect here each round</span>
            <button className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 border rounded-md hover:bg-blue-50">
              <FileText size={16} /> View Detailed History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllotmentDashboard;
