Ext.define('Abraxa.core.components.combo.Office', {
    extend: 'Ext.field.Select',
    xtype: 'office.combo',
    label: 'Office',
    placeholder: 'Choose office',
    valueField: 'id',
    displayField: 'office_name',
    cls: 'a-field-icon icon-rounded icon-business-center',
    listeners: {
        initialize: function () {
            this.on('painted', function (combo) {
                let officeStore = combo.getStore(),
                    currentUser = Ext.getCmp('main-viewport').upVM().get('currentUser'),
                    currentUserOffice = currentUser.get('office');
                if (currentUserOffice && officeStore) {
                    //preselect office if current user is in office
                    combo.setValue(currentUserOffice.id);
                }
            });
        },
    },
});
