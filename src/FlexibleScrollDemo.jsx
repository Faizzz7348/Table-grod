import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { CustomerService } from './service/CustomerService';

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
        image: true,
        action: true
    });
    const [showColumnPanel, setShowColumnPanel] = useState(false);
    const [imageLoadingStates, setImageLoadingStates] = useState({});
    const [galleryVisible, setGalleryVisible] = useState(false);
    const [currentGalleryImages, setCurrentGalleryImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        CustomerService.getRoutes().then((data) => setRoutes(data));
    }, []);

    useEffect(() => {
        // Apply dark/light mode class to body
        document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    }, [darkMode]);

    const dialogFooterTemplate = () => {
        return <Button 
            label="Ok" 
            icon="pi pi-check" 
            onClick={() => setDialogVisible(false)} 
            style={{ backgroundColor: darkMode ? '#1a1a1a' : undefined }}
        />;
    };

    const handleUpdateRow = (rowId, field, value) => {
        const updatedRoutes = routes.map(route => 
            route.id === rowId ? { ...route, [field]: value } : route
        );
        setRoutes(updatedRoutes);
        console.log('Updated:', rowId, field, value);
    };

    const handleUpdateDialogData = (rowId, field, value) => {
        const updatedData = dialogData.map(data => 
            data.id === rowId ? { ...data, [field]: value } : data
        );
        setDialogData(sortDialogData(updatedData));
        console.log('Dialog Updated:', rowId, field, value);
    };

    const handlePowerModeChange = (rowId, mode) => {
        const updatedData = dialogData.map(data => 
            data.id === rowId ? { ...data, powerMode: mode } : data
        );
        setDialogData(sortDialogData(updatedData));
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
        console.log('Row reordered');
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
        console.log('Added new dialog row:', newRow);
    };

    const handleDeleteDialogRow = (rowId) => {
        const updatedData = dialogData.filter(data => data.id !== rowId);
        setDialogData(sortDialogData(updatedData));
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
        console.log('Added new row:', newRow);
    };

    const handleDeleteRow = (rowId) => {
        const updatedRoutes = routes.filter(route => route.id !== rowId);
        setRoutes(updatedRoutes);
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
                <div style={{ display: 'flex', gap: '1rem' }}>
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
                        label={editMode ? "View" : "Edit"}
                        onClick={() => setEditMode(!editMode)}
                        severity={editMode ? "success" : "info"}
                        size="small"
                        raised
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
                                onClick={handleAddDialogRow}
                                raised
                            />
                        </div>
                    )}
                    <DataTable 
                        value={dialogData} 
                        scrollable 
                        scrollHeight="flex" 
                        tableStyle={{ minWidth: '70rem' }}
                        editMode={editMode ? "cell" : null}
                        reorderableRows={editMode}
                        onRowReorder={handleRowReorder}
                        globalFilter={globalFilterValue}
                        rowClassName={(rowData) => {
                            const status = getPowerStatus(rowData.powerMode || 'Daily');
                            return status === 'OFF' ? 'row-disabled' : '';
                        }}
                    >
                        {editMode && <Column rowReorder style={{ width: '3rem' }} />}
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
                                header="Image" 
                                align="center" 
                                alignHeader="center"
                                body={(rowData) => {
                                    if (!rowData.images || rowData.images.length === 0) {
                                        return <span style={{ color: '#999', fontSize: '0.75rem' }}>No Image</span>;
                                    }
                                    
                                    return (
                                        <div style={{ 
                                            position: 'relative', 
                                            display: 'inline-block',
                                            width: '60px',
                                            height: '45px'
                                        }}>
                                            <img 
                                                src={rowData.images[0]} 
                                                alt="Preview"
                                                width="60"
                                                height="45"
                                                style={{ 
                                                    borderRadius: '8px', 
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    display: 'block'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentGalleryImages(rowData.images);
                                                    setCurrentImageIndex(0);
                                                    setGalleryVisible(true);
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

                {/* Image Gallery Dialog */}
                <Dialog 
                    visible={galleryVisible}
                    onHide={() => setGalleryVisible(false)}
                    modal
                    dismissableMask
                    style={{ width: '90vw', maxWidth: '1200px' }}
                    contentStyle={{ 
                        padding: '0',
                        backgroundColor: darkMode ? '#000000' : '#ffffff'
                    }}
                    headerStyle={{ display: 'none' }}
                >
                    <div style={{ 
                        position: 'relative',
                        backgroundColor: darkMode ? '#000000' : '#ffffff',
                        minHeight: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}>
                        {/* Close Button */}
                        <Button 
                            icon="pi pi-times"
                            rounded
                            text
                            severity="secondary"
                            onClick={() => setGalleryVisible(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                zIndex: 1000
                            }}
                        />
                        
                        {/* Main Image */}
                        {currentGalleryImages.length > 0 && (
                            <div style={{ 
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <img 
                                    src={currentGalleryImages[currentImageIndex]}
                                    alt={`Image ${currentImageIndex + 1}`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '70vh',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                />
                                
                                {/* Navigation Buttons */}
                                {currentGalleryImages.length > 1 && (
                                    <div style={{ 
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'center'
                                    }}>
                                        <Button 
                                            icon="pi pi-chevron-left"
                                            rounded
                                            outlined
                                            onClick={() => setCurrentImageIndex(prev => 
                                                prev > 0 ? prev - 1 : currentGalleryImages.length - 1
                                            )}
                                            disabled={currentGalleryImages.length <= 1}
                                        />
                                        <span style={{ 
                                            color: darkMode ? '#e5e5e5' : '#000000',
                                            fontWeight: 'bold',
                                            minWidth: '80px',
                                            textAlign: 'center'
                                        }}>
                                            {currentImageIndex + 1} / {currentGalleryImages.length}
                                        </span>
                                        <Button 
                                            icon="pi pi-chevron-right"
                                            rounded
                                            outlined
                                            onClick={() => setCurrentImageIndex(prev => 
                                                prev < currentGalleryImages.length - 1 ? prev + 1 : 0
                                            )}
                                            disabled={currentGalleryImages.length <= 1}
                                        />
                                    </div>
                                )}
                                
                                {/* Thumbnails */}
                                {currentGalleryImages.length > 1 && (
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        maxWidth: '100%',
                                        overflowX: 'auto',
                                        padding: '0.5rem'
                                    }}>
                                        {currentGalleryImages.map((img, index) => (
                                            <img 
                                                key={index}
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                style={{
                                                    width: '60px',
                                                    height: '45px',
                                                    objectFit: 'cover',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    border: index === currentImageIndex 
                                                        ? '3px solid #3b82f6' 
                                                        : '2px solid transparent',
                                                    opacity: index === currentImageIndex ? 1 : 0.6,
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => setCurrentImageIndex(index)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
}
