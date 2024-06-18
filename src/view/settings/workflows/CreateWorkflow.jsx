import '../../../store/disbursements/DefaultDisbursementTags';
import '../../common/combo/GeneralVesselType';

Ext.define('Abraxa.view.settings.workflows.CreateWorkflow', {
    extend: 'Ext.Dialog',
    xtype: 'settings.workflow.create',
    cls: 'a-dialog-fullscreen a-dialog-card-layout a-dialog-create a-dialog-workflow',
    scrollable: 'y',
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let dialog = Ext.ComponentQuery.query('[xtype=settings\\.workflow\\.create]')[0];
            Ext.Msg.confirm(
                'Confirmation',
                'Would you like to discard all changes?',
                function (answer) {
                    if (answer == 'yes') {
                        dialog.upVM().get('workflow').reject();
                        dialog.destroy();
                    }
                },
                this,
                [
                    {
                        xtype: 'button',
                        itemId: 'no',
                        margin: '0 8 0 0',
                        text: 'Cancel',
                    },
                    {
                        xtype: 'button',
                        itemId: 'yes',
                        enableToggle: true,
                        ui: 'action loading',
                        text: 'Discard',
                    },
                ]
            );
        },
    },
    tools: {
        close: {
            tooltip: {
                showOnTap: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
            },
            handler: function () {
                let dialog = this.up('dialog');
                Ext.Msg.confirm(
                    'Confirmation',
                    'Would you like to discard all changes?',
                    function (answer) {
                        if (answer == 'yes') {
                            dialog.upVM().get('workflow').reject();
                            dialog.destroy();
                        }
                    },
                    this,
                    [
                        {
                            xtype: 'button',
                            itemId: 'no',
                            margin: '0 8 0 0',
                            text: 'Cancel',
                        },
                        {
                            xtype: 'button',
                            itemId: 'yes',
                            enableToggle: true,
                            ui: 'action loading',
                            text: 'Discard',
                        },
                    ]
                );
            },
        },
    },
    draggable: false,
    width: '100%',
    height: '100%',
    title: false,
    items: [
        {
            xtype: 'div',
            cls: 'a-dialog-card-title',
            html: 'Let’s create an approval workflow',
        },
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            flex: 1,
            scrollable: 'y',
            items: [
                {
                    xtype: 'container',
                    padding: 32,
                    cls: 'a-dialog-card',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-info-box a-danger-box errors_div',
                            hidden: true,
                            margin: '0 0 16 0',
                            layout: {
                                type: 'hbox',
                                align: 'start',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<i class="md-icon">emergency_home</i>',
                                },
                                {
                                    xtype: 'div',
                                    html: '',
                                },
                            ],
                        },

                        {
                            xtype: 'div',
                            cls: 'h5',
                            html: 'Workflow name',
                        },
                        {
                            xtype: 'textfield',
                            label: false,
                            labelAlign: 'top',
                            placeholder: 'Enter workflow name',
                            name: 'Workflow name',
                            required: true,
                            clearable: false,
                            bind: {
                                value: '{workflow.name}',
                            },
                            ui: 'field-xl hovered-border classic',
                            cls: 'a-field-name',
                            listeners: {
                                painted: function (me) {
                                    setTimeout(() => {
                                        me.focus();
                                    }, 300);
                                },
                            },
                        },
                        {
                            xtype: 'selectfield',
                            margin: '16 0',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-bookmark icon-rounded',
                            placeholder: 'Choose type',
                            label: 'Object type',
                            labelAlign: 'top',
                            flex: 1,
                            valueField: 'type',
                            required: true,
                            displayField: 'name',
                            queryMode: 'local',
                            store: {
                                data: [
                                    {
                                        type: 'invitation',
                                        name: 'Invitation',
                                    },
                                    {
                                        type: 'disbursement',
                                        name: 'Disbursement',
                                    },
                                ],
                            },
                            bind: {
                                value: '{workflow.type}',
                            },
                            listeners: {
                                select: function (me, selection) {
                                    let workflow = me.upVM().get('workflow');
                                    if (selection && selection.get('type') === 'invitation') {
                                        workflow.set('approve_automatically', true);
                                    } else {
                                        workflow.set('approve_automatically', false);
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'a-sep-card',
                    bind: {
                        hidden: '{workflow.type ? false:true}',
                    },
                    html: '<span class="a-sep-text">When this happens</span><i class="a-sep-icon md-icon">south</i>',
                },
                {
                    xtype: 'InvitationApprovalConditions',
                    bind: {
                        hidden: '{workflow.type === "invitation" ? false:true}',
                    },
                },
                {
                    xtype: 'DisbursementApprovalConditions',
                    bind: {
                        hidden: '{workflow.type === "disbursement" ? false:true}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-sep-card a-sep-card-action',
                    bind: {
                        hidden: '{workflow.type ? false:true}',
                    },
                    html: '<span class="a-sep-text">Do this action</span><i class="a-sep-icon md-icon">south</i>',
                },
                {
                    xtype: 'InvitationApprovalsContent',
                    bind: {
                        hidden: '{workflow.type === "invitation" ? false:true}',
                    },
                },
                {
                    xtype: 'DisbursementApprovalsContent',
                    bind: {
                        hidden: '{workflow.type === "disbursement" ? false:true}',
                    },
                },
            ],
        },
    ],
    bbar: {
        cls: 'a-dialog-card-footer',
        items: [
            {
                xtype: 'container',
                cls: 'a-dialog-card-footer-inner',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'space-between',
                },
                items: [
                    {
                        xtype: 'div',
                    },
                    {
                        xtype: 'container',
                        items: [
                            {
                                xtype: 'button',
                                text: 'Cancel',
                                margin: '0 8',
                                handler: function (me) {
                                    Ext.Msg.confirm(
                                        'Confirmation',
                                        'Would you like to discard all changes?',
                                        function (answer) {
                                            if (answer == 'yes') {
                                                me.upVM().get('workflow').reject();
                                                me.up('dialog').destroy();
                                            }
                                        },
                                        this,
                                        [
                                            {
                                                xtype: 'button',
                                                itemId: 'no',
                                                margin: '0 8 0 0',
                                                text: 'Cancel',
                                            },
                                            {
                                                xtype: 'button',
                                                itemId: 'yes',
                                                enableToggle: true,
                                                ui: 'action loading',
                                                text: 'Discard',
                                            },
                                        ]
                                    );
                                },
                            },
                            {
                                xtype: 'button',
                                enableToggle: true,
                                ui: 'action loading',
                                bind: {
                                    text: '{isEdit ? "Update":"Create workflow"}',
                                    disabled: '{workflow.type ? false:true}',
                                },
                                handler: function (me) {
                                    let form = me.up('dialog').down('formpanel'),
                                        workflows = me.upVM().get('workflows'),
                                        workflow = me.upVM().get('workflow');
                                    if (form.validate()) {
                                        const rulesData = {
                                            rules: [
                                                {
                                                    conditions: workflow.get('rules_data_response'),
                                                },
                                            ],
                                        };
                                        workflow.set('rules_data', rulesData);
                                        //approve automatically we dont care about approvers
                                        if (!workflow.get('approve_automatically')) {
                                            // approvers_data
                                            const approvalsData = {
                                                approvers: [],
                                            };
                                            me.up('dialog')
                                                .down('[cls~=approvals_list]')
                                                .getStore()
                                                .each(function (value) {
                                                    if (value.get('roles')) {
                                                        approvalsData.approvers.push(value.getData());
                                                    } else {
                                                        value.set('roles', null);
                                                        approvalsData.approvers.push(value.getData());
                                                    }
                                                });
                                            workflow.set('approvers_data', approvalsData);
                                        } else {
                                            workflow.set('approvers_data', null);
                                        }
                                        workflow.save({
                                            success: function (record, msg) {
                                                if (!me.upVM().get('isEdit')) {
                                                    workflows.add(record);
                                                }
                                                me.up('dialog').destroy();
                                                Ext.toast('Record updated', 1000);
                                            },
                                            failure: function (record, operation) {
                                                let response = operation.error.response.responseJson;
                                                Ext.Msg.alert('Something went wrong', response.message);
                                            },
                                        });
                                    } else {
                                        me.up('dialog').down('[cls~="errors_div"]').setHidden(false);
                                        let htmlTpl =
                                            '<div class="fs-16 fw-b">Fill all required fields:</div><ul></ul>';
                                        let validationErrors = form.getErrors();
                                        Ext.Object.each(validationErrors, function (error, value) {
                                            if (value) {
                                                htmlTpl += '<li><b>' + error + ' is required</li>';
                                            }
                                        });
                                        htmlTpl += '</ul>';
                                        me.up('dialog')
                                            .down('[cls~="errors_div"]')
                                            .getItems()
                                            .getAt(1)
                                            .setHtml(htmlTpl);
                                        me.up('dialog').getScrollable().scrollTo(0, 0, true);
                                        me.toggle();
                                    }
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
});
