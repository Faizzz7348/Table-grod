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
import { useDeviceDetect, getResponsiveStyles } from './hooks/useDeviceDetect';
import { usePWAInstall } from './hooks/usePWAInstall';

// CSS untuk remove border dari table header
const tableStyles = `
    .no-header-border .p-datatable-thead > tr > th {
        border: none !important;
    }
    
    /* Table header background matching dialog header */
    .p-datatable .p-datatable-thead > tr > th {
        background-color: #e5e7eb !important;
        color: #111827 !important;
        font-weight: 600 !important;
        border-bottom: 1px solid #9ca3af !important;
        padding: 1rem !important;
    }
    
    body.dark .p-datatable .p-datatable-thead > tr > th {
        background-color: #0f172a !important;
        color: #f1f5f9 !important;
        border-bottom: 1px solid #334155 !important;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Custom editor component with duplicate detection
const DuplicateCheckEditor = ({ options, allData, field }) => {
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
    
    // Device Detection
    const deviceInfo = useDeviceDetect();
    const responsiveStyles = getResponsiveStyles(deviceInfo);
    
    // PWA Install
    const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
    
    const [routes, setRoutes] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogData, setDialogData] = useState([]);
    const [currentRouteId, setCurrentRouteId] = useState(null);
    const [currentRouteName, setCurrentRouteName] = useState('');
    
    // Frozen row data for dialog table
    const frozenRow = [
        {
            id: 'frozen-row',
            code: 'QLK',
            location: 'QL Kitchen',
            delivery: 'Available',
            images: [],
            powerMode: 'Daily'
        }
    ];
    
    // Dark Mode State - Simple implementation
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('isDark');
        return saved === 'true';
    });
    
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
    
    // Function Dropdown State
    const [functionDropdownVisible, setFunctionDropdownVisible] = useState(false);
    const [activeFunction, setActiveFunction] = useState(null); // 'setOrder' or 'addRow'
    
    // Column Visibility Modal State
    const [columnModalVisible, setColumnModalVisible] = useState(false);
    const [tempVisibleColumns, setTempVisibleColumns] = useState({});
    
    // Add Row Mode State
    const [addRowMode, setAddRowMode] = useState(false);
    const [newRows, setNewRows] = useState([]);
    
    // Track modified rows
    const [modifiedRows, setModifiedRows] = useState(new Set());
    
    // View Mode Dialog State
    const [viewDialogVisible, setViewDialogVisible] = useState(false);
    const [selectedViewRoute, setSelectedViewRoute] = useState(null);
    
    // Changelog Dialog State
    const [changelogDialogVisible, setChangelogDialogVisible] = useState(false);
    
    // Custom Menu State
    const [customMenuVisible, setCustomMenuVisible] = useState(false);
    
    // Auto Column Width State
    const [columnWidths, setColumnWidths] = useState({
        code: 70,
        location: 190,
        delivery: 90,
        image: 90
    });
    
    // Changelog State
    const [changelog, setChangelog] = useState([]);

    // Calculate optimal column widths based on content
    const calculateColumnWidths = (data) => {
        if (!data || data.length === 0) return;
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = '11px system-ui, -apple-system, sans-serif'; // Match table font
        
        const minWidths = {
            code: 70,      // Minimum width
            location: 140,
            delivery: 90
        };
        
        const maxWidths = {
            code: 140,     // Maximum width to prevent too wide
            location: 390,
            delivery: 140
        };
        
        const padding = 32; // Cell padding (left + right)
        
        const widths = {
            code: minWidths.code,
            location: minWidths.location,
            delivery: minWidths.delivery,
            image: 90 // Fixed for image column
        };
        
        // Find longest content in each column
        data.forEach(row => {
            ['code', 'location', 'delivery'].forEach(field => {
                const text = String(row[field] || '');
                const textWidth = context.measureText(text).width + padding;
                widths[field] = Math.max(widths[field], textWidth);
            });
        });
        
        // Also check header text width
        const headers = {
            code: 'Code',
            location: 'Location',
            delivery: 'Delivery'
        };
        
        Object.keys(headers).forEach(field => {
            const headerWidth = context.measureText(headers[field]).width + padding + 20; // Extra for sort icons
            widths[field] = Math.max(widths[field], headerWidth);
        });
        
        // Apply min/max constraints
        Object.keys(widths).forEach(field => {
            if (minWidths[field]) {
                widths[field] = Math.max(widths[field], minWidths[field]);
            }
            if (maxWidths[field]) {
                widths[field] = Math.min(widths[field], maxWidths[field]);
            }
        });
        
        setColumnWidths(widths);
    };

    // Natural sort function for routes (handles both alphabetic and numeric sorting)
    const sortRoutes = (routesData) => {
        return [...routesData].sort((a, b) => {
            const routeA = String(a.route || '').toLowerCase();
            const routeB = String(b.route || '').toLowerCase();
            
            // Natural sort that handles both letters and numbers correctly
            return routeA.localeCompare(routeB, undefined, { 
                numeric: true, 
                sensitivity: 'base' 
            });
        });
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                // Check if we should clear data (for fresh start)
                const shouldClear = localStorage.getItem('clearDataOnLoad');
                if (shouldClear === 'true') {
                    localStorage.removeItem('routes');
                    localStorage.removeItem('locations');
                    localStorage.removeItem('clearDataOnLoad');
                }
                
                const data = await CustomerService.getRoutes();
                
                // Fetch all locations to count them for each route
                const allLocations = await CustomerService.getDetailData();
                
                // Add location count to each route
                const routesWithLocationCount = data.map(route => {
                    const locationCount = allLocations.filter(loc => loc.routeId === route.id).length;
                    return { ...route, locationCount };
                });
                
                // Sort routes by default (A-Z, 1-10)
                const sortedRoutes = sortRoutes(routesWithLocationCount);
                
                // Smart loading delay for smooth intro
                await new Promise(resolve => setTimeout(resolve, 800));
                
                setRoutes(sortedRoutes);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };
        
        loadData();
    }, []);
    
    // Calculate column widths when dialogData changes
    useEffect(() => {
        if (dialogData && dialogData.length > 0) {
            calculateColumnWidths(dialogData);
        }
    }, [dialogData]);
    
    // Apply dark mode to body class and PrimeReact theme
    useEffect(() => {
        // Apply body class
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        localStorage.setItem('isDark', isDark.toString());
        
        // Switch PrimeReact theme dynamically
        const themeLink = document.getElementById('app-theme');
        const theme = isDark ? 'lara-dark-cyan' : 'lara-light-cyan';
        const themePath = `https://unpkg.com/primereact/resources/themes/${theme}/theme.css`;
        
        if (themeLink) {
            themeLink.href = themePath;
        } else {
            // Create theme link if it doesn't exist
            const newThemeLink = document.createElement('link');
            newThemeLink.id = 'app-theme';
            newThemeLink.rel = 'stylesheet';
            newThemeLink.href = themePath;
            document.head.appendChild(newThemeLink);
        }
    }, [isDark]);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (functionDropdownVisible && !event.target.closest('.function-dropdown-container')) {
                setFunctionDropdownVisible(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [functionDropdownVisible]);

    const dialogFooterTemplate = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button 
                        label="Close" 
                        icon="pi pi-times" 
                        onClick={() => setDialogVisible(false)} 
                        size="small"
                        outlined
                    />
                </div>
            </div>
        );
    };

    const handleUpdateRow = (rowId, field, value) => {
        const route = routes.find(r => r.id === rowId);
        const oldValue = route ? route[field] : '';
        
        const updatedRoutes = routes.map(route => 
            route.id === rowId ? { ...route, [field]: value } : route
        );
        // Sort routes after update to maintain A-Z, 1-10 order
        setRoutes(sortRoutes(updatedRoutes));
        setHasUnsavedChanges(true);
        
        // Add to changelog
        if (oldValue !== value) {
            addChangelogEntry('edit', 'route', {
                route: route?.route || 'Unknown',
                field: field,
                oldValue: oldValue,
                newValue: value
            });
        }
    };

    const handleUpdateDialogData = (rowId, field, value) => {
        const location = dialogData.find(d => d.id === rowId);
        const oldValue = location ? location[field] : '';
        
        const updatedData = dialogData.map(data => 
            data.id === rowId ? { ...data, [field]: value } : data
        );
        setDialogData(sortDialogData(updatedData));
        setHasUnsavedChanges(true);
        
        // Mark row as modified
        setModifiedRows(prev => new Set(prev).add(rowId));
        
        // Add to changelog
        if (oldValue !== value) {
            addChangelogEntry('edit', 'location', {
                code: location?.code || 'Unknown',
                location: location?.location || 'Unknown',
                field: field,
                oldValue: oldValue,
                newValue: value
            });
        }
        
        // Recalculate column widths if content field changed
        if (['code', 'location', 'delivery'].includes(field)) {
            calculateColumnWidths(updatedData);
        }
    };

    const handlePowerModeChange = (rowId, mode) => {
        const updatedData = dialogData.map(data => 
            data.id === rowId ? { ...data, powerMode: mode } : data
        );
        setDialogData(sortDialogData(updatedData));
        setHasUnsavedChanges(true);
        
        // Mark row as modified
        setModifiedRows(prev => new Set(prev).add(rowId));
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
    
    // Add changelog entry
    const addChangelogEntry = (action, type, details) => {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('en-MY', { 
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
            }),
            action, // 'add', 'edit', 'delete'
            type, // 'route', 'location'
            details
        };
        setChangelog(prev => [entry, ...prev].slice(0, 50)); // Keep last 50 entries
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
            console.log('💾 Saving location info:', {
                id: selectedRowInfo.id,
                latitude: infoEditData.latitude,
                longitude: infoEditData.longitude,
                address: infoEditData.address
            });
            
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
                locations: route.locations?.map(loc => {
                    if (loc.id === selectedRowInfo.id) {
                        return {
                            ...loc,
                            latitude: infoEditData.latitude,
                            longitude: infoEditData.longitude,
                            address: infoEditData.address
                        };
                    }
                    return loc;
                }) || []
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
            
            console.log('✅ Location info updated in state, ready to save');
        } catch (error) {
            console.error('❌ Error saving info:', error);
            alert('Error saving location info: ' + error.message);
        }
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        
        try {
            console.log('💾 Starting save operation...');
            console.log('📊 Routes to save:', routes.length, routes);
            console.log('📍 Locations to save:', dialogData.length, dialogData);
            
            // Save both routes and locations
            const results = await Promise.all([
                CustomerService.saveRoutes(routes),
                CustomerService.saveLocations(dialogData)
            ]);
            
            console.log('✅ Save completed successfully:', results);
            
            // Refresh location count after save
            const allLocations = await CustomerService.getDetailData();
            const routesWithLocationCount = routes.map(route => {
                const locationCount = allLocations.filter(loc => loc.routeId === route.id).length;
                return { ...route, locationCount };
            });
            
            // Sort routes to maintain A-Z, 1-10 order
            const sortedRoutes = sortRoutes(routesWithLocationCount);
            
            setRoutes(sortedRoutes);
            setOriginalData([...sortedRoutes]);
            setOriginalDialogData([...dialogData]);
            setHasUnsavedChanges(false);
            setSaving(false);
            
            // Clear modified rows tracking
            setModifiedRows(new Set());
            setNewRows([]);
            
            // Check if using localStorage
            const isLocalStorage = results[0].message?.includes('localStorage');
            
            // Success message with custom sort info
            let message = isCustomSorted 
                ? '✅ Changes saved successfully!\n📊 Custom sort order has been saved.'
                : '✅ Changes saved successfully!';
            
            if (isLocalStorage) {
                message += '\n\n💾 Using localStorage (Development Mode)\nData akan kekal selepas refresh!';
            } else {
                message += `\n\n🗄️ Saved to Database\n✅ Routes: ${results[0].created} created, ${results[0].updated} updated\n✅ Locations: ${results[1].created} created, ${results[1].updated} updated`;
            }
            
            alert(message);
            
        } catch (error) {
            console.error('❌ Error saving changes:', error);
            setSaving(false);
            alert('❌ Error saving changes. Please try again.\n\n' + error.message + '\n\nCheck browser console for details.');
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
        const newValue = value === '' ? '' : parseInt(value);
        const updated = {
            ...sortOrders, 
            [rowId]: newValue
        };
        setSortOrders(updated);
    };
    
    const isOrderDuplicate = (rowId, order) => {
        if (!order) return false;
        return Object.entries(sortOrders).some(([id, ord]) => 
            parseInt(id) !== rowId && ord === order
        );
    };
    
    const applyCustomSort = () => {
        const filledOrders = Object.entries(sortOrders).filter(([_, order]) => order !== '');
        
        if (filledOrders.length === 0) {
            alert('⚠️ Please enter at least one row order number!');
            return;
        }
        
        // Check for duplicates
        const orders = filledOrders.map(([_, order]) => order);
        const uniqueOrders = new Set(orders);
        
        if (uniqueOrders.size !== orders.length) {
            alert('⚠️ Nombor tidak boleh duplikat! Sila gunakan nombor yang berbeza untuk setiap row.');
            return;
        }
        
        // Separate rows: those with order and those without
        const rowsWithOrder = [];
        const rowsWithoutOrder = [];
        
        dialogData.forEach(row => {
            const order = sortOrders[row.id];
            if (order !== '' && order !== undefined) {
                rowsWithOrder.push({ ...row, customOrder: order });
            } else {
                rowsWithoutOrder.push(row);
            }
        });
        
        // Sort rows with custom order by their order number
        rowsWithOrder.sort((a, b) => a.customOrder - b.customOrder);
        
        // Sort rows without order by code (default)
        rowsWithoutOrder.sort((a, b) => {
            const codeA = parseInt(a.code) || 0;
            const codeB = parseInt(b.code) || 0;
            return codeA - codeB;
        });
        
        // Combine: custom ordered rows first, then default sorted rows
        const sortedData = [...rowsWithOrder, ...rowsWithoutOrder];
        
        setDialogData(sortedData);
        setHasUnsavedChanges(true);
        setCustomSortMode(false);
        setSortOrders({});
        setIsCustomSorted(true);
        setActiveFunction(null);
        setFunctionDropdownVisible(false);
        
        const message = filledOrders.length === dialogData.length
            ? '✅ All rows have been sorted according to your order!'
            : `✅ ${filledOrders.length} row(s) sorted by your order, remaining ${rowsWithoutOrder.length} row(s) sorted by code!`;
        
        alert(message);
    };

    const handleAddDialogRow = () => {
        const tempId = Date.now(); // Use numeric timestamp for new rows (must be > 1000000000000)
        const highestNo = dialogData.length > 0 ? Math.max(...dialogData.map(d => typeof d.no === 'number' ? d.no : 0)) : 0;
        const newRow = {
            id: tempId,
            no: highestNo + 1,
            code: '',
            location: '',
            delivery: 'Daily',
            images: [],
            powerMode: 'Daily',
            routeId: currentRouteId,
            isNew: true
        };
        // Add new row at the top
        const updatedData = [newRow, ...dialogData];
        setDialogData(updatedData);
        setNewRows([...newRows, tempId]);
        setHasUnsavedChanges(true);
        
        // Add to changelog
        addChangelogEntry('add', 'location', {
            route: currentRouteName,
            code: 'New Location',
            location: '',
            delivery: 'Daily'
        });
        
        console.log('✅ Added new location with temp ID:', tempId, 'for route:', currentRouteId);
        
        // Recalculate column widths
        calculateColumnWidths(updatedData);
    };

    const handleDeleteDialogRow = (rowId) => {
        const rowToDelete = dialogData.find(data => data.id === rowId);
        setDeleteTarget({ id: rowId, data: rowToDelete });
        setDeleteType('location');
        setDeleteConfirmVisible(true);
    };
    
    const confirmDelete = () => {
        if (deleteType === 'location') {
            const locationToDelete = deleteTarget.data;
            const updatedData = dialogData.filter(data => data.id !== deleteTarget.id);
            setDialogData(sortDialogData(updatedData));
            setHasUnsavedChanges(true);
            
            // Add to changelog
            addChangelogEntry('delete', 'location', {
                route: currentRouteName,
                code: locationToDelete?.code || 'Unknown',
                location: locationToDelete?.location || 'Unknown'
            });
            
            console.log('Deleted dialog row:', deleteTarget.id);
            
            // Recalculate column widths after delete
            calculateColumnWidths(updatedData);
        } else if (deleteType === 'route') {
            const routeToDelete = deleteTarget.data;
            const updatedRoutes = routes.filter(route => route.id !== deleteTarget.id);
            // Sort routes after delete to maintain A-Z, 1-10 order
            setRoutes(sortRoutes(updatedRoutes));
            setHasUnsavedChanges(true);
            
            // Add to changelog
            addChangelogEntry('delete', 'route', {
                route: routeToDelete?.route || 'Unknown',
                shift: routeToDelete?.shift || '',
                warehouse: routeToDelete?.warehouse || ''
            });
            
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
        // Must be > 1000000000000 to be detected as new row by API
        const tempId = Date.now(); // This will be ~13 digits (e.g., 1734953400000)
        const newRow = {
            id: tempId,
            route: '',
            shift: '',
            warehouse: '',
            locationCount: 0
        };
        const updatedRoutes = sortRoutes([...routes, newRow]);
        setRoutes(updatedRoutes);
        setHasUnsavedChanges(true);
        setNewRows([...newRows, tempId]); // Track new rows
        
        // Add to changelog
        addChangelogEntry('add', 'route', {
            route: 'New Route',
            shift: '',
            warehouse: ''
        });
        
        console.log('✅ Added new route with temp ID:', tempId);
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
            return <DuplicateCheckEditor options={options} allData={dialogData} field="code" />;
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
                {editMode ? (
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
                                    const sortedData = sortDialogData(data);
                                    setDialogData(sortedData);
                                    setOriginalDialogData(sortedData);
                                    setDialogVisible(true);
                                    setIsCustomSorted(false);
                                    // Calculate column widths for new data
                                    calculateColumnWidths(sortedData);
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
                ) : (
                    <>
                        <Button 
                            icon="pi pi-info-circle" 
                            size="small"
                            severity="info"
                            tooltip="View Info"
                            tooltipOptions={{ position: 'top' }}
                            text
                            onClick={() => {
                                setSelectedViewRoute(rowData);
                                setViewDialogVisible(true);
                            }} 
                        />
                        <Button 
                            icon="pi pi-list" 
                            size="small"
                            tooltip="Show Locations"
                            tooltipOptions={{ position: 'top' }}
                            text
                            onClick={() => {
                                setCurrentRouteId(rowData.id);
                                setCurrentRouteName(rowData.route);
                                CustomerService.getDetailData(rowData.id).then((data) => {
                                    const sortedData = sortDialogData(data);
                                    setDialogData(sortedData);
                                    setOriginalDialogData(sortedData);
                                    setDialogVisible(true);
                                    setIsCustomSorted(false);
                                    // Calculate column widths for new data
                                    calculateColumnWidths(sortedData);
                                });
                            }} 
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
                    backgroundColor: isDark ? '#fbbf24' : '#fef3c7',
                    color: isDark ? '#000000' : '#92400e',
                    padding: '0.75rem 1rem',
                    margin: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: `2px solid ${isDark ? '#f59e0b' : '#fbbf24'}`,
                    transition: 'all 0.3s ease'
                }}>
                    <i className="pi pi-exclamation-triangle"></i>
                    Unsaved Changes
                </div>
            )
        }] : []),
        ...(isInstallable && !isInstalled ? [{
            label: 'Install App',
            icon: 'pi pi-download',
            command: () => promptInstall(),
            className: 'menu-install-item',
            template: (item) => (
                <div 
                    onClick={item.command}
                    style={{
                        backgroundColor: isDark ? '#10b981' : '#d1fae5',
                        color: isDark ? '#ffffff' : '#065f46',
                        padding: '0.75rem 1rem',
                        margin: '0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: `2px solid ${isDark ? '#059669' : '#10b981'}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <i className="pi pi-download"></i>
                    Install App
                </div>
            )
        }] : []),
        ...(isInstalled ? [{
            template: () => (
                <div style={{
                    backgroundColor: isDark ? '#10b981' : '#d1fae5',
                    color: isDark ? '#ffffff' : '#065f46',
                    padding: '0.75rem 1rem',
                    margin: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: `2px solid ${isDark ? '#059669' : '#10b981'}`,
                    transition: 'all 0.3s ease'
                }}>
                    <i className="pi pi-check-circle"></i>
                    App Installed
                </div>
            )
        }] : []),
        {
            label: isDark ? 'Light Mode' : 'Dark Mode',
            icon: isDark ? 'pi pi-sun' : 'pi pi-moon',
            command: () => setIsDark(!isDark)
        },
        {
            label: 'Changelog',
            icon: 'pi pi-history',
            command: () => setChangelogDialogVisible(true),
            badge: changelog.length > 0 ? changelog.length.toString() : null,
            badgeClass: 'p-badge-info'
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
            background: isDark 
                ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' 
                : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
            color: isDark ? '#e5e5e5' : '#1f2937',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'fadeIn 0.6s ease-out'
        }}>
            <style>{tableStyles}</style>
            {/* Navigation Header */}
            <div style={{
                background: isDark ? '#0f172a' : '#e5e7eb',
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: isDark ? '1px solid #334155' : '1px solid #9ca3af',
                marginBottom: '2rem',
                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.6)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
            }}>
                <h2 style={{ 
                    margin: 0, 
                    color: isDark ? '#f1f5f9' : '#111827',
                    fontSize: '25px',
                    fontWeight: '700'
                }}>{editMode ? 'Edit Mode' : 'Route Management'}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Button 
                        icon="pi pi-bars"
                        label="Menu"
                        onClick={() => setCustomMenuVisible(!customMenuVisible)}
                        severity="info"
                        size="small"
                        raised
                        badge={editMode && hasUnsavedChanges ? "!" : null}
                        badgeSeverity="warning"
                    />
                </div>
                
                {/* Custom Menu Overlay */}
                {customMenuVisible && (
                    <>
                        <div 
                            onClick={() => setCustomMenuVisible(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                zIndex: 999,
                                backdropFilter: 'blur(2px)',
                                animation: 'fadeIn 0.2s ease-out'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '2rem',
                            marginTop: '0.5rem',
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderRadius: '16px',
                            boxShadow: isDark ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.15)',
                            minWidth: '320px',
                            zIndex: 1000,
                            overflow: 'hidden',
                            animation: 'slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`
                        }}>
                            {/* Menu Header */}
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                background: isDark 
                                    ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                                    : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <i className="pi pi-cog" style={{ fontSize: '1.5rem' }}></i>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Settings</h3>
                                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Manage your preferences</p>
                                </div>
                            </div>
                            
                            {/* Unsaved Changes Warning */}
                            {editMode && hasUnsavedChanges && (
                                <div style={{
                                    margin: '1rem',
                                    padding: '1rem',
                                    backgroundColor: isDark ? 'rgba(251, 191, 36, 0.1)' : '#fef3c7',
                                    border: `2px solid ${isDark ? '#f59e0b' : '#fbbf24'}`,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <i className="pi pi-exclamation-triangle" style={{
                                        color: '#f59e0b',
                                        fontSize: '1.25rem'
                                    }}></i>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '700', color: isDark ? '#fbbf24' : '#92400e', fontSize: '0.875rem' }}>Unsaved Changes</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#fcd34d' : '#b45309', marginTop: '0.25rem' }}>Don't forget to save your work</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Menu Items */}
                            <div style={{ padding: '0.75rem' }}>
                                {/* Theme Toggle */}
                                <div
                                    onClick={() => {
                                        setIsDark(!isDark);
                                        setCustomMenuVisible(false);
                                    }}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        backgroundColor: 'transparent',
                                        marginBottom: '0.5rem'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className={isDark ? 'pi pi-sun' : 'pi pi-moon'} style={{
                                            color: isDark ? '#fbbf24' : '#3b82f6',
                                            fontSize: '1.1rem'
                                        }}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: isDark ? '#f1f5f9' : '#1e293b' }}>
                                            {isDark ? 'Light Mode' : 'Dark Mode'}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.15rem' }}>
                                            Switch theme
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Changelog */}
                                <div
                                    onClick={() => {
                                        setChangelogDialogVisible(true);
                                        setCustomMenuVisible(false);
                                    }}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        backgroundColor: 'transparent',
                                        marginBottom: '0.5rem',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="pi pi-history" style={{
                                            color: '#6366f1',
                                            fontSize: '1.1rem'
                                        }}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: isDark ? '#f1f5f9' : '#1e293b' }}>
                                            Changelog
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.15rem' }}>
                                            View activity history
                                        </p>
                                    </div>
                                    {changelog.length > 0 && (
                                        <span style={{
                                            backgroundColor: '#6366f1',
                                            color: '#ffffff',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '12px',
                                            minWidth: '24px',
                                            textAlign: 'center'
                                        }}>
                                            {changelog.length}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Edit/View Mode Toggle */}
                                <div
                                    onClick={() => {
                                        handleToggleEditMode();
                                        setCustomMenuVisible(false);
                                    }}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        borderRadius: '12px',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        backgroundColor: 'transparent',
                                        marginBottom: '0.5rem',
                                        opacity: saving ? 0.5 : 1
                                    }}
                                    onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6')}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: editMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className={editMode ? 'pi pi-eye' : 'pi pi-pencil'} style={{
                                            color: editMode ? '#10b981' : '#ef4444',
                                            fontSize: '1.1rem'
                                        }}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: isDark ? '#f1f5f9' : '#1e293b' }}>
                                            {editMode ? 'View Mode' : 'Edit Mode'}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.15rem' }}>
                                            {editMode ? 'Switch to read-only' : 'Enable editing'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Edit Mode Options */}
                                {editMode && (
                                    <>
                                        <div style={{
                                            height: '1px',
                                            background: isDark ? '#334155' : '#e5e7eb',
                                            margin: '0.75rem 0'
                                        }} />
                                        
                                        {/* Change Password */}
                                        <div
                                            onClick={() => {
                                                setChangePasswordDialogVisible(true);
                                                setCustomMenuVisible(false);
                                            }}
                                            style={{
                                                padding: '1rem 1.25rem',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                backgroundColor: 'transparent',
                                                marginBottom: '0.5rem'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: 'rgba(168, 85, 247, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className="pi pi-lock" style={{
                                                    color: '#a855f7',
                                                    fontSize: '1.1rem'
                                                }}></i>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: isDark ? '#f1f5f9' : '#1e293b' }}>
                                                    Change Password
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.15rem' }}>
                                                    Update security
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Clear All Data */}
                                        <div
                                            onClick={() => {
                                                handleClearAllData();
                                                setCustomMenuVisible(false);
                                            }}
                                            style={{
                                                padding: '1rem 1.25rem',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                backgroundColor: 'transparent',
                                                marginBottom: '0.5rem'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className="pi pi-trash" style={{
                                                    color: '#ef4444',
                                                    fontSize: '1.1rem'
                                                }}></i>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: '#ef4444' }}>
                                                    Clear All Data
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.15rem' }}>
                                                    Delete everything
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                {/* Save/Cancel Actions */}
                                {editMode && hasUnsavedChanges && (
                                    <>
                                        <div style={{
                                            height: '1px',
                                            background: isDark ? '#334155' : '#e5e7eb',
                                            margin: '0.75rem 0'
                                        }} />
                                        
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {/* Save Button */}
                                            <div
                                                onClick={() => {
                                                    handleSaveChanges();
                                                    setCustomMenuVisible(false);
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    cursor: saving ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    background: saving ? (isDark ? '#1e3a2e' : '#d1fae5') : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    color: '#ffffff',
                                                    fontWeight: '700',
                                                    fontSize: '0.95rem',
                                                    opacity: saving ? 0.7 : 1,
                                                    boxShadow: saving ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                                                }}
                                            >
                                                <i className={saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'} />
                                                {saving ? 'Saving...' : 'Save'}
                                            </div>
                                            
                                            {/* Cancel Button */}
                                            <div
                                                onClick={() => {
                                                    handleCancelChanges();
                                                    setCustomMenuVisible(false);
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    cursor: saving ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    background: isDark ? '#1e293b' : '#f1f5f9',
                                                    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
                                                    color: isDark ? '#f1f5f9' : '#1e293b',
                                                    fontWeight: '600',
                                                    fontSize: '0.95rem',
                                                    opacity: saving ? 0.5 : 1
                                                }}
                                            >
                                                <i className="pi pi-times" />
                                                Cancel
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
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
                    scrollHeight={deviceInfo.tableScrollHeight} 
                    tableStyle={{ minWidth: deviceInfo.isMobile ? '100%' : '50rem' }}
                    editMode={editMode ? "cell" : null}
                    className="no-header-border"
                >
                    <Column 
                        field="route" 
                        header="Route" 
                        align="center" 
                        alignHeader="center"
                        headerStyle={{ textAlign: 'center' }}
                        editor={editMode ? textEditor : null}
                        onCellEditComplete={editMode ? onCellEditComplete : null}
                    />
                    <Column 
                        field="shift" 
                        header="Shift" 
                        align="center" 
                        alignHeader="center"
                        headerStyle={{ textAlign: 'center' }}
                        editor={editMode ? textEditor : null}
                        onCellEditComplete={editMode ? onCellEditComplete : null}
                    />
                    <Column 
                        field="warehouse" 
                        header="Warehouse" 
                        align="center" 
                        alignHeader="center"
                        headerStyle={{ textAlign: 'center' }}
                        editor={editMode ? textEditor : null}
                        onCellEditComplete={editMode ? onCellEditComplete : null}
                    />
                    <Column 
                        header="Location" 
                        align="center" 
                        alignHeader="center"
                        body={(rowData) => {
                            const count = rowData.locationCount || 0;
                            const isOverLimit = count > 15;
                            return (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <i className="pi pi-map-marker" style={{ 
                                        color: isOverLimit ? '#ef4444' : '#10b981',
                                        fontSize: '0.875rem'
                                    }}></i>
                                    <span style={{
                                        fontWeight: '600',
                                        color: isOverLimit ? '#ef4444' : '#10b981'
                                    }}>
                                        {count}
                                    </span>
                                </div>
                            );
                        }}
                        headerStyle={{ color: isDark ? '#ffffff' : '#000000', textAlign: 'center', fontWeight: 'bold' }}
                    />
                    <Column 
                        header="Action" 
                        align="center" 
                        alignHeader="center" 
                        body={actionBodyTemplate}
                        headerStyle={{ color: '#ef4444', textAlign: 'center' }}
                    />
                </DataTable>

                <Dialog 
                    header={
                        (() => {
                            const routeUpper = currentRouteName.toUpperCase();
                            let flagSrc = null;
                            if (routeUpper.startsWith('KL')) {
                                flagSrc = '/flag/960px-Flag_of_the_Federal_Territories_of_Malaysia.svg.png';
                            } else if (routeUpper.startsWith('SL')) {
                                flagSrc = '/flag/960px-Flag_of_Selangor.svg.png';
                            }
                            
                            return (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.75rem',
                                    flexWrap: 'wrap'
                                }}>
                                    {flagSrc && (
                                        <img 
                                            src={flagSrc} 
                                            alt="flag" 
                                            style={{ 
                                                width: deviceInfo.isMobile ? '36px' : '48px', 
                                                height: deviceInfo.isMobile ? '24px' : '32px', 
                                                objectFit: 'cover',
                                                borderRadius: '3px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                            }} 
                                        />
                                    )}
                                    <span style={{ fontSize: deviceInfo.isMobile ? '0.9rem' : '1rem' }}>Route {currentRouteName}</span>
                                </div>
                            );
                        })()
                    }
                    visible={dialogVisible} 
                    style={{ width: deviceInfo.dialogWidth }} 
                    maximizable={!deviceInfo.isMobile}
                    modal
                    closeOnEscape
                    dismissableMask 
                    contentStyle={{ height: deviceInfo.isMobile ? '400px' : '500px' }} 
                    onHide={() => setDialogVisible(false)} 
                    footer={dialogFooterTemplate}
                    headerStyle={{ color: isDark ? '#fff' : '#000' }}
                    headerClassName={isDark ? '' : 'light-mode-dialog-header'}
                    transitionOptions={{ timeout: 300 }}
                >
                    {/* Search and Function Button - Side by Side */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem', 
                        marginBottom: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <span className="p-input-icon-left" style={{ 
                                width: '100%',
                                position: 'relative',
                                display: 'inline-block'
                            }}>
                                <i className="pi pi-search" style={{ 
                                    opacity: globalFilterValue ? 0 : 1, 
                                    transition: 'opacity 0.2s ease',
                                    color: isDark ? '#9ca3af' : '#6b7280',
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-1%)',
                                    pointerEvents: 'none',
                                    fontSize: '0.875rem'
                                }} />
                                <InputText
                                    value={globalFilterValue}
                                    onChange={(e) => setGlobalFilterValue(e.target.value)}
                                    placeholder="Search..."
                                    style={{ 
                                        width: '100%',
                                        backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                                        color: isDark ? '#ffffff' : '#000000',
                                        border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                                        paddingLeft: '2.5rem',
                                        paddingTop: '0.625rem',
                                        paddingBottom: '0.625rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                            </span>
                        </div>
                        
                        {/* Function Dropdown */}
                        <div className="function-dropdown-container" style={{ position: 'relative' }}>
                            <Button 
                                label={
                                    activeFunction === 'setOrder' ? 'Set Order' :
                                    activeFunction === 'addRow' ? 'Add New Row' :
                                    'Function'
                                }
                                icon="pi pi-bars"
                                severity={activeFunction ? 'success' : 'info'}
                                size="small"
                                onClick={() => setFunctionDropdownVisible(!functionDropdownVisible)}
                                raised
                            />
                            {functionDropdownVisible && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                                    border: `1px solid ${isDark ? '#404040' : '#d1d5db'}`,
                                    borderRadius: '8px',
                                    padding: '0.5rem',
                                    minWidth: '200px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    zIndex: 1000
                                }}>
                                    {/* Main Menu - Show when no active function */}
                                    {activeFunction !== 'setOrder' && activeFunction !== 'addRow' && (
                                        <>
                                            <Button 
                                                label="Set Order" 
                                                icon="pi pi-sort-numeric-up"
                                                severity="info"
                                                size="small"
                                                text
                                                style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '0.25rem' }}
                                                onClick={() => {
                                                    setActiveFunction('setOrder');
                                                    setCustomSortMode(true);
                                                    const initialOrders = {};
                                                    dialogData.forEach((row) => {
                                                        initialOrders[row.id] = '';
                                                    });
                                                    setSortOrders(initialOrders);
                                                }}
                                            />
                                            {editMode && (
                                                <Button 
                                                    label="Add New Row" 
                                                    icon="pi pi-plus"
                                                    severity="success"
                                                    size="small"
                                                    text
                                                    style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '0.25rem' }}
                                                    onClick={() => {
                                                        setActiveFunction('addRow');
                                                        setAddRowMode(true);
                                                    }}
                                                />
                                            )}
                                            <Button 
                                                label="Columns" 
                                                icon="pi pi-th-large"
                                                severity="secondary"
                                                size="small"
                                                text
                                                style={{ width: '100%', justifyContent: 'flex-start' }}
                                                onClick={() => {
                                                    setTempVisibleColumns({...visibleColumns});
                                                    setColumnModalVisible(true);
                                                    setFunctionDropdownVisible(false);
                                                }}
                                            />
                                        </>
                                    )}
                                    
                                    {/* Set Order Actions */}
                                    {activeFunction === 'setOrder' && (
                                        <>
                                            <div style={{ 
                                                fontWeight: 'bold', 
                                                fontSize: '0.875rem', 
                                                marginBottom: '0.5rem',
                                                color: isDark ? '#e5e5e5' : '#000000'
                                            }}>
                                                Set Order Mode
                                            </div>
                                            <Button 
                                                label="Apply" 
                                                icon="pi pi-check"
                                                severity="success"
                                                size="small"
                                                style={{ 
                                                    width: '100%', 
                                                    marginBottom: '0.25rem',
                                                    backgroundColor: Object.values(sortOrders).some(o => o !== '') ? '#10b981' : '#9ca3af'
                                                }}
                                                onClick={applyCustomSort}
                                                disabled={!Object.values(sortOrders).some(o => o !== '')}
                                            />
                                            <Button 
                                                label="Cancel" 
                                                icon="pi pi-times"
                                                severity="danger"
                                                size="small"
                                                outlined
                                                style={{ width: '100%' }}
                                                onClick={() => {
                                                    setActiveFunction(null);
                                                    setCustomSortMode(false);
                                                    setSortOrders({});
                                                    setFunctionDropdownVisible(false);
                                                }}
                                            />
                                        </>
                                    )}
                                    
                                    {/* Add Row Actions - Only in Edit Mode */}
                                    {activeFunction === 'addRow' && editMode && (
                                        <>
                                            <div style={{ 
                                                fontWeight: 'bold', 
                                                fontSize: '0.875rem', 
                                                marginBottom: '0.5rem',
                                                color: isDark ? '#e5e5e5' : '#000000'
                                            }}>
                                                Add New Row Mode
                                            </div>
                                            <Button 
                                                label="Add Row" 
                                                icon="pi pi-plus"
                                                severity="success"
                                                size="small"
                                                style={{ width: '100%', marginBottom: '0.25rem' }}
                                                onClick={handleAddDialogRow}
                                            />
                                            <Button 
                                                label="Save Changes" 
                                                icon={saving ? "pi pi-spin pi-spinner" : "pi pi-save"}
                                                severity={hasUnsavedChanges ? "success" : "secondary"}
                                                size="small"
                                                style={{ 
                                                    width: '100%', 
                                                    marginBottom: '0.25rem',
                                                    backgroundColor: hasUnsavedChanges ? '#10b981' : undefined,
                                                    borderColor: hasUnsavedChanges ? '#10b981' : undefined
                                                }}
                                                onClick={() => {
                                                    handleSaveChanges();
                                                    setActiveFunction(null);
                                                    setAddRowMode(false);
                                                    setNewRows([]);
                                                    setFunctionDropdownVisible(false);
                                                }}
                                                disabled={!hasUnsavedChanges || saving}
                                            />
                                            <Button 
                                                label="Cancel" 
                                                icon="pi pi-times"
                                                severity="danger"
                                                size="small"
                                                outlined
                                                style={{ width: '100%' }}
                                                onClick={() => {
                                                    const filteredData = dialogData.filter(row => !newRows.includes(row.id));
                                                    setDialogData(filteredData);
                                                    setActiveFunction(null);
                                                    setAddRowMode(false);
                                                    setNewRows([]);
                                                    setFunctionDropdownVisible(false);
                                                    if (newRows.length > 0) {
                                                        setHasUnsavedChanges(false);
                                                    }
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Unsaved Changes Indicator - Above table */}
                    {hasUnsavedChanges && editMode && (
                        <div style={{
                            backgroundColor: isDark ? '#854d0e' : '#fef3c7',
                            border: `2px solid ${isDark ? '#f59e0b' : '#f59e0b'}`,
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: isDark ? '#fbbf24' : '#92400e',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                        }}>
                            <i className="pi pi-exclamation-triangle"></i>
                            <span>You have unsaved changes</span>
                        </div>
                    )}
                    
                    {/* Info message for Set Order */}
                    {customSortMode && (
                        <div style={{
                            backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
                            border: '2px solid #3b82f6',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            color: isDark ? '#93c5fd' : '#1e40af',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <i className="pi pi-info-circle"></i>
                            <span>Enter numbers for rows you want to reorder. Remaining rows will be sorted by code.</span>
                        </div>
                    )}
                        
                    {/* Custom Sort Table - Separate from DataTable */}
                    {customSortMode ? (
                        <div style={{ 
                            border: isDark ? 'none' : '1px solid #ddd', 
                            borderRadius: '8px', 
                            overflow: 'auto',
                            maxHeight: '600px',
                            backgroundColor: isDark ? '#1a1a1a' : '#ffffff'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ 
                                    position: 'sticky', 
                                    top: 0, 
                                    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                                    zIndex: 10
                                }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'center', border: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Order</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', border: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>No</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', border: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Code</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', border: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Location</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', border: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Delivery</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dialogData.map((rowData) => {
                                        const order = sortOrders[rowData.id];
                                        const isDuplicate = isOrderDuplicate(rowData.id, order);
                                        return (
                                            <tr key={rowData.id} style={{ border: 'none' }}>
                                                <td style={{ padding: '1rem', textAlign: 'center', border: 'none' }}>
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
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600', border: 'none' }}>{rowData.no}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600', border: 'none' }}>{rowData.code}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600', border: 'none' }}>{rowData.location}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600', border: 'none' }}>{rowData.delivery}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                    <DataTable 
                        value={dialogData}
                        frozenValue={frozenRow}
                        scrollable 
                        scrollHeight="flex" 
                        tableStyle={{ minWidth: '70rem' }}
                        editMode={editMode ? "cell" : null}
                        globalFilter={globalFilterValue}
                        resizableColumns
                        columnResizeMode="expand"
                        className="no-header-border"
                        rowClassName={(rowData) => {
                            let classes = '';
                            
                            // Frozen row styling
                            if (rowData.id === 'frozen-row') {
                                return 'frozen-row-highlight';
                            }
                            
                            // Highlight new rows with light yellow background
                            if (newRows.includes(rowData.id)) {
                                classes += isDark ? 'new-row-dark' : 'new-row-light';
                            }
                            // Highlight modified rows with light yellow background
                            else if (modifiedRows.has(rowData.id)) {
                                classes += isDark ? 'modified-row-dark' : 'modified-row-light';
                            }
                            
                            // Add disabled class for power off status
                            const status = getPowerStatus(rowData.powerMode || 'Daily');
                            if (status === 'OFF') {
                                classes += (classes ? ' ' : '') + 'row-disabled';
                            }
                            
                            return classes;
                        }}
                    >
                        {customSortMode && (
                            <Column 
                                header="Order" 
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
                                body={(data, options) => {
                                    // Show infinity symbol for frozen row
                                    if (data.id === 'frozen-row') {
                                        return <span style={{ fontSize: '1.1rem', fontWeight: '700', color: isDark ? '#60a5fa' : '#3b82f6' }}>∞</span>;
                                    }
                                    return options.rowIndex + 1;
                                }}
                                style={{ width: '60px' }}
                            />
                        )}
                        {visibleColumns.code && (
                            <Column 
                                field="code" 
                                header="Code" 
                                align="center" 
                                alignHeader="center"
                                editor={(options) => {
                                    // Disable editing for frozen row
                                    if (options.rowData.id === 'frozen-row') return null;
                                    return editMode ? textEditor(options) : null;
                                }}
                                onCellEditComplete={editMode ? onDialogCellEditComplete : null}
                                style={{ width: `${columnWidths.code}px`, minWidth: '70px' }}
                            />
                        )}
                        {visibleColumns.location && (
                            <Column 
                                field="location" 
                                header="Location" 
                                align="center" 
                                alignHeader="center"
                                editor={(options) => {
                                    // Disable editing for frozen row
                                    if (options.rowData.id === 'frozen-row') return null;
                                    return editMode ? textEditor(options) : null;
                                }}
                                onCellEditComplete={editMode ? onDialogCellEditComplete : null}
                                style={{ width: `${columnWidths.location}px`, minWidth: '140px' }}
                            />
                        )}
                        {visibleColumns.delivery && (
                            <Column 
                                field="delivery" 
                                header="Delivery" 
                                align="center" 
                                alignHeader="center"
                                editor={(options) => {
                                    // Disable editing for frozen row
                                    if (options.rowData.id === 'frozen-row') return null;
                                    return editMode ? textEditor(options) : null;
                                }}
                                onCellEditComplete={editMode ? onDialogCellEditComplete : null}
                                style={{ width: `${columnWidths.delivery}px`, minWidth: '90px' }}
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
                                                backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                                                borderRadius: '8px',
                                                border: `2px dashed ${isDark ? '#404040' : '#d1d5db'}`,
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
                                        style={{ backgroundColor: isDark ? '#1a1a1a' : undefined }}
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
                                                backgroundColor: isDark ? '#1a1a1a' : undefined
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
                                                backgroundColor: isDark ? '#1a1a1a' : undefined
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
                                            style={{ backgroundColor: isDark ? '#1a1a1a' : undefined }}
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
                                            style={{ backgroundColor: isDark ? '#1a1a1a' : undefined }}
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
                            fontSize: deviceInfo.isMobile ? '11px' : '12px',
                            padding: '8px 0'
                        }}>
                            {selectedRowInfo && `${selectedRowInfo.code} - ${selectedRowInfo.location}`}
                        </div>
                    }
                    visible={infoDialogVisible} 
                    style={{ width: deviceInfo.isMobile ? '95vw' : '500px' }} 
                    modal
                    dismissableMask
                    closeOnEscape
                    transitionOptions={{ timeout: 300 }}
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

                {/* View Mode Route Info Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="pi pi-info-circle" style={{ fontSize: '1.2rem', color: '#3b82f6' }}></i>
                            <span>Route Information</span>
                        </div>
                    }
                    visible={viewDialogVisible}
                    style={{ width: deviceInfo.isMobile ? '95vw' : '500px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => {
                        setViewDialogVisible(false);
                        setSelectedViewRoute(null);
                    }}
                >
                    {selectedViewRoute && (
                        <div style={{ padding: '1rem' }}>
                            <div style={{ 
                                backgroundColor: isDark ? '#1f2937' : '#f8f9fa',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                border: `1px solid ${isDark ? '#374151' : '#e9ecef'}`
                            }}>
                                <div style={{ 
                                    display: 'grid', 
                                    gap: '1rem',
                                    fontSize: '14px'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingBottom: '0.75rem',
                                        borderBottom: `2px solid ${isDark ? '#374151' : '#dee2e6'}`
                                    }}>
                                        <strong style={{ color: isDark ? '#9ca3af' : '#6c757d', fontSize: '13px' }}>Route:</strong>
                                        <div style={{ 
                                            fontSize: '16px', 
                                            fontWeight: 'bold',
                                            color: isDark ? '#60a5fa' : '#3b82f6'
                                        }}>
                                            {selectedViewRoute.route}
                                        </div>
                                    </div>
                                    
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <strong style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>Shift:</strong>
                                        <div style={{ color: isDark ? '#e5e7eb' : '#212529' }}>
                                            {selectedViewRoute.shift}
                                        </div>
                                    </div>
                                    
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <strong style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>Warehouse:</strong>
                                        <div style={{ color: isDark ? '#e5e7eb' : '#212529' }}>
                                            {selectedViewRoute.warehouse}
                                        </div>
                                    </div>
                                    
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '0.75rem',
                                        borderTop: `1px solid ${isDark ? '#374151' : '#dee2e6'}`
                                    }}>
                                        <strong style={{ color: isDark ? '#9ca3af' : '#6c757d' }}>Total Locations:</strong>
                                        <div style={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <i className="pi pi-map-marker" style={{ 
                                                color: isDark ? '#60a5fa' : '#3b82f6',
                                                fontSize: '1rem'
                                            }}></i>
                                            <span style={{
                                                fontWeight: 'bold',
                                                fontSize: '18px',
                                                color: isDark ? '#60a5fa' : '#3b82f6'
                                            }}>
                                                {selectedViewRoute.locationCount || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ 
                                marginTop: '1rem',
                                textAlign: 'center'
                            }}>
                                <Button 
                                    label="Close"
                                    icon="pi pi-times"
                                    onClick={() => setViewDialogVisible(false)}
                                    severity="secondary"
                                    size="small"
                                    text
                                />
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
                    style={{ width: deviceInfo.isMobile ? '95vw' : '400px' }}
                    modal
                    closable={!passwordLoading}
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => {
                        if (!passwordLoading) {
                            setPasswordDialogVisible(false);
                            setPasswordInput('');
                            setPasswordError('');
                        }
                    }}
                >
                    <div style={{ padding: '1rem' }}>
                        <p style={{ marginBottom: '1rem', color: isDark ? '#9ca3af' : '#6b7280' }}>
                            Please enter your 4-digit password to access Edit Mode
                        </p>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem',
                                fontWeight: 'bold',
                                color: isDark ? '#e5e5e5' : '#000000'
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
                                size="small"
                                disabled={passwordLoading}
                            />
                            <Button
                                label={passwordLoading ? "Verifying..." : "Submit"}
                                icon={passwordLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                                onClick={handlePasswordSubmit}
                                disabled={passwordInput.length !== 4 || passwordLoading}
                                severity="success"
                                size="small"
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
                    style={{ width: deviceInfo.isMobile ? '95vw' : '450px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
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
                                color: isDark ? '#e5e5e5' : '#000000'
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
                                color: isDark ? '#e5e5e5' : '#000000'
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
                                color: isDark ? '#e5e5e5' : '#000000'
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
                                size="small"
                            />
                            <Button
                                label="Change Password"
                                icon="pi pi-check"
                                onClick={handleChangePassword}
                                severity="success"
                                size="small"
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
                            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                            padding: '3rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                            border: `2px solid ${isDark ? '#1a3a52' : '#3b82f6'}`
                        }}>
                            <i className="pi pi-spin pi-spinner" style={{ 
                                fontSize: '3rem', 
                                color: '#3b82f6',
                                marginBottom: '1rem'
                            }}></i>
                            <h3 style={{ 
                                margin: '1rem 0 0.5rem 0',
                                color: isDark ? '#e5e5e5' : '#000000',
                                fontSize: '1.5rem'
                            }}>Saving Changes...</h3>
                            <p style={{ 
                                margin: 0,
                                color: isDark ? '#9ca3af' : '#6b7280',
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
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
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
                            color: isDark ? '#e5e5e5' : '#000000'
                        }}>
                            Are you sure you want to delete this {deleteType === 'location' ? 'location' : 'route'}?
                        </p>
                        {deleteTarget && deleteTarget.data && (
                            <div style={{
                                backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: `2px solid ${isDark ? '#404040' : '#e5e7eb'}`
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
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
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
                                color: isDark ? '#e5e5e5' : '#000000'
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
                                color: isDark ? '#e5e5e5' : '#000000'
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
                                color: isDark ? '#e5e5e5' : '#000000'
                            }}>
                                Current Images ({currentRowImages.length}):
                            </label>
                            {currentRowImages.length === 0 ? (
                                <div style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                                    borderRadius: '8px',
                                    color: isDark ? '#9ca3af' : '#6b7280'
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
                                            border: `2px solid ${isDark ? '#404040' : '#e5e7eb'}`,
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            backgroundColor: isDark ? '#2a2a2a' : '#ffffff'
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
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
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
                            color: isDark ? '#9ca3af' : '#6b7280',
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
                                            border: `2px solid ${isSelected ? '#3b82f6' : (isDark ? '#404040' : '#e5e7eb')}`,
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: isSelected 
                                                ? (isDark ? '#1e3a5f' : '#dbeafe')
                                                : (isDark ? '#2a2a2a' : '#ffffff'),
                                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                            boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.backgroundColor = isDark ? '#353535' : '#f9fafb';
                                                e.currentTarget.style.borderColor = '#3b82f6';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#ffffff';
                                                e.currentTarget.style.borderColor = isDark ? '#404040' : '#e5e7eb';
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                            <i 
                                                className={`pi ${mode.icon}`}
                                                style={{ 
                                                    fontSize: '1.5rem',
                                                    color: isSelected ? '#3b82f6' : (isDark ? '#9ca3af' : '#6b7280')
                                                }}
                                            ></i>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ 
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.25rem',
                                                    color: isDark ? '#e5e5e5' : '#000000'
                                                }}>
                                                    {mode.label}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '0.75rem',
                                                    color: isDark ? '#9ca3af' : '#6b7280'
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
                                                        backgroundColor: isSelected ? '#3b82f6' : (isDark ? '#4b5563' : '#d1d5db'),
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
                
                {/* Column Visibility Modal */}
                <Dialog
                    visible={columnModalVisible}
                    onHide={() => setColumnModalVisible(false)}
                    header="Column Visibility"
                    style={{ width: '400px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                >
                    <div style={{ padding: '1rem 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { key: 'no', label: 'No' },
                                { key: 'code', label: 'Code' },
                                { key: 'location', label: 'Location' },
                                { key: 'delivery', label: 'Delivery' },
                                { key: 'image', label: 'Image' }
                            ].map(col => (
                                <div key={col.key} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    backgroundColor: isDark ? '#1a1a1a' : '#f9fafb',
                                    borderRadius: '8px',
                                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
                                }}>
                                    <span style={{
                                        fontWeight: '600',
                                        color: isDark ? '#e5e5e5' : '#000000'
                                    }}>
                                        {col.label}
                                    </span>
                                    <div
                                        onClick={() => setTempVisibleColumns({
                                            ...tempVisibleColumns,
                                            [col.key]: !tempVisibleColumns[col.key]
                                        })}
                                        style={{
                                            width: '48px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            backgroundColor: tempVisibleColumns[col.key] ? '#10b981' : (isDark ? '#4b5563' : '#d1d5db'),
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
                                                left: tempVisibleColumns[col.key] ? '26px' : '2px',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ 
                            display: 'flex', 
                            gap: '0.5rem', 
                            justifyContent: 'flex-end',
                            marginTop: '1.5rem'
                        }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                severity="secondary"
                                size="small"
                                outlined
                                onClick={() => setColumnModalVisible(false)}
                            />
                            <Button
                                label="Apply"
                                icon="pi pi-check"
                                severity="success"
                                size="small"
                                onClick={() => {
                                    setVisibleColumns(tempVisibleColumns);
                                    setColumnModalVisible(false);
                                }}
                            />
                        </div>
                    </div>
                </Dialog>

                {/* Changelog Dialog */}
                <Dialog
                    header="Changelog"
                    visible={changelogDialogVisible}
                    onHide={() => setChangelogDialogVisible(false)}
                    style={{ width: '70vw' }}
                    maximizable
                    modal
                    footer={
                        changelog.length > 0 && (
                            <div style={{ 
                                textAlign: 'center',
                                padding: '1rem 0 0.5rem 0',
                                borderTop: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                                color: isDark ? '#9ca3af' : '#6b7280',
                                fontSize: '0.875rem'
                            }}>
                                Last Modified: {changelog[0]?.timestamp || 'N/A'}
                            </div>
                        )
                    }
                >
                    {changelog.length === 0 ? (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            color: isDark ? '#9ca3af' : '#6b7280'
                        }}>
                            <i className="pi pi-history" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                            <p style={{ fontSize: '1rem', fontWeight: '500' }}>No changes recorded yet</p>
                            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Changes will appear here when you add, edit, or delete routes and locations</p>
                        </div>
                    ) : (
                        <>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginBottom: '1rem'
                            }}>
                                <Button
                                    label="Clear All"
                                    icon="pi pi-trash"
                                    size="small"
                                    severity="danger"
                                    outlined
                                    onClick={() => {
                                        setChangelog([]);
                                        setChangelogDialogVisible(false);
                                    }}
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                maxHeight: '60vh',
                                overflowY: 'auto',
                                padding: '0.5rem'
                            }}>
                                {changelog.map((entry) => {
                                    const actionColors = {
                                        add: '#10b981',
                                        edit: '#f59e0b',
                                        delete: '#ef4444'
                                    };
                                    const actionIcons = {
                                        add: 'pi-plus-circle',
                                        edit: 'pi-pencil',
                                        delete: 'pi-trash'
                                    };
                                    
                                    return (
                                        <div key={entry.id} style={{
                                            padding: '1rem',
                                            backgroundColor: isDark ? '#1a1a1a' : '#f9fafb',
                                            borderLeft: `4px solid ${actionColors[entry.action]}`,
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'flex-start',
                                            transition: 'all 0.2s ease',
                                            boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
                                        }}>
                                            <i className={`pi ${actionIcons[entry.action]}`} style={{
                                                color: actionColors[entry.action],
                                                fontSize: '1.25rem',
                                                marginTop: '0.1rem'
                                            }}></i>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '0.5rem',
                                                    alignItems: 'center'
                                                }}>
                                                    <span style={{
                                                        fontWeight: '700',
                                                        color: actionColors[entry.action],
                                                        textTransform: 'uppercase',
                                                        fontSize: '0.75rem',
                                                        letterSpacing: '1px',
                                                        padding: '0.25rem 0.75rem',
                                                        backgroundColor: `${actionColors[entry.action]}20`,
                                                        borderRadius: '4px'
                                                    }}>
                                                        {entry.action} {entry.type}
                                                    </span>
                                                    <span style={{
                                                        color: isDark ? '#9ca3af' : '#6b7280',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        {entry.timestamp}
                                                    </span>
                                                </div>
                                                <div style={{
                                                    color: isDark ? '#e5e5e5' : '#374151',
                                                    lineHeight: '1.6',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {entry.action === 'add' && (
                                                        <span>
                                                            {entry.type === 'route' 
                                                                ? `Route: ${entry.details.route || 'New Route'}`
                                                                : `Location: ${entry.details.code || 'New Location'} in Route ${entry.details.route}`
                                                            }
                                                        </span>
                                                    )}
                                                    {entry.action === 'edit' && (
                                                        <span>
                                                            {entry.type === 'route' 
                                                                ? `Route ${entry.details.route}: ${entry.details.field} changed from "${entry.details.oldValue}" to "${entry.details.newValue}"`
                                                                : `Location ${entry.details.code}: ${entry.details.field} changed from "${entry.details.oldValue}" to "${entry.details.newValue}"`
                                                            }
                                                        </span>
                                                    )}
                                                    {entry.action === 'delete' && (
                                                        <span>
                                                            {entry.type === 'route' 
                                                                ? `Route: ${entry.details.route}`
                                                                : `Location: ${entry.details.code} from Route ${entry.details.route}`
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </Dialog>
            </div>
            
            {/* Device Info Footer */}
            <div style={{
                position: 'fixed',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 100,
                backdropFilter: 'blur(8px)',
                fontSize: '0.75rem',
                color: isDark ? '#9ca3af' : '#6b7280',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className={`pi ${deviceInfo.isMobile ? 'pi-mobile' : deviceInfo.isTablet ? 'pi-tablet' : 'pi-desktop'}`} 
                       style={{ fontSize: '1rem', color: isDark ? '#60a5fa' : '#3b82f6' }}></i>
                    <span style={{ color: isDark ? '#e5e7eb' : '#374151', fontWeight: '700' }}>
                        {deviceInfo.deviceType.toUpperCase()}
                    </span>
                </div>
                <div style={{ 
                    width: '1px', 
                    height: '16px', 
                    backgroundColor: isDark ? '#475569' : '#d1d5db' 
                }}></div>
                <span>{deviceInfo.screenWidth} × {deviceInfo.screenHeight}</span>
                <div style={{ 
                    width: '1px', 
                    height: '16px', 
                    backgroundColor: isDark ? '#475569' : '#d1d5db' 
                }}></div>
                <span style={{ 
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}>
                    <i className={`pi ${deviceInfo.orientation === 'portrait' ? 'pi-arrow-up' : 'pi-arrow-right'}`} 
                       style={{ fontSize: '0.75rem' }}></i>
                    {deviceInfo.orientation}
                </span>
                {deviceInfo.touchSupport && (
                    <>
                        <div style={{ 
                            width: '1px', 
                            height: '16px', 
                            backgroundColor: isDark ? '#475569' : '#d1d5db' 
                        }}></div>
                        <i className="pi pi-hand-pointer" style={{ fontSize: '0.875rem', color: '#10b981' }} title="Touch Enabled"></i>
                    </>
                )}
                <div style={{ 
                    width: '1px', 
                    height: '16px', 
                    backgroundColor: isDark ? '#475569' : '#d1d5db' 
                }}></div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <i className="pi pi-globe" style={{ fontSize: '0.75rem' }}></i>
                    {deviceInfo.browserInfo.name}
                </span>
            </div>
        </div>
    );
}
