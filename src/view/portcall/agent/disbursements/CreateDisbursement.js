Ext.define('Abraxa.view.portcall.disbursements.CreateDisbursement', {
    extend: 'Ext.Dialog',
    xtype: 'disbursements.create',
    testId: 'disbursementsCreate',
    title: '<div class="a-badge a-badge-financial"><i class="md-icon-outlined">attach_money</i></div>Add disbursement',
    cls: 'chameleon_disbursements_add_popup a-dialog-create a-dialog-has-icon',
    minWidth: 540,
    padding: '0 24 24 72',
    closable: true,
    draggable: false,
    items: [
        {
            xtype: 'formpanel',
            testId: 'disbursementsCreateForm',
            padding: 0,
            ui: 'no-border-radius',
            customComponentHolderId: 'createDisbursementForm',
            bind: {
                customComponents: '{currentCompany.custom_components}',
            },
            items: [
                {
                    xtype: 'form.error',
                    testId: 'disbursementsCreateFormError',
                    docked: 'top',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    showAnimation: 'fadeIn',
                },
                {
                    xtype: 'textfield',
                    testId: 'disbursementsCreateDisbursementNameField',
                    label: false,
                    clearable: false,
                    placeholder: 'Disbursement name',
                    ui: 'field-xl no-border classic',
                    required: true,
                    name: 'name',
                    bind: {
                        value: '{record.name}',
                    },
                    listeners: {
                        painted: function () {
                            this.focus();
                        },
                    },
                },
                {
                    xtype: 'selectfield',
                    testId: 'disbursementsCreateTypeField',
                    label: 'Type',
                    labelAlign: 'left',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    required: true,
                    name: 'type',
                    placeholder: 'Choose type',
                    valueField: 'value',
                    displayField: 'name',
                    bind: {
                        value: '{record.type}',
                    },
                    options: [
                        {
                            name: 'Proforma DA',
                            suggested_name: 'Proforma Disbursement Account',
                            value: 'pda',
                        },
                        {
                            name: 'Departure DA',
                            suggested_name: 'Departure Disbursement Account',
                            value: 'dda',
                        },
                        {
                            name: 'Final DA',
                            suggested_name: 'Final Disbursement Account',
                            value: 'fda',
                        },
                        {
                            name: 'Supplementary DA',
                            suggested_name: 'Supplementary Disbursement Account',
                            value: 'sda',
                        },
                    ],
                },
                {
                    xtype: 'textfield',
                    label: 'Disbursement ID',
                    testId: 'disbursementsCreateDisbursementIdField',
                    clearable: false,
                    placeholder: 'Disbursement ID',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    required: true,
                    name: 'group_id',
                    labelAlign: 'left',
                    bind: {
                        disabled: '{customSequence.disbursement ? true : false}',
                        required: '{customSequence.disbursement? false : true}',
                        placeholder:
                            '{customSequence.disbursement ? customSequence.disbursement_placeholder : "Disbursement ID"}',
                        value: '{record.group_id}',
                    },
                    listeners: {
                        painted: function () {
                            this.setError(false);
                        },
                    },
                },
                {
                    xtype: 'template.combo',
                    testId: 'disbursementsCreateTemplateField',
                    placeholder: 'Choose template',
                    labelAlign: 'left',
                    label: 'Template',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    reference: 'selectedTemplate',
                    slug: 'portcallTemplates',
                    templateType: 'disbursement',
                    name: 'template_id',
                    bind: {
                        label: '{(currentUserPlan == "starter") ? "<span class=\\"hbox\\">Template<i class=\\"far fa-gem c-premium ml-8\\" data-qtip=\\"Premium feature\\" data-qalign=\\"bc-tc\\" data-qanchor=\\"true\\"></i></span>":"Template"}',
                        store: '{taskTemplates}',
                        value: '{record.template_id}',
                        permission: '{userPermissions}',
                    },
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            testId: 'disbursementsCreateCancelBtn',
            margin: '0 8 0 0',
            handler: function (btn) {
                btn.upVM().get('record').reject();
                this.up('dialog').destroy();
            },
        },
        {
            enableToggle: true,
            testId: 'disbursementsCreateSaveBtn',
            bind: {
                text: '{editMode ? "Save":"Add"}',
                ui: 'action loading',
                cls: 'chameleon_portcall_disbursement_add_popup_confirm_button',
            },
            handler: function (btn) {
                let form = this.up('dialog').down('formpanel'),
                    dialog = this.up('dialog');

                if (form.validate()) {
                    let store = btn.lookupViewModel().get('object_record').disbursements(),
                        record = btn.upVM().get('record'),
                        expenses = btn.upVM().get('expenses'),
                        object_record = btn.upVM().get('object_record'),
                        record_exists = store.queryBy(function (disbursement) {
                            return disbursement.get('group_id') == record.get('group_id');
                        }).items.length;

                    if (record_exists) {
                        btn.toggle();
                        form.down('form\\.error').setHtml('Disbursement ID already exists.').show().addCls('error');
                        // Ext.Msg.warning('Warning', 'You have already have a billing party with this company');
                        // Ext.Msg.alert('Oops', 'Organization with this email already exists!');
                    } else {
                        record.save({
                            success: function () {
                                store.add(record);
                                object_record.set('updated_at', new Date());
                                record.reject();
                                expenses.reload();
                                Ext.toast('Record created');
                                btn.upVM().get('selectedAccount').load();
                                mixpanel.track('Create Disbursement');
                                dialog.destroy();
                            },
                            failure: function (record, response) {
                                var msg =
                                    response &&
                                    response.error &&
                                    response.error.response &&
                                    response.error.response.responseJson &&
                                    response.error.response.responseJson.message;

                                btn.toggle();
                                form.down('form\\.error').setHtml(msg).show().addCls('error');
                            },
                        });
                    }
                } else {
                    btn.toggle();
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});
