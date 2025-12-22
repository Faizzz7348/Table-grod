import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Menu } from 'primereact/menu';
import { CustomerService } from './service/CustomerService';
import { ImageLightbox } from './components/ImageLightbox';
import MiniMap from './components/MiniMap';

// Custom editor component with duplicate detection
const DuplicateCheckEditor = ({ options, allData, field, darkMode }) => {
    const [localValue, setLocalValue] = useState(options.value);
    const [isDuplicate, setIsDuplicate] = useState(false);

    useEffect(() => {
        if (field === 'code') {
            const duplicate = allData.some(item => 
                item.code === localValue && item.id !== options.rowData.id
            );
            setIsDuplicate(duplicate);
        }
    }, [localValue, allData, field, options.rowData.id]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        options.editorCallback(newValue);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {isDuplicate && (
                <div style={{
                    position: 'absolute',
                    top: '-22px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#ef4444',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    animation: 'fadeInDown 0.3s ease-out'
                }}>
                    ⚠️ Duplicated
                </div>
            )}
            <InputText 
                type="text" 
                value={localValue}
                onChange={handleChange}
                style={{ 
                    width: '100%',
                    borderColor: isDuplicate ? '#ef4444' : undefined,
                    backgroundColor: isDuplicate ? 'rgba(239, 68, 68, 0.1)' : undefined,
                    borderWidth: isDuplicate ? '2px' : undefined
                }}
                className={isDuplicate ? 'p-invalid' : ''}
            />
        </div>
    );
};

export default function FlexibleScrollDemo() {
    const menuRef = useRef(null);
    const [routes, setRoutes] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogData, setDialogData] = useState([]);
    const [currentRouteId, setCurrentRouteId] = useState(null);
    const [currentRouteName, setCurrentRouteName] = useState('');
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
    
    // Custom Sort State
    const [customSortMode, setCustomSortMode] = useState(false);
    const [sortOrders, setSortOrders] = useState({});
    const [isCustomSorted, setIsCustomSorted] = useState(false); // Track if data is custom sorted
    
    // Delete Confirmation State
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteType, setDeleteType] = useState(null); // 'route' or 'location'
    
    // Image Management State
    const [imageDialogVisible, setImageDialogVisible] = useState(false);
    const [currentRowImages, setCurrentRowImages] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [editingImageIndex, setEditingImageIndex] = useState(null);
    
    // Power Mode Modal State
    const [powerModeDialogVisible, setPowerModeDialogVisible] = useState(false);
    const [selectedPowerMode, setSelectedPowerMode] = useState('Daily');
    const [powerModeRowId, setPowerModeRowId] = useState(null);
    
    // Info Modal Edit State
    const [infoEditMode, setInfoEditMode] = useState(false);
    const [infoEditData, setInfoEditData] = useState({
        latitude: null,
        longitude: null,
        address: ''
    });
    
    // Password Protection State
    const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    
    // Change Password Dialog State
    const [changePasswordDialogVisible, setChangePasswordDialogVisible] = useState(false);
    const [changePasswordData, setChangePasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changePasswordError, setChangePasswordError] = useState('');

    useEffect(() => {
        console.log('Component mounted - Loading data...');
        
        // Simulate smart loading intro
        const loadData = async () => {
            try {
                // Check if we should clear data (for fresh start)
                const shouldClear = localStorage.getItem('clearDataOnLoad');
                if (shouldClear === 'true') {
                    console.log('Clearing localStorage...');
                    localStorage.removeItem('routes');
                    localStorage.removeItem('locations');
                    localStorage.removeItem('clearDataOnLoad');
                }
                
                const data = await CustomerService.getRoutes();
                console.log('Data loaded:', data);
                
                // Smart loading delay for smooth intro
                await new Promise(resolve => setTimeout(resolve, 800));
                
                setRoutes(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };
        
        loadData();
    }, []);

    useEffect(() => {
        // Apply dark/light mode class to body
        document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    }, [darkMode]);

    const dialogFooterTemplate = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {/* Data Source Indicator */}
                    <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0',
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                    }}>
                        <span style={{ color: isCustomSorted ? '#1e40af' : '#065f46' }}>
                            {isCustomSorted ? '📊 Custom Sorted' : '🗄️ Original Database Order'}
                        </span>
                    </div>
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
                    {editMode && hasUnsavedChanges && (
                        <>
                            <Button 
                                label="Cancel Changes" 
                                icon="pi pi-undo" 
                                onClick={handleCancelChanges} 
                                severity="danger"
                                size="small"
                                outlined
                                disabled={saving}
                            />
                            <Button 
                                label={saving ? "Saving..." : "Save Changes"} 
                                icon={saving ? "pi pi-spin pi-spinner" : "pi pi-save"} 
                                onClick={handleSaveChanges} 
                                severity="success"
                                size="small"
                                disabled={saving}
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
            
            // Power OFF goes to bottom, Power ON stays at top
            if (statusA === 'OFF' && statusB === 'ON') return 1;
            if (statusA === 'ON' && statusB === 'OFF') return -1;
            
            // If both have same status, sort by code (ascending)
            const codeA = parseInt(a.code) || 0;
            const codeB = parseInt(b.code) || 0;
            return codeA - codeB;
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
        setInfoEditData({
            latitude: rowData.latitude || null,
            longitude: rowData.longitude || null,
            address: rowData.address || ''
        });
        setInfoEditMode(false);
        setInfoDialogVisible(true);
    };
    
    const handleSaveInfoEdit = async () => {
        if (!selectedRowInfo) return;
        
        try {
            // Update the location in dialogData
            const updatedDialogData = dialogData.map(item => {
                if (item.id === selectedRowInfo.id) {
                    return {
                        ...item,
                        latitude: infoEditData.latitude,
                        longitude: infoEditData.longitude,
                        address: infoEditData.address
                    };
                }
                return item;
            });
            
            setDialogData(updatedDialogData);
            
            // Update the location in routes
            const updatedRoutes = routes.map(route => ({
                ...route,
                locations: route.locations.map(loc => {
                    if (loc.id === selectedRowInfo.id) {
                        return {
                            ...loc,
                            latitude: infoEditData.latitude,
                            longitude: infoEditData.longitude,
                            address: infoEditData.address
                        };
                    }
                    return loc;
                })
            }));
            
            setRoutes(updatedRoutes);
            setHasUnsavedChanges(true);
            
            // Update selectedRowInfo
            setSelectedRowInfo({
                ...selectedRowInfo,
                latitude: infoEditData.latitude,
                longitude: infoEditData.longitude,
                address: infoEditData.address
            });
            
            setInfoEditMode(false);
        } catch (error) {
            console.error('Error saving info:', error);
        }
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
        if (editMode) {
            // Exiting edit mode
            if (hasUnsavedChanges) {
                const confirmed = window.confirm('⚠️ You have unsaved changes. Do you want to save before exiting edit mode?');
                if (confirmed) {
                    handleSaveChanges();
                }
            }
            setEditMode(false);
        } else {
            // Entering edit mode - show password dialog
            setPasswordInput('');
            setPasswordError('');
            setPasswordDialogVisible(true);
        }
    };
    
    const handlePasswordSubmit = () => {
        const storedPassword = localStorage.getItem('editModePassword') || '1234';
        
        if (passwordInput === storedPassword) {
            setPasswordLoading(true);
            setPasswordError('');
            
            // Simulate loading
            setTimeout(() => {
                setPasswordLoading(false);
                setPasswordDialogVisible(false);
                setPasswordInput('');
                
                // Enter edit mode
                setOriginalData([...routes]);
                setOriginalDialogData([...dialogData]);
                setHasUnsavedChanges(false);
                setEditMode(true);
            }, 800);
        } else {
            setPasswordError('Incorrect password. Please try again.');
            setPasswordInput('');
        }
    };
    
    const handleChangePassword = () => {
        const storedPassword = localStorage.getItem('editModePassword') || '1234';
        const { currentPassword, newPassword, confirmPassword } = changePasswordData;
        
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setChangePasswordError('All fields are required');
            return;
        }
        
        if (currentPassword !== storedPassword) {
            setChangePasswordError('Current password is incorrect');
            return;
        }
        
        if (newPassword.length !== 4 || !/^\d+$/.test(newPassword)) {
            setChangePasswordError('New password must be exactly 4 digits');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setChangePasswordError('New password and confirm password do not match');
            return;
        }
        
        // Save new password
        localStorage.setItem('editModePassword', newPassword);
        setChangePasswordDialogVisible(false);
        setChangePasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setChangePasswordError('');
        
        alert('✅ Password changed successfully!');
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
        const tempId = Date.now(); // Use timestamp for temporary ID
        const newNo = dialogData.length > 0 ? Math.max(...dialogData.map(d => d.no)) + 1 : 1;
        const newRow = {
            id: tempId,
            no: newNo,
            code: `${newNo * 10}`,
            location: 'New Location',
            delivery: 'Daily',
            images: [],
            powerMode: 'Daily',
            routeId: currentRouteId // Link to current route
        };
        setDialogData(sortDialogData([...dialogData, newRow]));
        setHasUnsavedChanges(true);
        console.log('Added new dialog row with routeId:', newRow);
    };

    const handleDeleteDialogRow = (rowId) => {
        const rowToDelete = dialogData.find(data => data.id === rowId);
        setDeleteTarget({ id: rowId, data: rowToDelete });
        setDeleteType('location');
        setDeleteConfirmVisible(true);
    };
    
    const confirmDelete = () => {
        if (deleteType === 'location') {
            const updatedData = dialogData.filter(data => data.id !== deleteTarget.id);
            setDialogData(sortDialogData(updatedData));
            setHasUnsavedChanges(true);
            console.log('Deleted dialog row:', deleteTarget.id);
        } else if (deleteType === 'route') {
            const updatedRoutes = routes.filter(route => route.id !== deleteTarget.id);
            setRoutes(updatedRoutes);
            setHasUnsavedChanges(true);
            console.log('Deleted row:', deleteTarget.id);
        }
        setDeleteConfirmVisible(false);
        setDeleteTarget(null);
        setDeleteType(null);
    };
    
    const cancelDelete = () => {
        setDeleteConfirmVisible(false);
        setDeleteTarget(null);
        setDeleteType(null);
    };
    
    const handleOpenImageDialog = (rowData) => {
        setSelectedRowId(rowData.id);
        setCurrentRowImages(rowData.images || []);
        setImageDialogVisible(true);
        setImageUrlInput('');
        setEditingImageIndex(null);
    };
    
    const handleAddImageUrl = () => {
        if (imageUrlInput.trim()) {
            const newImages = [...currentRowImages, imageUrlInput.trim()];
            setCurrentRowImages(newImages);
            setImageUrlInput('');
        }
    };
    
    const handleEditImage = (index) => {
        setEditingImageIndex(index);
        setImageUrlInput(currentRowImages[index]);
    };
    
    const handleUpdateImage = () => {
        if (editingImageIndex !== null && imageUrlInput.trim()) {
            const newImages = [...currentRowImages];
            newImages[editingImageIndex] = imageUrlInput.trim();
            setCurrentRowImages(newImages);
            setImageUrlInput('');
            setEditingImageIndex(null);
        }
    };
    
    const handleDeleteImage = (index) => {
        const newImages = currentRowImages.filter((_, i) => i !== index);
        setCurrentRowImages(newImages);
    };
    
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImages = [...currentRowImages, e.target.result];
                setCurrentRowImages(newImages);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveImages = () => {
        const updatedData = dialogData.map(data => 
            data.id === selectedRowId ? { ...data, images: currentRowImages } : data
        );
        setDialogData(sortDialogData(updatedData));
        setHasUnsavedChanges(true);
        setImageDialogVisible(false);
        console.log('Images saved for row:', selectedRowId, currentRowImages);
    };
    
    const handleOpenPowerModeDialog = (rowData) => {
        setPowerModeRowId(rowData.id);
        setSelectedPowerMode(rowData.powerMode || 'Daily');
        setPowerModeDialogVisible(true);
    };
    
    const handleSavePowerMode = () => {
        const updatedData = dialogData.map(data => 
            data.id === powerModeRowId ? { ...data, powerMode: selectedPowerMode } : data
        );
        setDialogData(sortDialogData(updatedData));
        setHasUnsavedChanges(true);
        setPowerModeDialogVisible(false);
        console.log('Power mode saved for row:', powerModeRowId, selectedPowerMode);
    };

    const handleAddRow = () => {
        // Use timestamp for temporary ID (will be replaced by database auto-increment)
        const tempId = Date.now();
        const newRow = {
            id: tempId,
            route: '',
            shift: '',
            warehouse: ''
        };
        setRoutes([...routes, newRow]);
        setHasUnsavedChanges(true);
        console.log('Added new row:', newRow);
    };

    const handleDeleteRow = (rowId) => {
        const rowToDelete = routes.find(route => route.id === rowId);
        setDeleteTarget({ id: rowId, data: rowToDelete });
        setDeleteType('route');
        setDeleteConfirmVisible(true);
    };

    const textEditor = (options) => {
        // Use duplicate check editor for 'code' field
        if (options.field === 'code') {
            return <DuplicateCheckEditor options={options} allData={dialogData} field="code" darkMode={darkMode} />;
        }
        // Regular editor for other fields
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} style={{ width: '100%' }} />;
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;
        
        // Check for duplicate 'route' values
        if (field === 'route' && newValue !== rowData[field]) {
            const isDuplicate = routes.some(item => 
                item.route === newValue && item.id !== rowData.id
            );
            
            if (isDuplicate) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Duplicate Route',
                    detail: `Route "${newValue}" already exists! Please use a unique route name.`,
                    life: 3000
                });
                return; // Prevent save
            }
        }
        
        if (newValue !== rowData[field]) {
            handleUpdateRow(rowData.id, field, newValue);
        }
    };

    const onDialogCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;
        
        // Check for duplicate 'code' values
        if (field === 'code' && newValue !== rowData[field]) {
            const isDuplicate = dialogData.some(item => 
                item.code === newValue && item.id !== rowData.id
            );
            
            if (isDuplicate) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Duplicate Code',
                    detail: `Code "${newValue}" already exists! Please use a unique code.`,
                    life: 3000
                });
                return; // Prevent save
            }
        }
        
        if (newValue !== rowData[field]) {
            handleUpdateDialogData(rowData.id, field, newValue);
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Button 
                    icon="pi pi-list" 
                    size="small"
                    tooltip="Show"
                    tooltipOptions={{ position: 'top' }}
                    text
                    onClick={() => {
                        setCurrentRouteId(rowData.id);
                        setCurrentRouteName(rowData.route);
                        CustomerService.getDetailData(rowData.id).then((data) => {
                            setDialogData(sortDialogData(data));
                            setOriginalDialogData(sortDialogData(data));
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
                                setCurrentRouteId(rowData.id);
                                setCurrentRouteName(rowData.route);
                                CustomerService.getDetailData(rowData.id).then((data) => {
                                    setDialogData(sortDialogData(data));
                                    setOriginalDialogData(sortDialogData(data));
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

    const handleClearAllData = () => {
        if (confirm('⚠️ Clear All Data?\n\nThis will delete ALL routes and locations from localStorage.\nYou will start with a fresh empty database.\n\nThis action cannot be undone!')) {
            localStorage.removeItem('routes');
            localStorage.removeItem('locations');
            localStorage.removeItem('editModePassword');
            localStorage.setItem('clearDataOnLoad', 'true');
            alert('✅ Data cleared! Reloading page...');
            window.location.reload();
        }
    };

    // Menu items configuration
    const menuItems = [
        ...(editMode && hasUnsavedChanges ? [{
            template: () => (
                <div style={{
                    backgroundColor: darkMode ? '#fbbf24' : '#fef3c7',
                    color: darkMode ? '#000000' : '#92400e',
                    padding: '0.75rem 1rem',
                    margin: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: `2px solid ${darkMode ? '#f59e0b' : '#fbbf24'}`,
                    transition: 'all 0.3s ease'
                }}>
                    <i className="pi pi-exclamation-triangle"></i>
                    Unsaved Changes
                </div>
            )
        }] : []),
        {
            label: darkMode ? 'Light Mode' : 'Dark Mode',
            icon: darkMode ? 'pi pi-sun' : 'pi pi-moon',
            command: () => setDarkMode(!darkMode)
        },
        {
            label: editMode ? 'View Mode' : 'Edit Mode',
            icon: editMode ? 'pi pi-eye' : 'pi pi-pencil',
            command: () => handleToggleEditMode(),
            disabled: saving
        },
        ...(editMode ? [
            {
                label: 'Change Password',
                icon: 'pi pi-lock',
                command: () => setChangePasswordDialogVisible(true)
            },
            { separator: true },
            {
                label: 'Clear All Data',
                icon: 'pi pi-trash',
                command: () => handleClearAllData(),
                className: 'menu-danger-item',
                style: { color: '#ef4444' }
            }
        ] : []),
        ...(editMode && hasUnsavedChanges ? [
            { separator: true },
            {
                label: saving ? 'Saving...' : 'Save Changes',
                icon: saving ? 'pi pi-spin pi-spinner' : 'pi pi-save',
                command: () => handleSaveChanges(),
                disabled: saving,
                className: 'menu-save-item'
            },
            {
                label: 'Cancel',
                icon: 'pi pi-times',
                command: () => handleCancelChanges(),
                disabled: saving,
                className: 'menu-cancel-item'
            }
        ] : [])
    ];

    // Loading state with smooth animation
    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: 'fadeIn 0.5s ease-in'
            }}>
                <style>
                    {`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); opacity: 1; }
                            50% { transform: scale(1.1); opacity: 0.8; }
                        }
                        @keyframes slideUp {
                            from { transform: translateY(20px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}
                </style>
                <div style={{
                    animation: 'pulse 1.5s ease-in-out infinite',
                    marginBottom: '2rem'
                }}>
                    <i className="pi pi-spin pi-spinner" style={{ 
                        fontSize: '4rem', 
                        color: '#ffffff'
                    }}></i>
                </div>
                <h2 style={{
                    color: '#ffffff',
                    fontSize: '2rem',
                    fontWeight: '700',
                    margin: '0 0 0.5rem 0',
                    animation: 'slideUp 0.6s ease-out',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>Route Management</h2>
                <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1.1rem',
                    margin: 0,
                    animation: 'slideUp 0.8s ease-out',
                    textShadow: '0 1px 5px rgba(0,0,0,0.2)'
                }}>Loading your data...</p>
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
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'fadeIn 0.6s ease-out'
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
                boxShadow: darkMode ? '0 4px 16px rgba(0, 0, 0, 0.6)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <h2 style={{ 
                    margin: 0, 
                    color: darkMode ? '#e5e5e5' : '#000000',
                    fontSize: '25px',
                    fontWeight: '700'
                }}>{editMode ? 'Edit Mode' : 'Route Management'}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Menu 
                        model={menuItems} 
                        popup 
                        ref={menuRef}
                        style={{ 
                            minWidth: '250px',
                            background: darkMode ? '#1a1a1a' : '#ffffff',
                            border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
                        }}
                    />
                    <Button 
                        icon="pi pi-bars"
                        label="Menu"
                        onClick={(e) => menuRef.current.toggle(e)}
                        severity="info"
                        size="small"
                        raised
                        badge={editMode && hasUnsavedChanges ? "!" : null}
                        badgeSeverity="warning"
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
                    <Column 
                        header="Action" 
                        align="center" 
                        alignHeader="center" 
                        body={actionBodyTemplate}
                        headerStyle={{ color: '#ef4444' }}
                    />
                </DataTable>

                <Dialog 
                    header={`Route ${currentRouteName}`} 
                    visible={dialogVisible} 
                    style={{ width: '90vw' }} 
                    maximizable
                    modal
                    closeOnEscape
                    dismissableMask 
                    contentStyle={{ height: '500px' }} 
                    onHide={() => setDialogVisible(false)} 
                    footer={dialogFooterTemplate}
                    headerStyle={{ color: darkMode ? '#fff' : '#000' }}
                    headerClassName={darkMode ? '' : 'light-mode-dialog-header'}
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
                            border: darkMode ? 'none' : '1px solid #ddd', 
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
                                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: darkMode ? 'none' : '2px solid #ddd', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Urutan</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: darkMode ? 'none' : '2px solid #ddd', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>No</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: darkMode ? 'none' : '2px solid #ddd', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Code</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: darkMode ? 'none' : '2px solid #ddd', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Location</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', borderBottom: darkMode ? 'none' : '2px solid #ddd', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Delivery</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dialogData.map((rowData) => {
                                        const order = sortOrders[rowData.id];
                                        const isDuplicate = isOrderDuplicate(rowData.id, order);
                                        return (
                                            <tr key={rowData.id} style={{ borderBottom: darkMode ? 'none' : '1px solid #eee' }}>
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
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600' }}>{rowData.no}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600' }}>{rowData.code}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600' }}>{rowData.location}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600' }}>{rowData.delivery}</td>
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
                        globalFilter={globalFilterValue}
                        resizableColumns
                        columnResizeMode="expand"
                        rowClassName={(rowData) => {
                            const status = getPowerStatus(rowData.powerMode || 'Daily');
                            return status === 'OFF' ? 'row-disabled' : '';
                        }}
                    >
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
                                style={{ width: '60px' }}
                            />
                        )}
                        {visibleColumns.no && (
                            <Column 
                                header="No" 
                                align="center" 
                                alignHeader="center"
                                body={(data, options) => options.rowIndex + 1}
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
                                style={{ width: '60px' }}
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
                                style={{ width: '100px' }}
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
                                        return (
                                            <div style={{
                                                width: '60px',
                                                height: '45px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: darkMode ? '#2a2a2a' : '#f3f4f6',
                                                borderRadius: '8px',
                                                border: `2px dashed ${darkMode ? '#404040' : '#d1d5db'}`,
                                                position: 'relative',
                                                margin: '0 auto'
                                            }}>
                                                <i className="pi pi-image" style={{ 
                                                    fontSize: '1.5rem', 
                                                    color: '#9ca3af'
                                                }}></i>
                                            </div>
                                        );
                                    }
                                    
                                    // Use the new ImageLightbox component
                                    return (
                                        <ImageLightbox 
                                            images={rowData.images} 
                                            rowId={rowData.id}
                                        />
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
                            headerStyle={{ color: '#ef4444' }}
                            body={(rowData) => (
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {/* Info Button - Always visible */}
                                    <Button 
                                        icon="pi pi-info-circle" 
                                        size="small"
                                        severity="info"
                                        tooltip="View Location Info"
                                        tooltipOptions={{ position: 'top' }}
                                        text
                                        onClick={() => handleShowInfo(rowData)}
                                        style={{ backgroundColor: darkMode ? '#1a1a1a' : undefined }}
                                    />

                                    {/* Power Mode - Icon Button in Edit Mode, Icon in View Mode */}
                                    {editMode ? (
                                        <Button 
                                            icon="pi pi-power-off" 
                                            size="small"
                                            severity={getPowerStatus(rowData.powerMode || 'Daily') === 'ON' ? 'success' : 'danger'}
                                            tooltip={`${rowData.powerMode || 'Daily'} - ${getPowerStatus(rowData.powerMode || 'Daily')}`}
                                            tooltipOptions={{ position: 'top' }}
                                            text
                                            onClick={() => handleOpenPowerModeDialog(rowData)}
                                            style={{ 
                                                color: getPowerColor(rowData.powerMode || 'Daily'),
                                                backgroundColor: darkMode ? '#1a1a1a' : undefined
                                            }}
                                        />
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

                                    {/* Image Management Button - Only in Edit Mode */}
                                    {editMode && (
                                        <Button 
                                            icon={rowData.images && rowData.images.length > 0 ? "pi pi-images" : "pi pi-image"}
                                            size="small"
                                            severity={rowData.images && rowData.images.length > 0 ? "success" : "secondary"}
                                            tooltip={rowData.images && rowData.images.length > 0 ? "Manage Images" : "Add Images"}
                                            tooltipOptions={{ position: 'top' }}
                                            text
                                            onClick={() => handleOpenImageDialog(rowData)}
                                            style={{ backgroundColor: darkMode ? '#1a1a1a' : undefined }}
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
                    header={
                        <div style={{ 
                            textAlign: 'center', 
                            fontSize: '12px',
                            padding: '8px 0'
                        }}>
                            {selectedRowInfo && `${selectedRowInfo.code} - ${selectedRowInfo.location}`}
                        </div>
                    }
                    visible={infoDialogVisible} 
                    style={{ width: '500px' }} 
                    modal
                    dismissableMask
                    closeOnEscape
                    onHide={() => {
                        setInfoDialogVisible(false);
                        setInfoEditMode(false);
                    }}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                {!infoEditMode && editMode ? (
                                    <Button 
                                        label="Edit Location Info" 
                                        icon="pi pi-pencil" 
                                        onClick={() => setInfoEditMode(true)}
                                        className="p-button-sm"
                                    />
                                ) : infoEditMode ? (
                                    <>
                                        <Button 
                                            label="Save" 
                                            icon="pi pi-check" 
                                            onClick={handleSaveInfoEdit}
                                            className="p-button-sm p-button-success"
                                            style={{ marginRight: '8px' }}
                                        />
                                        <Button 
                                            label="Cancel" 
                                            icon="pi pi-times" 
                                            onClick={() => {
                                                setInfoEditMode(false);
                                                setInfoEditData({
                                                    latitude: selectedRowInfo.latitude || null,
                                                    longitude: selectedRowInfo.longitude || null,
                                                    address: selectedRowInfo.address || ''
                                                });
                                            }}
                                            className="p-button-sm p-button-secondary"
                                        />
                                    </>
                                ) : null}
                            </div>
                            <Button 
                                label="Close" 
                                icon="pi pi-times" 
                                onClick={() => {
                                    setInfoDialogVisible(false);
                                    setInfoEditMode(false);
                                }}
                                className="p-button-sm p-button-text"
                            />
                        </div>
                    }
                >
                    {selectedRowInfo && (
                        <div style={{ padding: '0' }}>
                            {/* Mini Map Section */}
                            {!infoEditMode ? (
                                <MiniMap 
                                    latitude={selectedRowInfo.latitude}
                                    longitude={selectedRowInfo.longitude}
                                    address={selectedRowInfo.address}
                                    style={{ marginBottom: '20px' }}
                                />
                            ) : (
                                <div style={{ 
                                    marginBottom: '20px',
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6'
                                }}>
                                    <h4 style={{ 
                                        marginTop: 0, 
                                        marginBottom: '15px',
                                        fontSize: '14px',
                                        color: '#495057'
                                    }}>
                                        <i className="pi pi-map-marker" style={{ marginRight: '8px' }}></i>
                                        Edit Location Information
                                    </h4>
                                    
                                    <div style={{ marginBottom: '12px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '5px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#495057'
                                        }}>
                                            Latitude
                                        </label>
                                        <InputText 
                                            value={infoEditData.latitude || ''}
                                            onChange={(e) => setInfoEditData({
                                                ...infoEditData,
                                                latitude: e.target.value ? parseFloat(e.target.value) : null
                                            })}
                                            placeholder="Enter latitude (e.g., 3.139)"
                                            style={{ width: '100%' }}
                                            type="number"
                                            step="any"
                                        />
                                    </div>
                                    
                                    <div style={{ marginBottom: '12px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '5px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#495057'
                                        }}>
                                            Longitude
                                        </label>
                                        <InputText 
                                            value={infoEditData.longitude || ''}
                                            onChange={(e) => setInfoEditData({
                                                ...infoEditData,
                                                longitude: e.target.value ? parseFloat(e.target.value) : null
                                            })}
                                            placeholder="Enter longitude (e.g., 101.6869)"
                                            style={{ width: '100%' }}
                                            type="number"
                                            step="any"
                                        />
                                    </div>
                                    
                                    <div style={{ marginBottom: '0' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '5px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#495057'
                                        }}>
                                            Address / Caption
                                        </label>
                                        <InputText 
                                            value={infoEditData.address || ''}
                                            onChange={(e) => setInfoEditData({
                                                ...infoEditData,
                                                address: e.target.value
                                            })}
                                            placeholder="Enter address or location caption"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            {/* Other Information */}
                            <div style={{ 
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef'
                            }}>
                                <div style={{ 
                                    padding: '10px 15px',
                                    borderBottom: '1px solid #e9ecef',
                                    backgroundColor: '#f8f9fa'
                                }}>
                                    <strong style={{ fontSize: '13px', color: '#495057' }}>
                                        <i className="pi pi-info-circle" style={{ marginRight: '8px' }}></i>
                                        General Information
                                    </strong>
                                </div>
                                <div style={{ padding: '15px' }}>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '10px',
                                        fontSize: '13px'
                                    }}>
                                        <div>
                                            <strong style={{ color: '#6c757d' }}>No:</strong>
                                            <div style={{ marginTop: '3px' }}>{selectedRowInfo.no}</div>
                                        </div>
                                        <div>
                                            <strong style={{ color: '#6c757d' }}>Code:</strong>
                                            <div style={{ marginTop: '3px' }}>{selectedRowInfo.code}</div>
                                        </div>
                                        <div>
                                            <strong style={{ color: '#6c757d' }}>Delivery:</strong>
                                            <div style={{ marginTop: '3px' }}>{selectedRowInfo.delivery}</div>
                                        </div>
                                        <div>
                                            <strong style={{ color: '#6c757d' }}>Power Mode:</strong>
                                            <div style={{ marginTop: '3px' }}>{selectedRowInfo.powerMode || 'Daily'}</div>
                                        </div>
                                        <div>
                                            <strong style={{ color: '#6c757d' }}>Current Status:</strong>
                                            <div style={{ 
                                                marginTop: '3px',
                                                color: getPowerColor(selectedRowInfo.powerMode || 'Daily'), 
                                                fontWeight: 'bold' 
                                            }}>
                                                {getPowerStatus(selectedRowInfo.powerMode || 'Daily')}
                                            </div>
                                        </div>
                                        <div>
                                            <strong style={{ color: '#6c757d' }}>Total Images:</strong>
                                            <div style={{ marginTop: '3px' }}>
                                                {selectedRowInfo.images ? selectedRowInfo.images.length : 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Dialog>



                {/* Password Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="pi pi-lock" style={{ fontSize: '1.2rem', color: '#3b82f6' }}></i>
                            <span>Enter Password</span>
                        </div>
                    }
                    visible={passwordDialogVisible}
                    style={{ width: '400px' }}
                    modal
                    closable={!passwordLoading}
                    onHide={() => {
                        if (!passwordLoading) {
                            setPasswordDialogVisible(false);
                            setPasswordInput('');
                            setPasswordError('');
                        }
                    }}
                >
                    <div style={{ padding: '1rem' }}>
                        <p style={{ marginBottom: '1rem', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                            Please enter your 4-digit password to access Edit Mode
                        </p>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem',
                                fontWeight: 'bold',
                                color: darkMode ? '#e5e5e5' : '#000000'
                            }}>
                                Password
                            </label>
                            <InputText
                                type="password"
                                value={passwordInput}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 4 && /^\d*$/.test(value)) {
                                        setPasswordInput(value);
                                        setPasswordError('');
                                    }
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && passwordInput.length === 4 && !passwordLoading) {
                                        handlePasswordSubmit();
                                    }
                                }}
                                placeholder="Enter 4-digit password"
                                maxLength={4}
                                style={{ width: '100%' }}
                                disabled={passwordLoading}
                                autoFocus
                            />
                        </div>
                        
                        {passwordError && (
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                borderRadius: '6px',
                                marginBottom: '1rem',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <i className="pi pi-times-circle"></i>
                                {passwordError}
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => {
                                    setPasswordDialogVisible(false);
                                    setPasswordInput('');
                                    setPasswordError('');
                                }}
                                className="p-button-text"
                                disabled={passwordLoading}
                            />
                            <Button
                                label={passwordLoading ? "Verifying..." : "Submit"}
                                icon={passwordLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                                onClick={handlePasswordSubmit}
                                disabled={passwordInput.length !== 4 || passwordLoading}
                                severity="success"
                            />
                        </div>
                    </div>
                </Dialog>

                {/* Change Password Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="pi pi-key" style={{ fontSize: '1.2rem', color: '#3b82f6' }}></i>
                            <span>Change Password</span>
                        </div>
                    }
                    visible={changePasswordDialogVisible}
                    style={{ width: '450px' }}
                    modal
                    onHide={() => {
                        setChangePasswordDialogVisible(false);
                        setChangePasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        });
                        setChangePasswordError('');
                    }}
                >
                    <div style={{ padding: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem',
                                fontWeight: 'bold',
                                color: darkMode ? '#e5e5e5' : '#000000'
                            }}>
                                Current Password
                            </label>
                            <InputText
                                type="password"
                                value={changePasswordData.currentPassword}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 4 && /^\d*$/.test(value)) {
                                        setChangePasswordData({
                                            ...changePasswordData,
                                            currentPassword: value
                                        });
                                        setChangePasswordError('');
                                    }
                                }}
                                placeholder="Enter current password"
                                maxLength={4}
                                style={{ width: '100%' }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem',
                                fontWeight: 'bold',
                                color: darkMode ? '#e5e5e5' : '#000000'
                            }}>
                                New Password
                            </label>
                            <InputText
                                type="password"
                                value={changePasswordData.newPassword}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 4 && /^\d*$/.test(value)) {
                                        setChangePasswordData({
                                            ...changePasswordData,
                                            newPassword: value
                                        });
                                        setChangePasswordError('');
                                    }
                                }}
                                placeholder="Enter new 4-digit password"
                                maxLength={4}
                                style={{ width: '100%' }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem',
                                fontWeight: 'bold',
                                color: darkMode ? '#e5e5e5' : '#000000'
                            }}>
                                Confirm New Password
                            </label>
                            <InputText
                                type="password"
                                value={changePasswordData.confirmPassword}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 4 && /^\d*$/.test(value)) {
                                        setChangePasswordData({
                                            ...changePasswordData,
                                            confirmPassword: value
                                        });
                                        setChangePasswordError('');
                                    }
                                }}
                                placeholder="Confirm new password"
                                maxLength={4}
                                style={{ width: '100%' }}
                            />
                        </div>
                        
                        {changePasswordError && (
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                borderRadius: '6px',
                                marginBottom: '1rem',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <i className="pi pi-times-circle"></i>
                                {changePasswordError}
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => {
                                    setChangePasswordDialogVisible(false);
                                    setChangePasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                    setChangePasswordError('');
                                }}
                                className="p-button-text"
                            />
                            <Button
                                label="Change Password"
                                icon="pi pi-check"
                                onClick={handleChangePassword}
                                severity="success"
                            />
                        </div>
                    </div>
                </Dialog>

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

                {/* Delete Confirmation Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-exclamation-triangle" style={{ color: '#f59e0b', fontSize: '1.5rem' }}></i>
                            <span>Confirm Delete</span>
                        </div>
                    }
                    visible={deleteConfirmVisible}
                    style={{ width: '450px' }}
                    modal
                    onHide={cancelDelete}
                    footer={
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={cancelDelete}
                                severity="secondary"
                                size="small"
                                outlined
                            />
                            <Button
                                label="Delete"
                                icon="pi pi-trash"
                                onClick={confirmDelete}
                                severity="danger"
                                size="small"
                                raised
                            />
                        </div>
                    }
                >
                    <div style={{ padding: '1rem 0' }}>
                        <p style={{ 
                            margin: '0 0 1rem 0',
                            fontSize: '1rem',
                            color: darkMode ? '#e5e5e5' : '#000000'
                        }}>
                            Are you sure you want to delete this {deleteType === 'location' ? 'location' : 'route'}?
                        </p>
                        {deleteTarget && deleteTarget.data && (
                            <div style={{
                                backgroundColor: darkMode ? '#2a2a2a' : '#f3f4f6',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: `2px solid ${darkMode ? '#404040' : '#e5e7eb'}`
                            }}>
                                {deleteType === 'location' ? (
                                    <>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong>Code:</strong> {deleteTarget.data.code}
                                        </div>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong>Location:</strong> {deleteTarget.data.location}
                                        </div>
                                        <div>
                                            <strong>Delivery:</strong> {deleteTarget.data.delivery}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong>Route:</strong> {deleteTarget.data.route}
                                        </div>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong>Shift:</strong> {deleteTarget.data.shift}
                                        </div>
                                        <div>
                                            <strong>Warehouse:</strong> {deleteTarget.data.warehouse}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        <p style={{ 
                            margin: '1rem 0 0 0',
                            fontSize: '0.875rem',
                            color: '#ef4444',
                            fontWeight: 'bold'
                        }}>
                            ⚠️ This action cannot be undone!
                        </p>
                    </div>
                </Dialog>

                {/* Image Management Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-images" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i>
                            <span>Manage Images</span>
                        </div>
                    }
                    visible={imageDialogVisible}
                    style={{ width: '600px' }}
                    modal
                    onHide={() => setImageDialogVisible(false)}
                    footer={
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => setImageDialogVisible(false)}
                                severity="secondary"
                                size="small"
                                outlined
                            />
                            <Button
                                label="Save"
                                icon="pi pi-check"
                                onClick={handleSaveImages}
                                severity="success"
                                size="small"
                                raised
                            />
                        </div>
                    }
                >
                    <div style={{ padding: '1rem 0' }}>
                        {/* Add Image by URL */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 'bold',
                                color: darkMode ? '#e5e5e5' : '#000000'
                            }}>
                                {editingImageIndex !== null ? 'Edit Image URL:' : 'Add Image by URL:'}
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <InputText
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    placeholder="Enter image URL..."
                                    style={{ flex: 1 }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            editingImageIndex !== null ? handleUpdateImage() : handleAddImageUrl();
                                        }
                                    }}
                                />
                                {editingImageIndex !== null ? (
                                    <>
                                        <Button
                                            label="Update"
                                            icon="pi pi-check"
                                            onClick={handleUpdateImage}
                                            severity="success"
                                            size="small"
                                        />
                                        <Button
                                            label="Cancel"
                                            icon="pi pi-times"
                                            onClick={() => {
                                                setEditingImageIndex(null);
                                                setImageUrlInput('');
                                            }}
                                            severity="secondary"
                                            size="small"
                                            outlined
                                        />
                                    </>
                                ) : (
                                    <Button
                                        label="Add"
                                        icon="pi pi-plus"
                                        onClick={handleAddImageUrl}
                                        severity="info"
                                        size="small"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Upload Image from File */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 'bold',
                                color: darkMode ? '#e5e5e5' : '#000000'
                            }}>
                                Or Upload Image:
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                style={{
                                    padding: '0.5rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    width: '100%',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>

                        {/* Current Images List */}
                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 'bold',
                                color: darkMode ? '#e5e5e5' : '#000000'
                            }}>
                                Current Images ({currentRowImages.length}):
                            </label>
                            {currentRowImages.length === 0 ? (
                                <div style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    backgroundColor: darkMode ? '#2a2a2a' : '#f3f4f6',
                                    borderRadius: '8px',
                                    color: darkMode ? '#9ca3af' : '#6b7280'
                                }}>
                                    <i className="pi pi-image" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                                    <p>No images added yet</p>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    {currentRowImages.map((img, index) => (
                                        <div key={index} style={{
                                            position: 'relative',
                                            border: `2px solid ${darkMode ? '#404040' : '#e5e7eb'}`,
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            backgroundColor: darkMode ? '#2a2a2a' : '#ffffff'
                                        }}>
                                            <img
                                                src={img}
                                                alt={`Image ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: '6px',
                                                    marginBottom: '0.5rem'
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                                <Button
                                                    icon="pi pi-pencil"
                                                    size="small"
                                                    severity="info"
                                                    text
                                                    tooltip="Edit"
                                                    onClick={() => handleEditImage(index)}
                                                />
                                                <Button
                                                    icon="pi pi-trash"
                                                    size="small"
                                                    severity="danger"
                                                    text
                                                    tooltip="Delete"
                                                    onClick={() => handleDeleteImage(index)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Dialog>

                {/* Power Mode Selection Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-power-off" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i>
                            <span>Power Mode Settings</span>
                        </div>
                    }
                    visible={powerModeDialogVisible}
                    style={{ width: '500px' }}
                    modal
                    onHide={() => setPowerModeDialogVisible(false)}
                    footer={
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => setPowerModeDialogVisible(false)}
                                severity="secondary"
                                size="small"
                                outlined
                            />
                            <Button
                                label="Save"
                                icon="pi pi-check"
                                onClick={handleSavePowerMode}
                                severity="success"
                                size="small"
                                raised
                            />
                        </div>
                    }
                >
                    <div style={{ padding: '1rem 0' }}>
                        <p style={{ 
                            marginBottom: '1.5rem',
                            color: darkMode ? '#9ca3af' : '#6b7280',
                            fontSize: '0.875rem'
                        }}>
                            Select one power mode. Only one mode can be active at a time.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { 
                                    value: 'Daily', 
                                    label: 'Daily', 
                                    description: 'Always ON - Runs every day',
                                    icon: 'pi-sun'
                                },
                                { 
                                    value: 'Weekday', 
                                    label: 'Weekday', 
                                    description: 'OFF on Friday & Saturday',
                                    icon: 'pi-calendar'
                                },
                                { 
                                    value: 'Alt 1', 
                                    label: 'Alternate 1', 
                                    description: 'ON: Mon, Wed, Fri, Sun',
                                    icon: 'pi-chart-line'
                                },
                                { 
                                    value: 'Alt 2', 
                                    label: 'Alternate 2', 
                                    description: 'ON: Tue, Thu, Sat',
                                    icon: 'pi-chart-bar'
                                }
                            ].map((mode) => {
                                const isSelected = selectedPowerMode === mode.value;
                                const status = getPowerStatus(mode.value);
                                const color = getPowerColor(mode.value);
                                
                                return (
                                    <div
                                        key={mode.value}
                                        onClick={() => setSelectedPowerMode(mode.value)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1rem',
                                            border: `2px solid ${isSelected ? '#3b82f6' : (darkMode ? '#404040' : '#e5e7eb')}`,
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: isSelected 
                                                ? (darkMode ? '#1e3a5f' : '#dbeafe')
                                                : (darkMode ? '#2a2a2a' : '#ffffff'),
                                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                            boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.backgroundColor = darkMode ? '#353535' : '#f9fafb';
                                                e.currentTarget.style.borderColor = '#3b82f6';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.backgroundColor = darkMode ? '#2a2a2a' : '#ffffff';
                                                e.currentTarget.style.borderColor = darkMode ? '#404040' : '#e5e7eb';
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                            <i 
                                                className={`pi ${mode.icon}`}
                                                style={{ 
                                                    fontSize: '1.5rem',
                                                    color: isSelected ? '#3b82f6' : (darkMode ? '#9ca3af' : '#6b7280')
                                                }}
                                            ></i>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ 
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.25rem',
                                                    color: darkMode ? '#e5e5e5' : '#000000'
                                                }}>
                                                    {mode.label}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '0.75rem',
                                                    color: darkMode ? '#9ca3af' : '#6b7280'
                                                }}>
                                                    {mode.description}
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    backgroundColor: status === 'ON' ? '#dcfce7' : '#fee2e2',
                                                    color: status === 'ON' ? '#166534' : '#991b1b'
                                                }}>
                                                    {status}
                                                </span>
                                                {/* Custom Switch */}
                                                <div
                                                    style={{
                                                        width: '48px',
                                                        height: '24px',
                                                        borderRadius: '12px',
                                                        backgroundColor: isSelected ? '#3b82f6' : (darkMode ? '#4b5563' : '#d1d5db'),
                                                        position: 'relative',
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#ffffff',
                                                            position: 'absolute',
                                                            top: '2px',
                                                            left: isSelected ? '26px' : '2px',
                                                            transition: 'all 0.3s ease',
                                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}
