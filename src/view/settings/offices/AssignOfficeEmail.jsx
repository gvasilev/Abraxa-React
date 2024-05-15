Ext.define('Abraxa.view.settings.offices.AssignOfficeEmail', {
    xtype: 'settings.offices.assign.office',
    extend: 'Ext.Dialog',
    closable: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-email"><i class="material-icons-outlined">alternate_email</i></div>Assign email to {officesGrid.selection.office_name}',
    },
    scrollable: 'y',
    width: 540,
    minHeight: 540,
    maxHeight: 860,
    cls: 'a-dialog-create a-dialog-has-icon',
    padding: '16 0',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'container',
            cls: 'a-grid-list',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'list',
                    flex: 1,
                    infinite: true,
                    height: 400,
                    bind: {
                        store: '{emailsWithoutOffice}',
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                renderEmail: {
                                    bind: {
                                        bindTo: '{record}',
                                        deep: true,
                                    },
                                    get: function (email) {
                                        if (email) {
                                            return email.get('email');
                                        }
                                    },
                                },
                            },
                        },
                        xtype: 'container',
                        height: 54,
                        cls: 'myStyle x-list-sortablehandle grabbable a-bb-100',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        padding: '0 24',
                        items: [
                            {
                                xtype: 'checkbox',
                                ui: 'medium',
                                cls: 'assing_email_in_office',
                                margin: '0 16 0 0',
                            },
                            {
                                xtype: 'div',
                                html: '<div class="a-badge a-badge-email mr-16"><i class="material-icons-outlined">alternate_email</i></div>',
                            },
                            {
                                xtype: 'div',
                                cls: 'fw-b',
                                bind: {
                                    html: '{renderEmail}',
                                },
                            },
                        ],
                    },
                    emptyText: {
                        xtype: 'container',
                        zIndex: 999,
                        layout: {
                            type: 'vbox',
                        },
                        centered: true,
                        items: [
                            {
                                xtype: 'div',
                                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-832 -520)"><g transform="translate(-2 175)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M28.667,1.95a26.667,26.667,0,1,0,0,53.333H42V49.95H28.667A21.606,21.606,0,0,1,7.333,28.617,21.606,21.606,0,0,1,28.667,7.283,21.606,21.606,0,0,1,50,28.617V32.43a4.31,4.31,0,0,1-4,4.187,4.31,4.31,0,0,1-4-4.187V28.617a13.338,13.338,0,1,0-3.893,9.413A9.875,9.875,0,0,0,46,41.95a9.368,9.368,0,0,0,9.333-9.52V28.617A26.676,26.676,0,0,0,28.667,1.95Zm0,34.667a8,8,0,1,1,8-8A7.989,7.989,0,0,1,28.667,36.617Z" transform="translate(865.334 553.25)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/></g></svg><div class="a-no-content-txt">No email accounts available</div></div>',
                            },
                        ],
                    },
                    emptyTextDefaults: {
                        xtype: 'emptytext',
                        cls: 'a-empty-text',
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function () {
                    this.upVM().get('officeEmails').rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                testId: 'assignOfficeEmailButtonTestId',
                ui: 'action loading',
                text: 'Assign',
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        vm = me.upVM(),
                        office = me.upVM().get('officesGrid.selection'),
                        store = vm.get('officeEmails');
                    let items = Ext.ComponentQuery.query('checkbox[cls~=assing_email_in_office][checked="true"]'),
                        selectedItems = [];
                    Ext.each(items, function (item, index) {
                        let isDefault = false;
                        if (store.getCount() === 0 && index === 0) {
                            isDefault = true;
                        }
                        let model = Ext.create('Abraxa.model.office.OfficeEmail', {
                            email_settings_id: item.upVM().get('record').get('id'),
                            office_id: office.get('id'),
                            company_id: office.get('company_id'),
                            is_default: isDefault,
                        });
                        selectedItems.push(model);
                    });
                    if (!selectedItems.length) {
                        this.up('dialog')
                            .down('form\\.error')
                            .setHtml('Please select at least one user')
                            .show()
                            .addCls('error');
                    } else {
                        this.up('dialog').down('form\\.error').hide();
                        store.add(selectedItems);
                        store.sync({
                            success: function (batch, opt) {
                                Ext.toast('Record updated', 1000);
                                store.reload();
                                dialog.destroy();
                            },
                            failure: function (batch, operations) {
                                Ext.Msg.alert('Something went wrong', 'Cannot update team!');
                            },
                        });
                    }
                },
            },
        ],
    },
});
