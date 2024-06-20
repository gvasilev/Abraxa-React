import '../../store/common/Organizations';
import '../../store/cdb/Departments';
import '../../store/common/City';
import '../../store/company/CreditRatings';
import '../../store/common/OrganizationsRemote';

Ext.define('Abraxa.view.cdb.CdbMainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cdb-main-viewmodel',
    data: {
        object_id: 2,
        edit_mode: false,
        nonEditable: false,
    },
    stores: {
        organizationsCdbGrid: {
            type: 'organizations',
            autoLoad: true,
            remoteSort: true,
        },
        departments: {
            type: 'company-departments',
        },
        cityStore: {
            type: 'cityStore',
        },
        creditRatings: {
            type: 'credit_ratings',
            autoLoad: true,
        },
        parentCompanyStore: {
            type: 'organizations.remote',
            autoLoad: true,
        },
    },

    formulas: {
        selectedContact: {
            bind: {
                bindTo: '{cdbContactsGrid.selection}',
                deep: true,
            },
            get: function (record) {
                if (record) return record;
            },
        },
        dragListeners: {
            bind: {
                bindTo: '{userPermissions}',
                deeP: true,
            },
            get: function (store) {
                if (store && Object.keys(store).length > 0) {
                    let record = store['cdbFiles'];
                    if (record && record.edit) {
                        return {
                            element: 'element',
                            drop: 'onDrop',
                            dragleave: 'onDragLeaveListItem',
                            dragover: 'onDragOverListItem',
                        };
                    } else {
                        return {};
                    }
                } else {
                    return {};
                }
            },
        },
        totalCdbRecords: {
            bind: {
                bindTo: '{organizations}',
                deep: true,
            },
            get: function (store) {
                return store.getTotalCount();
            },
        },
    },
});
