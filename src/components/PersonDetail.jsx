import React from "react";

const PersonDetail = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading data...</span>
      </div>
    );
  }
  
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Seating Summary</h3>
            <p className="text-gray-600 text-sm mt-1">Total allocated seats overview</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500 mb-1">Total Seats</p>
            <p className="text-3xl font-bold text-blue-700">{data.total_seats}</p>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Guest Details</h3>
          <p className="text-gray-600 text-sm mt-1">Breakdown by category and department</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    Category
                    <svg className="ml-1 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sub Category
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Department
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Guest Name
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center justify-between">
                    Seats
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.categories.map((c, i) => (
                <tr 
                  key={i} 
                  className={`hover:bg-gray-50 transition-colors duration-150 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-3"></div>
                      {c.category}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{c.sub_category}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {c.department}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <span className="text-indigo-800 font-semibold text-sm">
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {c.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{c.seats}</span>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="px-6 py-3 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total {data.categories.length} entries</span>
            <span className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Guest seating details
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetail;