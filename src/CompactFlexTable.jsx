import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';

export default function CompactFlexTable() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [expandedRows, setExpandedRows] = useState(null);

    // Generate sample product data
    const generateProducts = () => {
        const categories = ['Electronics', 'Furniture', 'Clothing', 'Food', 'Books'];
        const suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'];
        
        return Array.from({ length: 30 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            sku: `SKU${String(i + 1).padStart(5, '0')}`,
            category: categories[i % categories.length],
            supplier: suppliers[i % suppliers.length],
            stock: Math.floor(Math.random() * 500),
            price: (Math.random() * 500 + 10).toFixed(2),
            reorderLevel: Math.floor(Math.random() * 50) + 10,
            lastOrdered: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            description: `This is a detailed description for Product ${i + 1}. It contains various features and specifications.`
        }));
    };

    useEffect(() => {
        setTimeout(() => {
            setProducts(generateProducts());
            setLoading(false);
        }, 600);
    }, []);

    const header = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <h3 style={{ margin: 0 }}>Compact Product Inventory</h3>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText 
                    type="search" 
                    value={globalFilter}
                    onInput={(e) => setGlobalFilter(e.target.value)} 
                    placeholder="Quick search..." 
                    size="small"
                />
            </span>
        </div>
    );

    const stockBodyTemplate = (rowData) => {
        const isLow = rowData.stock < rowData.reorderLevel;
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: isLow ? '#dc2626' : '#059669',
                fontWeight: isLow ? 'bold' : 'normal'
            }}>
                {isLow && <i className="pi pi-exclamation-triangle" />}
                {rowData.stock}
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    text 
                    severity="info"
                    size="small"
                    onClick={() => openEditDialog(rowData)}
                    tooltip="Edit"
                />
                <Button 
                    icon="pi pi-eye" 
                    rounded 
                    text 
                    size="small"
                    onClick={() => viewProduct(rowData)}
                    tooltip="View"
                />
                <Button 
                    icon="pi pi-shopping-cart" 
                    rounded 
                    text 
                    severity="success"
                    size="small"
                    onClick={() => reorderProduct(rowData)}
                    tooltip="Reorder"
                />
            </div>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <span style={{ fontWeight: 'bold', color: '#1e40af' }}>
                ${rowData.price}
            </span>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        const categoryColors = {
            'Electronics': '#3b82f6',
            'Furniture': '#8b5cf6',
            'Clothing': '#ec4899',
            'Food': '#f59e0b',
            'Books': '#10b981'
        };

        return (
            <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                background: categoryColors[rowData.category] || '#6b7280',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600'
            }}>
                {rowData.category}
            </span>
        );
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div style={{ padding: '1rem', background: '#f9fafb' }}>
                <h5>Product Details - {data.name}</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <strong>SKU:</strong> {data.sku}
                    </div>
                    <div>
                        <strong>Supplier:</strong> {data.supplier}
                    </div>
                    <div>
                        <strong>Reorder Level:</strong> {data.reorderLevel}
                    </div>
                    <div>
                        <strong>Last Ordered:</strong> {data.lastOrdered.toLocaleDateString()}
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Description:</strong><br />
                        {data.description}
                    </div>
                </div>
            </div>
        );
    };

    const openEditDialog = (product) => {
        setSelectedProduct({ ...product });
        setEditDialog(true);
    };

    const hideDialog = () => {
        setEditDialog(false);
        setSelectedProduct(null);
    };

    const saveProduct = () => {
        const updatedProducts = products.map(p => 
            p.id === selectedProduct.id ? selectedProduct : p
        );
        setProducts(updatedProducts);
        hideDialog();
    };

    const viewProduct = (product) => {
        console.log('View product:', product);
    };

    const reorderProduct = (product) => {
        console.log('Reorder product:', product);
        const updatedProducts = products.map(p => 
            p.id === product.id ? { ...p, stock: p.stock + 100 } : p
        );
        setProducts(updatedProducts);
    };

    const dialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} autoFocus />
        </div>
    );

    return (
        <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                color: 'white'
            }}>
                <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>📦 Inventory Management</h2>
                <p style={{ margin: 0, opacity: 0.9 }}>Manage your products efficiently with real-time stock tracking</p>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem',
                marginBottom: '1.5rem' 
            }}>
                <div style={{ 
                    background: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #3b82f6'
                }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Products</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{products.length}</div>
                </div>
                <div style={{ 
                    background: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #ef4444'
                }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Low Stock</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                        {products.filter(p => p.stock < p.reorderLevel).length}
                    </div>
                </div>
                <div style={{ 
                    background: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #10b981'
                }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Value</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                        ${products.reduce((sum, p) => sum + (p.stock * parseFloat(p.price)), 0).toFixed(0)}
                    </div>
                </div>
            </div>

            <DataTable 
                value={products}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                loading={loading}
                globalFilter={globalFilter}
                header={header}
                emptyMessage="No products found"
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id"
                scrollable
                scrollHeight="500px"
                stripedRows
                size="small"
                style={{ 
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
                <Column expander style={{ width: '3rem' }} />
                <Column field="name" header="Product Name" sortable style={{ minWidth: '12rem' }} />
                <Column field="sku" header="SKU" sortable style={{ minWidth: '10rem' }} />
                <Column field="category" header="Category" body={categoryBodyTemplate} sortable style={{ minWidth: '8rem' }} />
                <Column field="stock" header="Stock" body={stockBodyTemplate} sortable style={{ minWidth: '6rem' }} />
                <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '6rem' }} />
                <Column field="supplier" header="Supplier" sortable style={{ minWidth: '10rem' }} />
                <Column body={actionBodyTemplate} header="Actions" style={{ minWidth: '9rem' }} />
            </DataTable>

            <Dialog 
                visible={editDialog} 
                style={{ width: '450px' }} 
                header="Edit Product" 
                modal 
                footer={dialogFooter}
                onHide={hideDialog}
            >
                {selectedProduct && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Product Name</label>
                            <InputText 
                                id="name" 
                                value={selectedProduct.name} 
                                onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})} 
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="stock" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Stock</label>
                            <InputNumber 
                                id="stock" 
                                value={selectedProduct.stock} 
                                onValueChange={(e) => setSelectedProduct({...selectedProduct, stock: e.value})} 
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="price" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Price</label>
                            <InputNumber 
                                id="price" 
                                value={selectedProduct.price} 
                                onValueChange={(e) => setSelectedProduct({...selectedProduct, price: e.value})} 
                                mode="currency" 
                                currency="USD"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                            <Dropdown 
                                id="category"
                                value={selectedProduct.category} 
                                onChange={(e) => setSelectedProduct({...selectedProduct, category: e.value})} 
                                options={['Electronics', 'Furniture', 'Clothing', 'Food', 'Books']}
                                placeholder="Select Category"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}
