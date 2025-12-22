import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function DynamicRowTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Setiap row ada struktur dan data yang berbeza
    const generateDynamicData = () => {
        return [
            {
                id: 1,
                rowType: 'customer',
                customerName: 'Ahmad Abdullah',
                email: 'ahmad@email.com',
                phone: '012-3456789',
                address: 'Kuala Lumpur',
                age: 35,
                status: 'Active'
            },
            {
                id: 2,
                rowType: 'product',
                productName: 'Laptop Dell XPS',
                sku: 'DELL-XPS-001',
                category: 'Electronics',
                price: 4500.00,
                stock: 25,
                supplier: 'Tech Supply Co'
            },
            {
                id: 3,
                rowType: 'order',
                orderNumber: 'ORD-2024-001',
                customerName: 'Siti Nurhaliza',
                totalAmount: 2500.00,
                paymentMethod: 'Credit Card',
                status: 'Shipped',
                orderDate: '2024-12-20'
            },
            {
                id: 4,
                rowType: 'employee',
                employeeName: 'Muhammad Faiz',
                position: 'Software Engineer',
                department: 'IT',
                salary: 6500.00,
                joinDate: '2022-03-15',
                skills: 'React, Node.js, Python'
            },
            {
                id: 5,
                rowType: 'inventory',
                itemName: 'Office Chair Premium',
                location: 'Warehouse A-12',
                quantity: 150,
                lastRestocked: '2024-12-18',
                minStock: 50,
                condition: 'Excellent'
            },
            {
                id: 6,
                rowType: 'invoice',
                invoiceNumber: 'INV-2024-456',
                companyName: 'ABC Sdn Bhd',
                amount: 15000.00,
                dueDate: '2024-12-30',
                status: 'Pending',
                taxAmount: 900.00
            },
            {
                id: 7,
                rowType: 'customer',
                customerName: 'Lee Wei Ming',
                email: 'lee.wei@email.com',
                phone: '016-7891234',
                address: 'Penang',
                age: 28,
                status: 'VIP'
            },
            {
                id: 8,
                rowType: 'product',
                productName: 'iPhone 15 Pro',
                sku: 'APPL-IP15P-128',
                category: 'Mobile Phone',
                price: 5299.00,
                stock: 45,
                supplier: 'Apple Distribution'
            }
        ];
    };

    useEffect(() => {
        setTimeout(() => {
            setData(generateDynamicData());
            setLoading(false);
        }, 500);
    }, []);

    // Template untuk setiap jenis row yang berbeza
    const renderRowContent = (rowData) => {
        switch(rowData.rowType) {
            case 'customer':
                return (
                    <div style={{ 
                        padding: '1rem', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '8px',
                        color: 'white',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>👤 Customer</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{rowData.customerName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>📧 Email</div>
                            <div style={{ fontWeight: '500' }}>{rowData.email}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>📱 Phone</div>
                            <div style={{ fontWeight: '500' }}>{rowData.phone}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>📍 Location</div>
                            <div style={{ fontWeight: '500' }}>{rowData.address}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Age / Status</div>
                            <div style={{ fontWeight: '500' }}>{rowData.age} years • {rowData.status}</div>
                        </div>
                    </div>
                );

            case 'product':
                return (
                    <div style={{ 
                        padding: '1rem', 
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        borderRadius: '8px',
                        color: 'white',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>📦 Product</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{rowData.productName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>🏷️ SKU</div>
                            <div style={{ fontWeight: '500' }}>{rowData.sku}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>📂 Category</div>
                            <div style={{ fontWeight: '500' }}>{rowData.category}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>💰 Price</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>RM {rowData.price.toFixed(2)}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>📊 Stock</div>
                            <div style={{ fontWeight: '500' }}>{rowData.stock} units</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>🏢 Supplier</div>
                            <div style={{ fontWeight: '500' }}>{rowData.supplier}</div>
                        </div>
                    </div>
                );

            case 'order':
                return (
                    <div style={{ 
                        padding: '1rem', 
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        borderRadius: '8px',
                        color: 'white',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>🛒 Order Number</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{rowData.orderNumber}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>👤 Customer</div>
                            <div style={{ fontWeight: '500' }}>{rowData.customerName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>💳 Payment</div>
                            <div style={{ fontWeight: '500' }}>{rowData.paymentMethod}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>💰 Total</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>RM {rowData.totalAmount.toFixed(2)}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>📅 Date</div>
                            <div style={{ fontWeight: '500' }}>{rowData.orderDate}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>📦 Status</div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{rowData.status}</div>
                        </div>
                    </div>
                );

            case 'employee':
                return (
                    <div style={{ 
                        padding: '1rem', 
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        borderRadius: '8px',
                        color: '#1f2937',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>👨‍💼 Employee</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{rowData.employeeName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>💼 Position</div>
                            <div style={{ fontWeight: '500' }}>{rowData.position}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>🏢 Department</div>
                            <div style={{ fontWeight: '500' }}>{rowData.department}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>💰 Salary</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>RM {rowData.salary.toFixed(2)}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>📅 Join Date</div>
                            <div style={{ fontWeight: '500' }}>{rowData.joinDate}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>🎯 Skills</div>
                            <div style={{ fontWeight: '500' }}>{rowData.skills}</div>
                        </div>
                    </div>
                );

            case 'inventory':
                return (
                    <div style={{ 
                        padding: '1rem', 
                        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                        borderRadius: '8px',
                        color: '#1f2937',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>📦 Item</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{rowData.itemName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>📍 Location</div>
                            <div style={{ fontWeight: '500' }}>{rowData.location}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>📊 Quantity</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{rowData.quantity}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>🔄 Last Restock</div>
                            <div style={{ fontWeight: '500' }}>{rowData.lastRestocked}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>⚠️ Min Stock</div>
                            <div style={{ fontWeight: '500' }}>{rowData.minStock}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>✨ Condition</div>
                            <div style={{ fontWeight: '500' }}>{rowData.condition}</div>
                        </div>
                    </div>
                );

            case 'invoice':
                return (
                    <div style={{ 
                        padding: '1rem', 
                        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                        borderRadius: '8px',
                        color: '#1f2937',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>🧾 Invoice</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{rowData.invoiceNumber}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>🏢 Company</div>
                            <div style={{ fontWeight: '500' }}>{rowData.companyName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>💰 Amount</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>RM {rowData.amount.toFixed(2)}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>💵 Tax</div>
                            <div style={{ fontWeight: '500' }}>RM {rowData.taxAmount.toFixed(2)}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>📅 Due Date</div>
                            <div style={{ fontWeight: '500' }}>{rowData.dueDate}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>⚡ Status</div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{rowData.status}</div>
                        </div>
                    </div>
                );

            default:
                return <div>Unknown row type</div>;
        }
    };

    // Column untuk render setiap row dengan template berbeza
    const contentBodyTemplate = (rowData) => {
        return renderRowContent(rowData);
    };

    const header = (
        <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px 8px 0 0', color: 'white' }}>
            <h2 style={{ margin: 0 }}>🎨 Dynamic Flex Table - Setiap Row Berbeza</h2>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Setiap row mempunyai struktur dan design yang berbeza mengikut jenis data</p>
        </div>
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem' }}></i>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', background: '#f3f4f6', minHeight: '100vh' }}>
            <Card style={{ maxWidth: '1400px', margin: '0 auto', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                <DataTable 
                    value={data}
                    header={header}
                    dataKey="id"
                    scrollable
                    scrollHeight="calc(100vh - 200px)"
                    emptyMessage="Tiada data"
                    style={{ borderRadius: '8px' }}
                >
                    <Column 
                        body={contentBodyTemplate} 
                        style={{ padding: '0.5rem' }}
                    />
                </DataTable>
            </Card>

            <div style={{ 
                maxWidth: '1400px', 
                margin: '2rem auto', 
                padding: '1.5rem',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3>📋 Jenis Row Available:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '6px', borderLeft: '4px solid #667eea' }}>
                        <strong>👤 Customer</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>Purple gradient</p>
                    </div>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '6px', borderLeft: '4px solid #f5576c' }}>
                        <strong>📦 Product</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>Pink gradient</p>
                    </div>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '6px', borderLeft: '4px solid #00f2fe' }}>
                        <strong>🛒 Order</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>Blue gradient</p>
                    </div>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '6px', borderLeft: '4px solid #fee140' }}>
                        <strong>👨‍💼 Employee</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>Yellow gradient</p>
                    </div>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '6px', borderLeft: '4px solid #fed6e3' }}>
                        <strong>📦 Inventory</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>Pastel gradient</p>
                    </div>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '6px', borderLeft: '4px solid #fcb69f' }}>
                        <strong>🧾 Invoice</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>Orange gradient</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
