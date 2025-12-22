import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toolbar } from 'primereact/toolbar';
import { FilterMatchMode } from 'primereact/api';

export default function AlternativeFlexTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedItems, setSelectedItems] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    // Sample data generator
    const generateSampleData = () => {
        const statuses = ['Active', 'Inactive', 'Pending', 'Completed'];
        const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
        const categories = ['Category A', 'Category B', 'Category C', 'Category D'];
        
        return Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            name: `${names[i % names.length]} ${i + 1}`,
            code: `CODE-${String(i + 1).padStart(4, '0')}`,
            category: categories[i % categories.length],
            status: statuses[i % statuses.length],
            quantity: Math.floor(Math.random() * 1000) + 1,
            price: (Math.random() * 1000).toFixed(2),
            date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
        }));
    };

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setData(generateSampleData());
            setLoading(false);
        }, 800);
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 className="m-0">Alternative Flex Table</h4>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText 
                        value={globalFilterValue} 
                        onChange={onGlobalFilterChange} 
                        placeholder="Search..." 
                    />
                </span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        const getSeverity = (status) => {
            switch (status) {
                case 'Active':
                    return 'success';
                case 'Inactive':
                    return 'danger';
                case 'Pending':
                    return 'warning';
                case 'Completed':
                    return 'info';
                default:
                    return null;
            }
        };

        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const priceBodyTemplate = (rowData) => {
        return `$${rowData.price}`;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    outlined 
                    severity="info" 
                    size="small"
                    onClick={() => handleEdit(rowData)}
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    outlined 
                    severity="danger" 
                    size="small"
                    onClick={() => handleDelete(rowData)}
                />
            </div>
        );
    };

    const handleEdit = (rowData) => {
        console.log('Edit:', rowData);
        // Add your edit logic here
    };

    const handleDelete = (rowData) => {
        console.log('Delete:', rowData);
        setData(data.filter(item => item.id !== rowData.id));
    };

    const handleExport = () => {
        // Simple CSV export
        const csvContent = [
            ['ID', 'Name', 'Code', 'Category', 'Status', 'Quantity', 'Price', 'Date'],
            ...data.map(row => [
                row.id,
                row.name,
                row.code,
                row.category,
                row.status,
                row.quantity,
                row.price,
                row.date
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table-data.csv';
        a.click();
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <Button label="Add New" icon="pi pi-plus" severity="success" size="small" />
                <Button label="Delete" icon="pi pi-trash" severity="danger" size="small" disabled={!selectedItems || !selectedItems.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <Button label="Export" icon="pi pi-upload" className="p-button-help" size="small" onClick={handleExport} />
                <Button icon="pi pi-refresh" size="small" onClick={() => setData(generateSampleData())} />
            </div>
        );
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <ProgressSpinner />
                <p>Loading table data...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <Card>
                <Toolbar 
                    className="mb-4" 
                    left={leftToolbarTemplate} 
                    right={rightToolbarTemplate}
                />

                <DataTable 
                    value={data} 
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    dataKey="id" 
                    filters={filters}
                    globalFilterFields={['name', 'code', 'category', 'status']}
                    header={renderHeader()}
                    emptyMessage="No data found."
                    selection={selectedItems}
                    onSelectionChange={(e) => setSelectedItems(e.value)}
                    scrollable
                    scrollHeight="600px"
                    size="small"
                    stripedRows
                    showGridlines
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="id" header="ID" sortable style={{ minWidth: '4rem' }}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="code" header="Code" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="quantity" header="Quantity" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="date" header="Date" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} header="Actions" style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </Card>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4>Table Statistics</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'white', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Items</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{data.length}</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'white', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Selected</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                            {selectedItems ? selectedItems.length : 0}
                        </div>
                    </div>
                    <div style={{ padding: '1rem', background: 'white', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Items</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                            {data.filter(item => item.status === 'Active').length}
                        </div>
                    </div>
                    <div style={{ padding: '1rem', background: 'white', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Value</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                            ${data.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
