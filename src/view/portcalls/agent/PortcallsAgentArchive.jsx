Ext.define('Abraxa.view.portcalls.agent.PortcallsAgentArchive', {
    xtype: 'portcalls.agent.archive',
    extend: 'Ext.MessageBox',
    modal: true,
    title: 'Archive',
    width: 540,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    closable: true,
    draggable: false,
    defaults: {
        labelWidth: 100,
        labelSeparator: '',
    },
    padding: '16 24',
    items: [
        // {
        //     xtype: 'div',
        //     cls: 'fw-b fs-16 mb-16',
        //     html: 'Do you want to archive this Port call?'
        // },
        {
            xtype: 'div',
            cls: 'a-info-box a-warning-box',
            margin: '0 0 24 0',
            hidden: true,
            bind: {
                hidden: '{(record.members.count -1) || record.is_live ? false : true}',
                html: '<i class="material-icons-outlined">report_problem</i><div class="a-info-text">This is an actively shared port call.<br>{record.is_live ? "You" : "Members"} will no longer receive updates after archiving.</div>',
            },
        },
        {
            xtype: 'div',
            bind: {
                html: '<div class="hbox"><div class="a-obj-logo a-logo a-logo-appointment mr-12"><i class="md-icon-business-center md-icon-outlined md-18"></i></div><div style="line-height: 1.2;"><div class="fw-b">{record.voyage.vessel_name}</div><div class="fs-12">{record.file_id}</div></div></div>',
            },
        },
        {
            xtype: 'div',
            cls: 'my-16',
            html: '<em class="c-grey">All your data will be archived and can later be reviewed in your <b>Closed</b> section.</em>',
        },
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            // showAnimation: 'fadeIn',
            docked: 'top',
        },
        {
            itemId: 'portcall-principal-form-archive',
            xtype: 'formpanel',
            padding: 0,
            items: [
                {
                    xtype: 'container',
                    padding: '16 0 8 0',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'radiofield',
                            ui: 'large',
                            name: 'archived_reason',
                            label: 'Completed port call',
                            value: 'Completed port call',
                            labelAlign: 'right',
                            labelWidth: 220,
                            checked: true,
                            listeners: {
                                initialize: function () {
                                    var record = this.upVM().get('record');
                                    record.set('archived_reason', this.getValue());
                                    record.set('status_temp_string', 'Completed');
                                },
                            },
                        },
                        {
                            xtype: 'radiofield',
                            ui: 'large',
                            name: 'archived_reason',
                            label: 'Canceled appointment',
                            value: 'Canceled appointment',
                            labelAlign: 'right',
                            labelWidth: 220,
                            listeners: {
                                change: function (me, newValue, oldValue) {
                                    var record = this.upVM().get('record');
                                    record.set('archived_reason', this.getValue());
                                    record.set('status_temp_string', 'Canceled');
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '8 0',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'radiofield',
                            ui: 'large',
                            name: 'archived_reason',
                            label: 'Change of agency',
                            value: 'Change of agency',
                            labelAlign: 'right',
                            labelWidth: 220,
                            listeners: {
                                change: function (me, newValue, oldValue) {
                                    var record = this.upVM().get('record');
                                    record.set('archived_reason', this.getValue());
                                    record.set('status_temp_string', 'Lost');
                                },
                            },
                        },
                        {
                            xtype: 'radiofield',
                            ui: 'large',
                            name: 'archived_reason',
                            label: 'Other',
                            value: 'Other',
                            labelAlign: 'right',
                            labelWidth: 220,
                            reference: 'otherCancelReason',
                            listeners: {
                                change: function (me, newValue, oldValue) {
                                    var record = this.upVM().get('record');
                                    record.set('archived_reason', this.getValue());
                                    record.set('status_temp_string', 'Other');
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'fieldcontainer',
                    padding: '16 0 0 0',
                    defaults: {
                        layout: 'hbox',
                        ui: 'classic',
                        labelAlign: 'top',
                    },
                    items: [
                        {
                            xtype: 'textareafield',
                            ui: 'no-border classic',
                            cls: 'a-field-icon icon-short',
                            label: 'Comment',
                            placeholder: 'Enter comment',
                            maxRows: 8,
                            bind: {
                                required: '{otherCancelReason.checked}',
                                value: '{record.archived_comment}',
                            },
                            required: true,
                            width: '100%',
                            listeners: {
                                change: function (me, newValue, oldValue) {
                                    var record = this.upVM().get('record');
                                    record.set('archived_comment', this.getValue());
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        ui: 'toolbar-panel-bottom',
        border: true,
    },
    buttons: [
        {
            text: 'Cancel',
            testId: 'portcallsAgentArchiveDialogCancelButton',
            handler: function (me) {
                let dialog = me.up('dialog'),
                    record = dialog.upVM().get('record');
                record.reject();
                dialog.destroy();
            },
            margin: '0 8 0 0',
            ui: 'default',
        },
        {
            text: 'Archive',
            testId: 'portcallsAgentArchiveDialogArchiveButton',
            ui: 'action loading',
            enableToggle: true,
            handler: function (me) {
                let dialog = me.up('dialog'),
                    record = dialog.upVM().get('record'),
                    grid = this.find('portcalls-grid-active'),
                    store = grid ? grid.getStore() : null,
                    portcallsArchived = dialog.upVM().get('portcallsArchived'),
                    myTasks = Ext.getCmp('main-viewport').getVM().get('myTasks'),
                    taskStore = Ext.getStore('tasks'),
                    accountStore = Ext.getStore('accounts'),
                    disbursementStore = Ext.getStore('disbursements'),
                    paymentStore = Ext.getStore('payments'),
                    portcallStatuses = dialog.upVM().get('portcallAgentStatus'),
                    form = dialog.queryById('portcall-principal-form-archive');
                if (form.validate()) {
                    dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                    record.set('is_archived', 1);
                    let statusRecord = portcallStatuses.queryBy(function (rec, id) {
                        return rec.get('name') == record.get('status_temp_string');
                    }).items[0];
                    if (statusRecord) {
                        record.set('last_status', record.get('status_id'));
                        record.set('status_id', statusRecord.get('id'));
                    }
                    record.save({
                        success: function (batch) {
                            Ext.toast('Record updated', 1000);
                            if (grid) {
                                grid.deselectAll();
                            }
                            if (portcallsArchived) {
                                portcallsArchived.reload();
                            }
                            if (myTasks) myTasks.reload();
                            if (taskStore) taskStore.reload();
                            if (accountStore) accountStore.reload();
                            if (disbursementStore) disbursementStore.reload();
                            if (paymentStore) paymentStore.reload();

                            if (store) {
                                store.remove(record);
                                store.commitChanges(true);
                            }
                            // container.hide();
                            dialog.destroy();
                            mixpanel.track('Archived a portcall');
                        },
                        failure: function (batch) {
                            Ext.Msg.alert('Something went wrong', 'Unable to archive record!');
                        },
                    });
                } else {
                    dialog.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
                }
            },
        },
    ],
});