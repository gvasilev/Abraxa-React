Ext.define('Abraxa.view.cdb.company.contacts.CreateDepartment', {
    extend: 'Ext.Dialog',
    xtype: 'contacts.department.create',
    cls: 'a-dialog-create a-dialog-has-icon',
    testId: 'contactsDeparmetCreate',
    manageBorders: false,
    scrollable: 'y',
    width: 620,
    minHeight: 580,
    maxHeight: '90%',
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">corporate_fare</i></div>Add department',
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    testId: 'contactsDeparmetForm',
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'form.error',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            docked: 'top',
                        },
                        {
                            xtype: 'container',
                            scrollable: 'y',
                            flex: 1,
                            cls: 'general_data_container',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-dialog-form a-general-form',
                                    maxWidth: 520,
                                    defaults: {
                                        labelAlign: 'left',
                                        clearable: false,
                                        ui: 'classic hovered-border',
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            ui: 'field-xl no-border classic',
                                            label: false,
                                            clearable: false,
                                            placeholder: 'Enter department name',
                                            testId: 'contactsDeparmetDepartmentNameField',
                                            bind: {
                                                value: '{department.dept_name}',
                                            },
                                            required: true,
                                            listeners: {
                                                painted: function (me) {
                                                    me.focus();
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.emailfield',
                                            cls: 'a-field-icon icon-email icon-rounded',
                                            label: 'Email',
                                            vtype: 'email',
                                            testId: 'contactsDeparmetEmailField',
                                            placeholder: 'Enter email address',
                                            required: true,
                                            bind: {
                                                value: '{department.dept_email}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.phonefield',
                                            cls: 'a-field-icon icon-phone icon-rounded',
                                            label: 'Phone',
                                            testId: 'contactsDeparmetPhoneField',
                                            bind: {
                                                value: '{department.dept_phone}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Address',
                                            testId: 'contactsDeparmetAddressField',
                                            placeholder: 'Enter address',
                                            cls: 'a-field-icon icon-location icon-rounded',
                                            bind: {
                                                value: '{department.address}',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'divider divider-offset',
                                            html: '',
                                        },

                                        {
                                            xtype: 'textareafield',
                                            ui: 'no-border no-underline',
                                            testId: 'contactsDeparmetDescriptionField',
                                            cls: 'a-field-icon icon-short',
                                            placeholder: 'Enter description (optional)',
                                            bind: {
                                                value: '{department.description}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            testId: 'contactsDeparmetCancelBtn',
            margin: '0 8 0 0',
            handler: function () {
                let record = this.upVM().get('department');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
        {
            text: 'Create',
            testId: 'contactsDeparmetCreateBtn',
            enableToggle: true,
            ui: 'action loading',
            handler: function (me) {
                let vm = me.upVM(),
                    dialog = me.up('dialog'),
                    company = vm.get('selectedCompany'),
                    departments = vm.get('departments'),
                    department = vm.get('department');
                form = dialog.down('formpanel');
                if (form.validate()) {
                    form.down('form\\.error').setHtml('').hide().removeCls('error');
                    department.getProxy().setExtraParams({
                        org_id: company.get('org_id'),
                    });
                    department.save({
                        success: function (rec) {
                            departments.add(rec);
                            departments.commitChanges();
                            Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                            dialog.destroy();
                        },
                    });
                } else {
                    me.toggle();
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});
