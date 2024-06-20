Ext.define('Abraxa.view.inquiry.InquiryArchive', {
    xtype: 'inquiry.archive',
    extend: 'Ext.MessageBox',
    modal: true,
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">inventory_2</i></div>Archive',
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
    padding: '0 24 24 72',
    items: [
        {
            xtype: 'div',
            cls: 'fs-16 fw-b my-8',
            html: 'Do you want to archive the below enquiry?',
        },
        {
            xtype: 'div',
            cls: 'a-obj-container-wrap',
            margin: '8 0 8 -16',
            bind: {
                html: '<div class="hbox"><div class="a-obj-logo a-logo a-logo-inquiry mr-12"><i class="md-icon-business-center md-icon-outlined md-18"></i></div><div style="line-height: 1.2;"><div class="fw-b">{record.voyage.vessel_name}</div><div class="fs-12">ABX-{record.parent_id ? record.parent_id : record.id}</div></div></div>',
            },
        },
        {
            xtype: 'div',
            cls: 'my-8',
            html: '<em class="c-grey">All your data will be archived and can later be reviewed in your <b>Archive</b> section.</em>',
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
            xtype: 'div',
            cls: 'my-8',
            html: '<hr>',
        },
        {
            xtype: 'div',
            cls: 'fs-16 fw-b my-8',
            html: 'Archive reason',
        },
        {
            xtype: 'formpanel',
            itemId: 'inquiry-form-archive',
            padding: 0,
            items: [
                {
                    xtype: 'container',
                    padding: '8 0',
                    defaults: {
                        ui: 'large',
                        bodyAlign: 'start',
                        margin: '6 0',
                    },
                    items: [
                        {
                            xtype: 'radiofield',
                            name: 'archived_reason',
                            boxLabel: 'Appointed',
                            value: 4,
                            checked: true,
                            listeners: {
                                initialize: function () {
                                    var record = this.upVM().get('record');
                                    record.set('status', this.getValue());
                                },
                                check: function () {
                                    var record = this.upVM().get('record');
                                    record.set('status', this.getValue());
                                },
                            },
                        },
                        {
                            xtype: 'radiofield',
                            name: 'archived_reason',
                            boxLabel: 'Canceled',
                            value: 5,
                            listeners: {
                                check: function (me, newValue, oldValue) {
                                    var record = this.upVM().get('record');
                                    record.set('status', this.getValue());
                                },
                            },
                        },
                        {
                            xtype: 'radiofield',
                            name: 'archived_reason',
                            boxLabel: 'Lost',
                            value: 6,
                            listeners: {
                                check: function (me, newValue, oldValue) {
                                    var record = this.upVM().get('record');
                                    record.set('status', this.getValue());
                                },
                            },
                        },
                        {
                            xtype: 'radiofield',
                            name: 'archived_reason',
                            boxLabel: 'Other',
                            value: 7,
                            reference: 'inquiryCancelReason',
                            listeners: {
                                check: function (me, newValue, oldValue) {
                                    var record = this.upVM().get('record');
                                    record.set('status', this.getValue());
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'my-8',
                    html: '<hr>',
                },
                {
                    xtype: 'div',
                    cls: 'fs-16 fw-b my-16',
                    html: 'Comment',
                },
                {
                    xtype: 'fieldcontainer',
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
                            label: false,
                            placeholder: 'Enter comment',
                            maxRows: 8,
                            bind: {
                                required: '{inquiryCancelReason.checked}',
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
            testId: 'archiveDialogArchiveButton',
            ui: 'action loading',
            enableToggle: true,
            handler: function (me) {
                let dialog = me.up('dialog'),
                    record = dialog.upVM().get('record'),
                    grid = this.find('inquiry-grid-active'),
                    myTasks = Ext.getCmp('main-viewport').getVM().get('myTasks'),
                    taskStore = Ext.getStore('tasks'),
                    estimateStore = Ext.getStore('inquiriesPdas'),
                    form = dialog.queryById('inquiry-form-archive');
                if (form.validate()) {
                    dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                    record.set('is_archived', 1);
                    record.save({
                        success: function (batch) {
                            Ext.toast('Record updated', 1000);
                            if (grid) {
                                grid.deselectAll();
                                grid.getStore().remove(record);
                                grid.getStore().commitChanges();
                            }
                            if (myTasks) myTasks.reload();
                            if (taskStore) taskStore.reload();
                            if (estimateStore) estimateStore.reload();

                            dialog.destroy();
                            mixpanel.track('Archived a inquiry');
                        },
                    });
                } else {
                    dialog.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
                }
            },
        },
    ],
});
