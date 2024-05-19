import './PortInfoGeneral.jsx';
import './PortInfoCoordinates.jsx';
import './PortInfoAdditional.jsx';
import './PortInfoRestrictions.jsx';
import './PortInfoHealth.jsx';
import './PortInfoPilotage.jsx';
import './PortInfoLDLocations.jsx';
import './PortInfoFacilities.jsx';
import './PortInfoServices.jsx';
import './PortInfoSupplies.jsx';
Ext.define('Abraxa.view.directory.ports.PortInfoTab.PortInfoMain', {
    extend: 'Ext.Container',
    xtype: 'PortInfoMain',
    items: [
        //Port info
        {
            xtype: 'PortInfoGeneral',
            cls: 'a-directory-section a-directory-main-section a-non-hoverable',
        },
        {
            // Coordinates section
            xtype: 'PortInfoCoordinates',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            // Additional port info section
            xtype: 'PortInfoAdditional',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            // Restrictions section
            xtype: 'PortInfoRestrictions',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            // Health information section
            xtype: 'PortInfoHealth',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            // Pilotage and Towage section
            xtype: 'PortInfoPilotage',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            // Loading and Discharging Locations section
            xtype: 'PortInfoLDLocations',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            // Facilities section
            xtype: 'PortInfoFacilities',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            // Services section
            xtype: 'PortInfoServices',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            // Supplies section
            xtype: 'PortInfoSupplies',
            ripple: true,
            cls: 'a-directory-section',
        },
    ],
});
