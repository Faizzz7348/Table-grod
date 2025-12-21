import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { CustomerService } from './service/CustomerService';
import CustomLightbox from './components/CustomLightbox';

export default function FlexibleScrollDemo() {
    const [routes, setRoutes] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogData, setDialogData] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [infoDialogVisible, setInfoDialogVisible] = useState(false);
    const [selectedRowInfo, setSelectedRowInfo] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState({
        no: true,
        code: true,
        location: true,
        delivery: true,
        image: true
    });
    const [showColumnPanel, setShowColumnPanel] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [originalData, setOriginalData] = useState([]);
    const [originalDialogData, setOriginalDialogData] = useState([]);
    
    // Custom Lightbox State
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Custom Sort State
    const [customSortMode, setCustomSortMode] = useState(false);
    const [sortOrders, setSortOrders] = useState({});
    const [isCustomSorted, setIsCustomSorted] = useState(false); // Track if data is custom sorted

    useEffect(() => {
        console.log('Component mounted - Loading data...');
        CustomerService.getRoutes()
            .then((data) => {
                console.log('Data loaded:', data);
                setRoutes(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error loading data:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Apply dark/light mode class to body
        document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    }, [darkMode]);

    const dialogFooterTemplate = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                    {hasUnsavedChanges && (
                        <span style={{
                            color: '#f59e0b',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <i className="pi pi-info-circle"></i>
                            You have unsaved changes
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button 
                        label="Close" 
                        icon="pi pi-times" 
                        onClick={() => setDialogVisible(false)} 
                        size="small"
                        outlined
                        disabled={saving}
                    />
                    {editMode && (
                        <>
                            <Button 
                                label="Cancel Changes" 
                                icon="pi pi-undo" 
                                onClick={handleCancelChanges} 
                                severity="danger"
                                size="small"
                                outlined
                                disabled={!hasUnsavedChanges || saving}
                            />
                            <Button 
                                label={saving ? "Saving..." : "Save Changes"} 
                                icon={saving ? "pi pi-spin pi-spinner" : "pi pi-save"} 
                                onClick={handleSaveChanges} 
                                severity="success"
                                size="small"
                                disabled={!hasUnsavedChanges || saving}
                            />
                        </>
                    )}
                </div>
            </div>
        );
    };

    const handleUpdateRow = (rowId, field, value) => {
        const updatedRoutes = routes.map(route => 
            route.id === rowId ? { ...route, [field]: value } : route
        );
        setRoutes(updatedRoutes);
        setHasUnsavedChanges(true);
        console.log('Updated:', rowId, field, value);
    };

    const handleUpdateDialogData = (rowId, field, value) => {
        const updatedData = dialogData.map(data => 
            data.id === rowId ? { ...data, [field]: value } : data
        );
        setDialogData(sortDialogData(updatedData));
        setHasUnsavedChanges(true);
        console.log('Dialog Updated:', rowId, field, value);
    };

    const handlePowerModeChange = (rowId, mode) => {
        const updatedData = dialogData.map(data => 
            data.id === rowId ? { ...data, powerMode: mode } : data
        );
        setDialogData(sortDialogData(updatedData));
        setHasUnsavedChanges(true);
        console.log('Power mode changed:', rowId, mode);
    };

    const sortDialogData = (data) => {
        return [...data].sort((a, b) => {
            const statusA = getPowerStatus(a.powerMode || 'Daily');
            const statusB = getPowerStatus(b.powerMode || 'Daily');
            
            // ON rows first, OFF rows at bottom
            if (statusA === 'ON' && statusB === 'OFF') return -1;
            if (statusA === 'OFF' && statusB === 'ON') return 1;
            return 0;
        });
    };

    const getPowerStatus = (powerMode) => {
        const today = new Date().getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
        
        switch(powerMode) {
            case 'Daily':
                return 'ON'; // Always on
            case 'Weekday':
                // Off on Friday (5) and Saturday (6)
                return (today === 5 || today === 6) ? 'OFF' : 'ON';
            case 'Alt 1':
                // On: Mon(1), Wed(3), Fri(5), Sun(0)
                return [1, 3, 5, 0].includes(today) ? 'ON' : 'OFF';
            case 'Alt 2':
                // On: Tue(2), Thu(4), Sat(6)
                return [2, 4, 6].includes(today) ? 'ON' : 'OFF';
            default:
                return 'OFF';
        }
    };

    const getPowerColor = (powerMode) => {
        const status = getPowerStatus(powerMode);
        return status === 'ON' ? '#10b981' : '#ef4444';
    };

    const handleShowInfo = (rowData) => {
        setSelectedRowInfo(rowData);
        setInfoDialogVisible(true);
    };

    const handleRowReorder = (e) => {
        setDialogData(e.value);
        setHasUnsavedChanges(true);
        console.log('Row reordered');
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        
        try {
            // Save both routes and locations
            const results = await Promise.all([
                CustomerService.saveRoutes(routes),
                CustomerService.saveLocations(dialogData)
            ]);
            
            console.log('Changes saved successfully:', { 
                routes, 
                dialogData, 
                isCustomSorted,
                results 
            });
            
            setOriginalData([...routes]);
            setOriginalDialogData([...dialogData]);
            setHasUnsavedChanges(false);
            setSaving(false);
            
            // Check if using localStorage
            const isLocalStorage = results[0].message?.includes('localStorage');
            
            // Success message with custom sort info
            let message = isCustomSorted 
                ? '✅ Changes saved successfully!\n📊 Custom sort order has been saved.'
                : '✅ Changes saved successfully!';
            
            if (isLocalStorage) {
                message += '\n\n💾 Using localStorage (Development Mode)\nData akan kekal selepas refresh!';
            } else {
                message += '\n\n🗄️ Saved to Database\nData permanently stored!';
            }
            
            alert(message);
            
        } catch (error) {
            console.error('Error saving changes:', error);
            setSaving(false);
            alert('❌ Error saving changes. Please try again.\n' + error.message);
        }
    };

    const handleCancelChanges = () => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm('⚠️ You have unsaved changes. Are you sure you want to cancel?');
            if (!confirmed) return;
        }
        setRoutes([...originalData]);
        setDialogData([...originalDialogData]);
        setHasUnsavedChanges(false);
        console.log('Changes cancelled');
    };

    const handleToggleEditMode = () => {
        if (editMode && hasUnsavedChanges) {
            const confirmed = window.confirm('⚠️ You have unsaved changes. Do you want to save before exiting edit mode?');
            if (confirmed) {
                handleSaveChanges();
            }
        }
        if (!editMode) {
            // Entering edit mode - save original data
            setOriginalData([...routes]);
            setOriginalDialogData([...dialogData]);
        }
        setEditMode(!editMode);
    };
    
    const handleToggleCustomSort = () => {
        if (customSortMode) {
            // Exiting custom sort mode
            setSortOrders({});
        } else {
            // Entering custom sort mode - initialize with empty values
            const initialOrders = {};
            dialogData.forEach((row) => {
                initialOrders[row.id] = '';
            });
            setSortOrders(initialOrders);
        }
        setCustomSortMode(!customSortMode);
    };
    
    const handleSortOrderChange = (rowId, value) => {
        console.log('handleSortOrderChange called:', {rowId, value, type: typeof value});
        // Store as string if empty, otherwise as number
        const newValue = value === '' ? '' : parseInt(value);
        console.log('Setting new value:', newValue);
        const updated = {
            ...sortOrders, 
            [rowId]: newValue
        };
        console.log('Updated sortOrders:', updated);
        setSortOrders(updated);
    };
    
    const isOrderDuplicate = (rowId, order) => {
        if (!order) return false;
        return Object.entries(sortOrders).some(([id, ord]) => 
            parseInt(id) !== rowId && ord === order
        );
    };
    
    const applyCustomSort = () => {
        // Validate that all rows have unique, sequential numbers
        const orders = Object.values(sortOrders).filter(o => o !== '');
        const uniqueOrders = new Set(orders);
        
        if (orders.length !== dialogData.length) {
            alert('⚠️ Semua row harus mempunyai nombor urutan!');
            return;
        }
        
        if (uniqueOrders.size !== orders.length) {
            alert('⚠️ Nombor tidak boleh duplikat! Sila gunakan nombor yang berbeza untuk setiap row.');
            return;
        }
        
        // Sort the data based on custom orders
        const sortedData = [...dialogData].sort((a, b) => {
            const orderA = sortOrders[a.id] || 999999;
            const orderB = sortOrders[b.id] || 999999;
            return orderA - orderB;
        });
        
        setDialogData(sortedData);
        setHasUnsavedChanges(true);
        setCustomSortMode(false);
        setSortOrders({});
        setIsCustomSorted(true); // Mark as custom sorted
        alert('✅ Row telah disusun mengikut urutan yang anda tetapkan!');
    };

    const handleAddDialogRow = () => {
        const newId = dialogData.length + 1;
        const newRow = {
            id: newId,
            no: newId,
            code: `${newId * 10}`,
            location: 'New Location',
            delivery: 'Daily',
            images: [],
            powerMode: 'Daily'
        };
        setDialogData(sortDialogData([...dialogData, newRow]));
        setHasUnsavedChanges(true);
        console.log('Added new dialog row:', newRow);
    };

    const handleDeleteDialogRow = (rowId) => {
        const updatedData = dialogData.filter(data => data.id !== rowId);
        setDialogData(sortDialogData(updatedData));
        setHasUnsavedChanges(true);
        console.log('Deleted dialog row:', rowId);
    };

    const handleAddRow = () => {
        const newId = routes.length + 1;
        const newRow = {
            id: newId,
            route: `Route ${newId}`,
            shift: 'AM',
            warehouse: 'New Warehouse'
        };
        setRoutes([...routes, newRow]);
        setHasUnsavedChanges(true);
        console.log('Added new row:', newRow);
    };

    const handleDeleteRow = (rowId) => {
        const updatedRoutes = routes.filter(route => route.id !== rowId);
        setRoutes(updatedRoutes);
        setHasUnsavedChanges(true);
        console.log('Deleted row:', rowId);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} style={{ width: '100%' }} />;
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;
        if (newValue !== rowData[field]) {
            handleUpdateRow(rowData.id, field, newValue);
        }
    };

    const onDialogCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;
        if (newValue !== rowData[field]) {
            handleUpdateDialogData(rowData.id, field, newValue);
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Button 
                    icon="pi pi-eye" 
                    size="small"
                    tooltip="Show"
                    tooltipOptions={{ position: 'top' }}
                    text
                    onClick={() => {
                        CustomerService.getDetailData().then((data) => {
                            setDialogData(sortDialogData(data));
                            setDialogVisible(true);
                            setIsCustomSorted(false); // Reset custom sort flag
                        });
                    }} 
                />
                {editMode && (
                    <>
                        <Button 
                            icon="pi pi-pencil" 
                            size="small"
                            severity="info"
                            tooltip="Edit"
                            tooltipOptions={{ position: 'top' }}
                            text
                            onClick={() => {
                                CustomerService.getDetailData().then((data) => {
                                    setDialogData(sortDialogData(data));
                                    setDialogVisible(true);
                                });
                            }} 
                        />
                        <Button 
                            icon="pi pi-trash" 
                            size="small"
                            severity="danger"
                            tooltip="Delete"
                            tooltipOptions={{ position: 'top' }}
                            text
                            onClick={() => handleDeleteRow(rowData.id)} 
                        />
                    </>
                )}
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                fontSize: '1.5rem',
                fontWeight: 'bold'
            }}>
                Loading application...
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh',
            background: darkMode 
                ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' 
                : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            color: darkMode ? '#e5e5e5' : '#000000',
            transition: 'all 0.3s ease'
        }}>
            {/* Navigation Header */}
            <div style={{
                background: darkMode ? '#1a1a1a' : '#ffffff',
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `2px solid ${darkMode ? '#1a3a52' : '#3b82f6'}`,
                marginBottom: '2rem',
                boxShadow: darkMode ? '0 4px 16px rgba(0, 0, 0, 0.6)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ 
                    margin: 0, 
                    color: darkMode ? '#e5e5e5' : '#000000',
                    fontSize: '1.75rem',
                    fontWeight: '700'
                }}>Route Management</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {editMode && hasUnsavedChanges && (
                        <span style={{
                            backgroundColor: darkMode ? '#fbbf24' : '#fef3c7',
                            color: darkMode ? '#000000' : '#92400e',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <i className="pi pi-exclamation-triangle"></i>
                            Unsaved Changes
                        </span>
                    )}
                    {editMode && (
                        <>
                            <Button 
                                icon="pi pi-times" 
                                label="Cancel"
                                onClick={handleCancelChanges}
                                severity="danger"
                                size="small"
                                outlined
                                disabled={saving}
                            />
                            <Button 
                                icon={saving ? "pi pi-spin pi-spinner" : "pi pi-save"} 
                                label={saving ? "Saving..." : "Save"}
                                onClick={handleSaveChanges}
                                severity="success"
                                size="small"
                                raised
                                disabled={!hasUnsavedChanges || saving}
                            />
                        </>
                    )}
                    <Button 
                        icon={darkMode ? "pi pi-sun" : "pi pi-moon"} 
                        label={darkMode ? "Light" : "Dark"}
                        onClick={() => setDarkMode(!darkMode)}
                        severity={darkMode ? "warning" : "secondary"}
                        size="small"
                        raised
                    />
                    <Button 
                        icon={editMode ? "pi pi-eye" : "pi pi-pencil"} 
                        label={editMode ? "View Mode" : "Edit Mode"}
                        onClick={handleToggleEditMode}
                        severity={editMode ? "success" : "info"}
                        size="small"
                        raised
                        disabled={saving}
                    />
                </div>
            </div>

            <div className="card">
                {editMode && (
                    <div style={{ marginBottom: '1rem' }}>
                        <Button 
                            label="Add New Row" 
                            icon="pi pi-plus" 
                            onClick={handleAddRow}
                            severity="success"
                            size="small"
                            raised
                        />
                    </div>
                )}
                {editMode && (
                    <div style={{ 
                        backgroundColor: darkMode ? '#064e3b' : '#d1fae5',
                        border: '2px solid #10b981',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        color: darkMode ? '#a7f3d0' : '#065f46',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}>
                        ✏️ EDIT MODE ACTIVE - Double click on cells to edit! 👆
                    </div>
                )}
                {!editMode && (
                    <div style={{ 
                        backgroundColor: darkMode ? '#1e3a8a' : '#e0e7ff',
                        border: '2px solid #6366f1',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        color: darkMode ? '#c7d2fe' : '#3730a3',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}>
                        👁️ VIEW MODE - Enable Edit Mode to modify data
                    </div>
                )}
                <DataTable 
                    value={routes} 
                    scrollable 
                    scrollHeight="400px" 
                    tableStyle={{ minWidth: '50rem' }}
                    editMode={editMode ? "cell" : null}
                >
                    <Column 
                        field="route" 
                        header="Route" 
                        align="center" 
                        alignHeader="center"
                        editor={editMode ? textEditor : null}
                        onCellEditComplete={editMode ? onCellEditComplete : null}
                    />
                    <Column 
                        field="shift" 
                        header="Shift" 
                        align="center" 
                        alignHeader="center"
                        editor={editMode ? textEditor : null}
                        onCellEditComplete={editMode ? onCellEditComplete : null}
                    />
                    <Column 
                        field="warehouse" 
                        header="Warehouse" 
                        align="center" 
                        alignHeader="center"
                        editor={editMode ? textEditor : null}
                        onCellEditComplete={editMode ? onCellEditComplete : null}
                    />
                    <Column header="Action" align="center" alignHeader="center" body={actionBodyTemplate} />
                </DataTable>

                <Dialog 
                    header="Flex Scroll" 
                    visible={dialogVisible} 
                    style={{ width: '90vw' }} 
                    maximizable
                    modal
                    closeOnEscape
                    dismissableMask 
                    contentStyle={{ height: '500px' }} 
                    onHide={() => setDialogVisible(false)} 
                    footer={dialogFooterTemplate}
                >
                    {/* Search and Column Visibility Controls */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start'
                    }}>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <span className="p-input-icon-left" style={{ width: '100%' }}>
                                <i className="pi pi-search" />
                                <InputText
                                    value={globalFilterValue}
                                    onChange={(e) => setGlobalFilterValue(e.target.value)}
                                    placeholder="Search..."
                                    style={{ width: '100%' }}
                                />
                            </span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Button 
                                icon="pi pi-eye" 
                                label="Columns" 
                                size="small"
                                outlined
                                onClick={() => setShowColumnPanel(!showColumnPanel)}
                                badge={String(Object.values(visibleColumns).filter(v => v).length)}
                                badgeClassName="p-badge-info"
                            />
                            {showColumnPanel && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                                    border: `1px solid ${darkMode ? '#404040' : '#d1d5db'}`,
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    minWidth: '200px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    zIndex: 1000
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {[
                                            { key: 'no', label: 'No' },
                                            { key: 'code', label: 'Code' },
                                            { key: 'location', label: 'Location' },
                                            { key: 'delivery', label: 'Delivery' },
                                            { key: 'image', label: 'Image' }
                                        ].map(col => (
                                            <label key={col.key} style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '0.5rem',
                                                cursor: 'pointer',
                                                color: darkMode ? '#e5e5e5' : '#000000'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={visibleColumns[col.key]}
                                                    onChange={(e) => setVisibleColumns({...visibleColumns, [col.key]: e.target.checked})}
                                                    style={{ 
                                                        cursor: 'pointer',
                                                        width: '16px',
                                                        height: '16px'
                                                    }}
                                                />
                                                <span>{col.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {editMode && (
                        <div style={{ 
                            backgroundColor: darkMode ? '#78350f' : '#fef3c7',
                            border: '2px solid #f59e0b',
                            borderRadius: '10px',
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            textAlign: 'center',
                            color: darkMode ? '#fde68a' : '#92400e',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                        }}>
                            ✏️ Edit Mode Active - Double click to edit cells, drag rows to reorder
                        </div>
                    )}
                    {editMode && (
                        <div style={{ marginBottom: '1rem' }}>
                            <Button 
                                label="Add New Row" 
                                icon="pi pi-plus" 
                                severity="success"
                                size="small"
                                onClick={handleAddDialogRow}
                                raised
                            />
                        </div>
                    )}
                    {/* Data Source Indicator */}
                    <div style={{ 
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        backgroundColor: isCustomSorted ? '#dbeafe' : '#f0fdf4',
                        border: isCustomSorted ? '2px solid #3b82f6' : '2px solid #10b981',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                    }}>
                        <i className={isCustomSorted ? 'pi pi-sort-numeric-up' : 'pi pi-database'} 
                           style={{ fontSize: '1.2rem', color: isCustomSorted ? '#3b82f6' : '#10b981' }}></i>
                        <span style={{ color: isCustomSorted ? '#1e40af' : '#065f46' }}>
                            {isCustomSorted ? '📊 Custom Sorted Data' : '🗄️ Original Database Order'}
                        </span>
                        {isCustomSorted && (
                            <Button 
                                label="Reset to Database Order" 
                                icon="pi pi-refresh" 
                                size="small"
                                severity="warning"
                                outlined
                                onClick={() => {
                                    CustomerService.getDetailData().then((data) => {
                                        setDialogData(sortDialogData(data));
                                        setIsCustomSorted(false);
                                        setHasUnsavedChanges(true);
                                        alert('✅ Data telah dikembalikan ke urutan asal dari database!');
                                    });
                                }}
                                style={{ marginLeft: 'auto' }}
                            />
                        )}
                    </div>
                    
                    {/* Custom Sort Controls */}
                    <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Button 
                            label={customSortMode ? "Cancel Custom Sort" : "Set Order"} 
                            icon={customSortMode ? "pi pi-times" : "pi pi-sort-numeric-up"} 
                            severity={customSortMode ? "danger" : "info"}
                            size="small"
                            onClick={handleToggleCustomSort}
                            outlined={!customSortMode}
                            raised={customSortMode}
                        />
                        {customSortMode && (
                            <Button 
                                label="Apply Sort" 
                                icon="pi pi-check" 
                                severity="success"
                                size="small"
                                onClick={applyCustomSort}
                                raised
                            />
                        )}
                        {customSortMode && (
                            <div style={{
                                backgroundColor: darkMode ? '#1e3a5f' : '#dbeafe',
                                border: '2px solid #3b82f6',
                                borderRadius: '8px',
                                padding: '0.5rem 1rem',
                                color: darkMode ? '#93c5fd' : '#1e40af',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <i className="pi pi-info-circle"></i>
                                <span>Masukkan nombor untuk setiap row. Nombor tidak boleh duplikat.</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Custom Sort Table - Separate from DataTable */}
                    {customSortMode ? (
                        <div style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            overflow: 'auto',
                            maxHeight: '600px',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ 
                                    position: 'sticky', 
                                    top: 0, 
                                    backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f5',
                                    zIndex: 10
                                }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Urutan</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>No</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Code</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Location</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Delivery</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dialogData.map((rowData) => {
                                        const order = sortOrders[rowData.id];
                                        const isDuplicate = isOrderDuplicate(rowData.id, order);
                                        return (
                                            <tr key={rowData.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <input
                                                        type="text"
                                                        value={order === '' || order === undefined ? '' : order}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === '' || /^[0-9]+$/.test(val)) {
                                                                handleSortOrderChange(rowData.id, val);
                                                            }
                                                        }}
                                                        placeholder="#"
                                                        autoComplete="off"
                                                        style={{ 
                                                            width: '70px', 
                                                            textAlign: 'center',
                                                            border: isDuplicate ? '2px solid #ef4444' : '1px solid #ced4da',
                                                            backgroundColor: isDuplicate ? '#fee2e2' : '#ffffff',
                                                            padding: '0.5rem',
                                                            borderRadius: '6px',
                                                            fontSize: '1rem'
                                                        }}
                                                    />
                                                    {isDuplicate && (
                                                        <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                                            Duplicate!
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>{rowData.no}</td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>{rowData.code}</td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>{rowData.location}</td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>{rowData.delivery}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                    <DataTable 
                        value={dialogData} 
                        scrollable 
                        scrollHeight="flex" 
                        tableStyle={{ minWidth: '70rem' }}
                        editMode={editMode ? "cell" : null}
                        reorderableRows={false}
                        onRowReorder={customSortMode ? null : handleRowReorder}
                        globalFilter={globalFilterValue}
                        rowClassName={(rowData) => {
                            const status = getPowerStatus(rowData.powerMode || 'Daily');
                            return status === 'OFF' ? 'row-disabled' : '';
                        }}
                    >
                        {editMode && !customSortMode && <Column rowReorder style={{ width: '3rem' }} />}
                        {customSortMode && (
                            <Column 
                                header="Urutan" 
                                align="center" 
                                alignHeader="center"
                                body={(rowData) => {
                                    const order = sortOrders[rowData.id];
                                    const isDuplicate = isOrderDuplicate(rowData.id, order);
                                    console.log('Rendering input for row:', rowData.id, 'order:', order);
                                    return (
                                        <div 
                                            style={{ padding: '0.5rem' }}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onMouseUp={(e) => e.stopPropagation()}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                key={`sort-${rowData.id}`}
                                                type="text"
                                                value={order === '' || order === undefined || order === null ? '' : String(order)}
                                                onChange={(e) => {
                                                    console.log('Input onChange triggered:', e.target.value);
                                                    const val = e.target.value;
                                                    // Only allow numbers
                                                    if (val === '' || /^[0-9]+$/.test(val)) {
                                                        handleSortOrderChange(rowData.id, val);
                                                    }
                                                }}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onMouseUp={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.target.focus();
                                                }}
                                                onFocus={(e) => {
                                                    console.log('Input focused');
                                                    e.stopPropagation();
                                                }}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                placeholder="#"
                                                autoComplete="off"
                                                style={{ 
                                                    width: '70px', 
                                                    textAlign: 'center',
                                                    border: isDuplicate ? '2px solid #ef4444' : '1px solid #ced4da',
                                                    backgroundColor: isDuplicate ? '#fee2e2' : '#ffffff',
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    fontSize: '1rem',
                                                    cursor: 'text',
                                                    pointerEvents: 'auto',
                                                    zIndex: 1000
                                                }}
                                            />
                                        </div>
                                    );
                                }}
                                style={{ width: '120px' }}
                            />
                        )}
                        {visibleColumns.no && (
                            <Column 
                                field="no" 
                                header="No" 
                                align="center" 
                                alignHeader="center"
                                style={{ width: '60px' }}
                            />
                        )}
                        {visibleColumns.code && (
                            <Column 
                                field="code" 
                                header="Code" 
                                align="center" 
                                alignHeader="center"
                                editor={editMode ? textEditor : null}
                                onCellEditComplete={editMode ? onDialogCellEditComplete : null}
                                style={{ width: '100px' }}
                            />
                        )}
                        {visibleColumns.location && (
                            <Column 
                                field="location" 
                                header="Location" 
                                align="center" 
                                alignHeader="center"
                                editor={editMode ? textEditor : null}
                                onCellEditComplete={editMode ? onDialogCellEditComplete : null}
                                style={{ width: '200px' }}
                            />
                        )}
                        {visibleColumns.delivery && (
                            <Column 
                                field="delivery" 
                                header="Delivery" 
                                align="center" 
                                alignHeader="center"
                                editor={editMode ? textEditor : null}
                                onCellEditComplete={editMode ? onDialogCellEditComplete : null}
                                style={{ width: '120px' }}
                            />
                        )}
                        {visibleColumns.image && (
                            <Column 
                                columnKey="image"
                                header="Image" 
                                align="center" 
                                alignHeader="center"
                                body={(rowData) => {
                                    if (!rowData.images || rowData.images.length === 0) {
                                        return <span style={{ color: '#999', fontSize: '0.75rem' }}>No Image</span>;
                                    }
                                    
                                    const openLightbox = () => {
                                        setLightboxImages(rowData.images);
                                        setCurrentImageIndex(0);
                                        setLightboxVisible(true);
                                    };
                                    
                                    return (
                                        <div 
                                            style={{ 
                                                position: 'relative', 
                                                display: 'inline-block',
                                                width: '60px',
                                                height: '45px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openLightbox();
                                            }}
                                        >
                                            <img 
                                                src={rowData.images[0]} 
                                                alt="Preview"
                                                width="60"
                                                height="45"
                                                style={{ 
                                                    borderRadius: '8px', 
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }}
                                            />
                                            {rowData.images.length > 1 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '4px',
                                                    right: '4px',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                    color: 'white',
                                                    padding: '2px 6px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold',
                                                    pointerEvents: 'none'
                                                }}>
                                                    +{rowData.images.length - 1}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }}
                                style={{ width: '100px' }}
                            />
                        )}
                        <Column 
                            columnKey="action"
                            header="Action" 
                            align="center" 
                            alignHeader="center"
                            body={(rowData) => (
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {/* Info Button */}
                                    <Button 
                                        icon="pi pi-info-circle" 
                                        size="small"
                                        severity="info"
                                        tooltip="View Details"
                                        tooltipOptions={{ position: 'top' }}
                                        text
                                        onClick={() => handleShowInfo(rowData)}
                                        style={{ backgroundColor: darkMode ? '#1a1a1a' : undefined }}
                                    />

                                    {/* Power Mode - Dropdown in Edit Mode, Icon in View Mode */}
                                    {editMode ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Dropdown 
                                                value={rowData.powerMode || 'Daily'} 
                                                options={[
                                                    { label: 'Daily', value: 'Daily' },
                                                    { label: 'Weekday', value: 'Weekday' },
                                                    { label: 'Alt 1', value: 'Alt 1' },
                                                    { label: 'Alt 2', value: 'Alt 2' }
                                                ]}
                                                onChange={(e) => handlePowerModeChange(rowData.id, e.value)}
                                                style={{ 
                                                    width: '120px', 
                                                    fontSize: '0.75rem',
                                                    backgroundColor: darkMode ? '#252525' : undefined
                                                }}
                                            />
                                            <span style={{ 
                                                fontSize: '0.7rem', 
                                                fontWeight: 'bold',
                                                color: getPowerColor(rowData.powerMode || 'Daily'),
                                                minWidth: '30px',
                                                textAlign: 'center'
                                            }}>
                                                {getPowerStatus(rowData.powerMode || 'Daily')}
                                            </span>
                                        </div>
                                    ) : (
                                        <Button 
                                            icon="pi pi-power-off" 
                                            size="small"
                                            tooltip={`${rowData.powerMode || 'Daily'} - ${getPowerStatus(rowData.powerMode || 'Daily')}`}
                                            tooltipOptions={{ position: 'top' }}
                                            text
                                            style={{ 
                                                color: getPowerColor(rowData.powerMode || 'Daily'),
                                                backgroundColor: darkMode ? '#1a1a1a' : undefined
                                            }}
                                        />
                                    )}

                                    {/* Delete Button - Only in Edit Mode */}
                                    {editMode && (
                                        <Button 
                                            icon="pi pi-trash" 
                                            size="small"
                                            severity="danger"
                                            tooltip="Delete"
                                            tooltipOptions={{ position: 'top' }}
                                            text
                                            onClick={() => handleDeleteDialogRow(rowData.id)}
                                            style={{ backgroundColor: darkMode ? '#1a1a1a' : undefined }}
                                        />
                                    )}
                                </div>
                            )}
                            style={{ width: '200px' }}
                        />
                    </DataTable>
                    )}
                </Dialog>

                {/* Info Dialog */}
                <Dialog 
                    header="Row Information" 
                    visible={infoDialogVisible} 
                    style={{ width: '400px' }} 
                    modal
                    onHide={() => setInfoDialogVisible(false)}
                >
                    {selectedRowInfo && (
                        <div style={{ padding: '1rem' }}>
                            <p><strong>No:</strong> {selectedRowInfo.no}</p>
                            <p><strong>Code:</strong> {selectedRowInfo.code}</p>
                            <p><strong>Location:</strong> {selectedRowInfo.location}</p>
                            <p><strong>Delivery:</strong> {selectedRowInfo.delivery}</p>
                            <p><strong>Power Mode:</strong> {selectedRowInfo.powerMode || 'Daily'}</p>
                            <p><strong>Current Status:</strong> <span style={{ color: getPowerColor(selectedRowInfo.powerMode || 'Daily'), fontWeight: 'bold' }}>{getPowerStatus(selectedRowInfo.powerMode || 'Daily')}</span></p>
                            <p><strong>Total Images:</strong> {selectedRowInfo.images ? selectedRowInfo.images.length : 0}</p>
                        </div>
                    )}
                </Dialog>

                {/* Custom Lightbox */}
                <CustomLightbox 
                    images={lightboxImages}
                    visible={lightboxVisible}
                    currentIndex={currentImageIndex}
                    onHide={() => setLightboxVisible(false)}
                    onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
                    onNext={(idx) => {
                        if (typeof idx === 'number') {
                            setCurrentImageIndex(idx);
                        } else {
                            setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
                        }
                    }}
                />

                {/* Saving Overlay */}
                {saving && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10000,
                        backdropFilter: 'blur(4px)'
                    }}>
                        <div style={{
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            padding: '3rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                            border: `2px solid ${darkMode ? '#1a3a52' : '#3b82f6'}`
                        }}>
                            <i className="pi pi-spin pi-spinner" style={{ 
                                fontSize: '3rem', 
                                color: '#3b82f6',
                                marginBottom: '1rem'
                            }}></i>
                            <h3 style={{ 
                                margin: '1rem 0 0.5rem 0',
                                color: darkMode ? '#e5e5e5' : '#000000',
                                fontSize: '1.5rem'
                            }}>Saving Changes...</h3>
                            <p style={{ 
                                margin: 0,
                                color: darkMode ? '#9ca3af' : '#6b7280',
                                fontSize: '0.875rem'
                            }}>Please wait while we save your data</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
