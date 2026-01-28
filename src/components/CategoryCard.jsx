import React from 'react';

const CategoryCard = ({ 
  categoryName, 
  totalSeats, 
  availableSeats, 
  bookedSeats, 
  subCategories = [],
  subCategoryLabel = "Sub Category"
}) => {
  const bookedPercentage = totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;
  console.log("bookedSeatsbookedSeats",bookedSeats)

const totalAvailableFromSub = subCategories.reduce(
  (sum, sub) => sum + (sub.available || 0),
  0
);


  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-64 flex flex-col overflow-hidden">
      {/* Card Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {categoryName}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              {totalSeats.toLocaleString()} total
            </span>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            {totalAvailableFromSub.toLocaleString()} available
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {bookedSeats.toLocaleString()} booked
            </span>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-400" 
                style={{ width: `${bookedPercentage}%` }}
              ></div>
            </div>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {bookedPercentage.toFixed(1)}% booked
          </span>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10">
            <tr>
              <th className="text-left py-2.5 px-4 text-gray-700 font-semibold w-[40%]">
                {/* {tableHeaders.subCategory} */}
                Sub Category
              </th>
              <th className="text-center py-2.5 px-2 text-gray-700 font-semibold">
                {/* {tableHeaders.available} */}
                Available
              </th>
              <th className="text-center py-2.5 px-2 text-gray-700 font-semibold">
                {/* {tableHeaders.booked} */}
                Booked
              </th>
              <th className="text-center py-2.5 px-2 text-gray-700 font-semibold">
                {/* {tableHeaders.total} */}
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subCategories.map((sub, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50/80 transition-colors duration-150"
              >
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>
                    <span className="text-gray-900 font-medium truncate" title={sub.name}>
                      {sub.name}
                    </span>
                  </div>
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                    {sub.available.toLocaleString()}
                  </span>
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md bg-red-50 text-red-700 font-medium">
                    {sub.booked.toLocaleString()}
                  </span>
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className="text-gray-900 font-semibold">
                    {(sub.available + sub.booked).toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryCard;