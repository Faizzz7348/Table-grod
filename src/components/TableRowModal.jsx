import React from 'react';
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
} from './AnimatedModal';

export function TableRowModal({ rowData, trigger }) {
  if (!rowData) return null;

  return (
    <Modal>
      {trigger || (
        <ModalTrigger className="!p-2 !text-sm">
          View Details
        </ModalTrigger>
      )}
      
      <ModalBody>
        <ModalContent>
          <div className="space-y-4">
            {/* Header with Icon */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {rowData.name?.charAt(0) || 'R'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {rowData.name || 'Route Details'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Code: {rowData.code || 'N/A'}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <DetailItem label="Route Code" value={rowData.code} />
              <DetailItem label="Route Name" value={rowData.name} />
              <DetailItem label="Country" value={rowData.country?.name} />
              <DetailItem label="Representative" value={rowData.representative?.name} />
              
              {rowData.date && (
                <DetailItem 
                  label="Date" 
                  value={new Date(rowData.date).toLocaleDateString('ms-MY')} 
                />
              )}
              
              {rowData.status && (
                <DetailItem 
                  label="Status" 
                  value={
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      rowData.status === 'qualified' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : rowData.status === 'unqualified'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : rowData.status === 'negotiation'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {rowData.status}
                    </span>
                  }
                />
              )}

              {rowData.activity && (
                <DetailItem 
                  label="Activity" 
                  value={
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {rowData.activity}%
                    </span>
                  }
                />
              )}

              {rowData.balance && (
                <DetailItem 
                  label="Balance" 
                  value={`RM ${rowData.balance.toLocaleString('ms-MY')}`}
                />
              )}
            </div>

            {/* Map Section if coordinates exist */}
            {(rowData.latitude && rowData.longitude) && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Location
                </h3>
                <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📍 Lat: {rowData.latitude}, Lng: {rowData.longitude}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    (Map component boleh integrate di sini)
                  </p>
                </div>
              </div>
            )}

            {/* Images Section if exists */}
            {rowData.images && rowData.images.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Images
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {rowData.images.map((img, idx) => (
                    <img 
                      key={idx}
                      src={img} 
                      alt={`Image ${idx + 1}`}
                      className="rounded-lg w-full h-24 object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ModalContent>
        
        <ModalFooter className="gap-3">
          <button className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors">
            Close
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all">
            Edit Route
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}

// Helper component untuk display detail items
function DetailItem({ label, value }) {
  if (!value) return null;
  
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

// Simple example untuk guna dalam table
export function QuickViewButton({ rowData }) {
  return (
    <TableRowModal 
      rowData={rowData}
      trigger={
        <button className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
          👁️ View
        </button>
      }
    />
  );
}
