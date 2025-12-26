import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CustomerService } from '../service/CustomerService';
import { TableRowModal, QuickViewButton } from './TableRowModal';
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
} from './AnimatedModal';

export function TableWithAnimatedModal() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CustomerService.getCustomersLarge().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  // Template untuk action column dengan modal
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        {/* Quick View Modal */}
        <QuickViewButton rowData={rowData} />
        
        {/* Edit Modal */}
        <Modal>
          <ModalTrigger className="!px-3 !py-1.5 !text-xs !bg-green-500 hover:!bg-green-600">
            ✏️ Edit
          </ModalTrigger>
          <ModalBody>
            <ModalContent>
              <h2 className="text-2xl font-bold mb-4">Edit Route</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Route Code</label>
                  <input 
                    type="text" 
                    defaultValue={rowData.code}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Route Name</label>
                  <input 
                    type="text" 
                    defaultValue={rowData.name}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input 
                    type="text" 
                    defaultValue={rowData.country?.name}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                  />
                </div>
              </div>
            </ModalContent>
            <ModalFooter className="gap-3">
              <button className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
            </ModalFooter>
          </ModalBody>
        </Modal>
        
        {/* Delete Modal */}
        <Modal>
          <ModalTrigger className="!px-3 !py-1.5 !text-xs !bg-red-500 hover:!bg-red-600">
            🗑️ Delete
          </ModalTrigger>
          <ModalBody>
            <ModalContent>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Delete Route?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to delete <strong>{rowData.name}</strong>?
                  This action cannot be undone.
                </p>
              </div>
            </ModalContent>
            <ModalFooter className="gap-3 justify-center">
              <button className="px-6 py-2 bg-gray-200 rounded-md">Cancel</button>
              <button className="px-6 py-2 bg-red-500 text-white rounded-md">Yes, Delete</button>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const statusColors = {
      qualified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      unqualified: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      negotiation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      new: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      renewal: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[rowData.status] || 'bg-gray-100 text-gray-800'}`}>
        {rowData.status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add Button */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Routes Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your routes with beautiful animated modals ✨
            </p>
          </div>
          
          {/* Add New Modal */}
          <Modal>
            <ModalTrigger className="!bg-gradient-to-r !from-blue-500 !to-purple-600">
              + Add New Route
            </ModalTrigger>
            <ModalBody>
              <ModalContent>
                <h2 className="text-2xl font-bold mb-6">Add New Route</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Route Code *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. R001"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Route Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Route Alpha"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Country</label>
                      <input 
                        type="text" 
                        placeholder="Malaysia"
                        className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
                        <option>qualified</option>
                        <option>unqualified</option>
                        <option>negotiation</option>
                        <option>new</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <textarea 
                      rows="3"
                      placeholder="Additional notes..."
                      className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                    />
                  </div>
                </div>
              </ModalContent>
              <ModalFooter className="gap-3">
                <button className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 rounded-md">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Create Route
                </button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        </div>

        {/* DataTable */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <DataTable 
            value={customers} 
            loading={loading}
            paginator 
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: '50rem' }}
            className="text-sm"
          >
            <Column field="code" header="Code" sortable style={{ width: '10%' }} />
            <Column field="name" header="Name" sortable style={{ width: '20%' }} />
            <Column field="country.name" header="Country" sortable style={{ width: '15%' }} />
            <Column field="representative.name" header="Representative" sortable style={{ width: '20%' }} />
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ width: '15%' }} />
            <Column 
              header="Actions" 
              body={actionBodyTemplate} 
              style={{ width: '20%' }}
              className="text-center"
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
}
