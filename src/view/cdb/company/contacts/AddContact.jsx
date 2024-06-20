Ext.define('Abraxa.view.cdb.company.contacts.AddContact', {
    xtype: 'companydatabase.createcontact',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="a-badge a-badge-person"><i class="md-icon-outlined md-icon-person"></i></div>Create contact',
    // closable: true,
    showAnimation: 'pop',
    scrollable: 'y',
    width: 640,
    // height: '100%',
    minHeight: 380,
    maxHeight: '90%',
    draggable: false,
    padding: 0,
    tools: {
        close: {
            tooltip: {
                anchorToTarget: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function () {
                let record = this.upVM().get('selectedContact');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-dialog-form a-general-form',
            items: [
                {
                    xtype: 'formpanel',
                    itemId: 'mainContactForm',
                    defaults: {
                        labelAlign: 'left',
                        clearable: false,
                        ui: 'classic hovered-border',
                    },

                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    minWidth: 204,
                                    ui: 'field-xl no-border classic',
                                    label: false,
                                    bind: '{selectedContact.contact_first_name}',
                                    required: true,
                                    clearable: false,
                                    placeholder: 'First name',
                                    listeners: {
                                        painted: function (me) {
                                            me.focus();
                                        },
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    ui: 'field-xl no-border classic',
                                    label: false,
                                    bind: '{selectedContact.contact_last_name}',
                                    required: true,
                                    clearable: false,
                                    placeholder: 'Last name',
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.emailfield',
                            cls: 'a-field-icon icon-email icon-rounded',
                            label: 'Email',
                            vtype: 'email',
                            bind: '{selectedContact.contact_email}',
                            placeholder: 'Enter email address',
                            required: true,
                        },
                        {
                            xtype: 'abraxa.phonefield',
                            cls: 'a-field-icon icon-phone icon-rounded',
                            label: 'Phone',
                            bind: '{selectedContact.contact_phone}',
                        },
                        {
                            xtype: 'abraxa.phonefield',
                            cls: 'a-field-icon icon-phone icon-rounded',
                            label: 'Mobile',
                            bind: '{selectedContact.contact_mobile}',
                        },
                        {
                            xtype: 'textfield',
                            cls: 'a-field-icon icon-public icon-rounded',
                            label: 'Skype',
                            placeholder: 'Skype name',
                            bind: '{selectedContact.contact_skype}',
                        },
                        {
                            xtype: 'textfield',
                            cls: 'a-field-icon icon-short icon-rounded',
                            label: 'Position',
                            bind: '{selectedContact.contact_position}',
                            placeholder: 'Choose position',
                        },
                        {
                            xtype: 'combobox',
                            cls: 'a-field-icon icon-corporate-fare icon-rounded',
                            label: 'Department',
                            queryMode: 'local',
                            valueField: 'dept_id',
                            displayField: 'dept_name',
                            placeholder: 'Choose department',
                            itemId: 'dept-combo',
                            editable: false,
                            clearable: true,
                            slug: 'cdbCompanyDepartments',
                            bind: {
                                value: '{selectedContact.contact_org_department}',
                                store: '{departments}',
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'divider divider-offset',
            html: '',
        },
        {
            xtype: 'container',
            margin: '8 24 8 64',
            minHeight: 128,
            items: [
                {
                    xtype: 'textareafield',
                    ui: 'classic no-border',
                    cls: 'a-field-icon icon-short',
                    label: false,
                    labelAlign: 'top',
                    bind: '{selectedContact.contact_description}',
                    placeholder: 'Short description',
                },
            ],
        },
    ],

    buttons: [
        {
            xtype: 'container',
            itemId: 'errorLine',
            testId: 'addContactsDialogErrorLineContainer',
            hidden: true,
            left: 16,
            html: '<div class="col"><div class="alert-warning alert-danger"><i class="material-icons md-18 md-icon-info red"></i>Please fill in all required fields.</div></div>',
            showAnimation: {
                type: 'popIn',
                direction: 'right',
            },
        },
        {
            text: 'Cancel',
            testId: 'addContactsDialogCancelButton',
            margin: '0 8 0 0',
            ui: 'default',
            handler: function () {
                let combo = this.upVM().get('combo'),
                    record = this.upVM().get('selectedContact');
                if (combo) {
                    combo.clearValue();
                    if (combo.getStore().source) {
                        combo.getStore().getSource().rejectChanges();
                    } else {
                        combo.getStore().rejectChanges();
                    }
                    combo.focus();
                }
                record.reject();
                this.up('dialog').destroy();
            },
        },
        {
            bind: {
                text: '{is_created ? "Create":"Save"}',
            },
            testId: 'addContactsDialogSaveContactButton',
            enableToggle: true,
            ui: 'action loading',
            handler: function (me) {
                let view = this.up('dialog');
                let form = view.queryById('mainContactForm');
                if (form.validate()) {
                    let isGlobal = view.upVM().get('isGlobal'),
                        createFromTabs = view.upVM().get('createFromTabs'),
                        currentUser = Ext.getCmp('main-viewport').getViewModel().get('currentUser'),
                        combo = view.upVM().get('combo'),
                        store = null,
                        is_created = view.upVM().get('is_created');
                    if (is_created) {
                        if (isGlobal) {
                            if (combo.getStore().source) {
                                store = combo.getStore().getSource();
                            } else {
                                store = combo.getStore();
                            }
                        } else {
                            if (createFromTabs) {
                                store = view.upVM().get('contacts');
                            } else {
                                store = view.goUp().find('cdbMainView').upVM().get('organizationContacts');
                            }
                        }
                        let record = view.upVM().get('selectedContact');
                        if (record.isValid()) {
                            store.add(record);
                            store.sync({
                                success: function (batch) {
                                    var response = batch.operations[0]._response.responseJson;
                                    if (combo) {
                                        combo.setValue(response[0].contact_id);
                                        combo.setInputValue(response[0].contact_full_name);
                                    }
                                    if (!createFromTabs && !combo) {
                                        view.goUp().find('cdbMainView').upVM().get('organizations').reload();
                                    } else {
                                        view.upVM().get('organizationContacts').reload();
                                    }
                                    let organization = view.upVM().get('object_record');
                                    if (organization) {
                                        organization.set('updated_by_user', currentUser.getData());
                                        organization.set('updated_at', new Date());
                                    }
                                    Ext.toast('Record created', 1000);
                                    view.destroy();
                                    mixpanel.track('Contact created');
                                },
                            });
                        } else {
                            Ext.Msg.alert('Something went wrong', 'Unable to create record!');
                        }
                    } else {
                        let record = view.upVM().get('selectedContact');
                        if (record.dirty) {
                            record.save({
                                success: function (rec) {
                                    let organization = view.upVM().get('object_record');
                                    if (organization) {
                                        organization.set('updated_by_user', currentUser.getData());
                                        organization.set('updated_at', new Date());
                                    }
                                    Ext.toast('Record updated', 1000);
                                    view.destroy();
                                },
                            });
                        }
                    }
                } else {
                    var buttons = view.queryById('errorLine');
                    me.toggle();
                    buttons.show();
                }
            },
        },
    ],
});
