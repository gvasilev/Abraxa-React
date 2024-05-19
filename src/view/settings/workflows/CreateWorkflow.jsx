import '../../../store/disbursements/DefaultDisbursementTags.jsx';
import '../../common/combo/GeneralVesselType.jsx';
Ext.define('Abraxa.view.settings.workflows.CreateWorkflow', {
    extend: 'Ext.Dialog',
    xtype: 'settings.workflow.create',
    cls: 'a-dialog-fullscreen a-dialog-card-layout a-dialog-create a-dialog-workflow',
    scrollable: 'y',
    // fullscreen: true,
    // closable: true,
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
    // showAnimation: 'fadeIn',
    // hideAnimation: 'fadeOut',
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
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'a-sep-card',
                    html: '<span class="a-sep-text">When this happens</span><i class="a-sep-icon md-icon">south</i>',
                },
                {
                    xtype: 'container',
                    padding: 32,
                    cls: 'a-dialog-card',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'h5',
                            html: 'Approval conditions',
                        },
                        {
                            xtype: 'div',
                            cls: 'h3',
                            html: 'Choose conditions',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-dialog-card-form',
                            defaults: {
                                clearable: false,
                                labelAlign: 'left',
                                ui: 'classic hovered-border',
                            },
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Disbursement type',
                                    multiSelect: true,
                                    options: [
                                        {
                                            value: 'pda',
                                            text: 'PDA',
                                        },
                                        {
                                            value: 'dda',
                                            text: 'DDA',
                                        },
                                        {
                                            value: 'fda',
                                            text: 'FDA',
                                        },
                                        {
                                            value: 'sda',
                                            text: 'SDA',
                                        },
                                    ],
                                    bind: {
                                        value: '{workflow.disbursement_type}',
                                        placeholder: '{workflow.disbursement_type ? "":"All types"}',
                                    },
                                    cls: 'a-field-icon icon-rounded icon-short',
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Disbursement label',
                                    cls: 'a-field-icon icon-rounded icon-label',
                                    multiSelect: true,
                                    displayField: 'tag_name',
                                    valueField: 'tag_name',
                                    store: {
                                        type: 'default.disbursement.tags',
                                        autoLoad: true,
                                    },
                                    bind: {
                                        value: '{workflow.label}',
                                        placeholder: '{workflow.label ? "":"All labels"}',
                                    },
                                },
                                {
                                    xtype: 'portRemoteCombo',
                                    label: 'Port',
                                    id: 'port',
                                    cls: 'a-field-icon icon-rounded icon-port',
                                    multiSelect: true,
                                    forceSelection: true,
                                    bind: {
                                        value: '{workflow.port}',
                                        placeholder: '{workflow.port ? "":"All ports"}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            var store = me.getStore();
                                            store.getProxy().setExtraParams({});
                                            if (me.upVM().get('workflow').get('port')) {
                                                store.getProxy().setExtraParams({
                                                    ports: JSON.stringify(me.upVM().get('workflow').get('port')),
                                                });
                                            }
                                            store.load({
                                                callback: function (records, operation, success) {
                                                    if (success) {
                                                        me.setValue(me.upVM().get('workflow').get('port'));
                                                    }
                                                },
                                            });
                                        },
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Port call function',
                                    cls: 'a-field-icon icon-rounded icon-short',
                                    forceSelection: true,
                                    multiSelect: true,
                                    queryMode: 'local',
                                    valueField: 'name',
                                    displayField: 'name',
                                    bind: {
                                        value: '{workflow.port_function}',
                                        placeholder: '{workflow.port_function ? "":"All functions"}',
                                    },
                                    store: {
                                        type: 'berth.function',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    padding: '2 0',
                                    defaults: {
                                        clearable: false,
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                        flex: 1,
                                    },
                                    items: [
                                        {
                                            xtype: 'selectfield',
                                            label: 'Disbursement amount',
                                            reference: 'disbursementAmount',
                                            placeholder: 'Any amount',
                                            value: 'Less than or equals to',
                                            cls: 'a-prepend a-field-icon icon-rounded icon-short',
                                            minWidth: 420,
                                            options: [
                                                {
                                                    text: 'Less than or equals to',
                                                    value: 'less_than_or_equals',
                                                },
                                                {
                                                    text: 'Greater than',
                                                    value: 'greater_than',
                                                },
                                                {
                                                    text: 'Range',
                                                    value: 'between',
                                                },
                                            ],
                                            bind: {
                                                value: '{workflow.disbursement_amount}',
                                            },
                                        },
                                        {
                                            xtype: 'numberfield',
                                            cls: 'a-append',
                                            label: false,
                                            placeholder: '00.00',
                                            hidden: false,
                                            bind: {
                                                hidden: '{workflow.disbursement_amount ? false:true}',
                                                value: '{workflow.disbursement_value_min}',
                                            },
                                        },
                                        {
                                            xtype: 'numberfield',
                                            cls: 'a-append',
                                            label: false,
                                            placeholder: '00.00',
                                            hidden: true,
                                            bind: {
                                                value: '{workflow.disbursement_value_max}',
                                                hidden: '{disbursementAmount.selection.value == "between" ? false:true}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Agency type',
                                    cls: 'a-field-icon icon-rounded icon-short',
                                    forceSelection: true,
                                    clearable: true,
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'id',
                                    multiSelect: true,
                                    bind: {
                                        store: '{agencyTypes}',
                                        // store: [{
                                        //     id: 'charterer nominated',
                                        //     name: 'Charterer nominated'
                                        // }, {
                                        //     id: 'owner nominated',
                                        //     name: 'Owner nominated',
                                        // }, {
                                        //     id: 'owner protective',
                                        //     name: 'Owner protective',
                                        // }],
                                        value: '{workflow.agency_type}',
                                        placeholder: '{workflow.agency_type ? "":"All agency types"}',
                                    },
                                },
                                {
                                    xtype: 'vesseltype.combo',
                                    label: 'Vessel type',
                                    cls: 'a-field-icon icon-rounded icon-short',
                                    multiSelect: true,
                                    bind: {
                                        value: '{workflow.vessel_type}',
                                        placeholder: '{workflow.vessel_type ? "":"All vessel types"}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'a-sep-card a-sep-card-action',
                    html: '<span class="a-sep-text">Do this action</span><i class="a-sep-icon md-icon">south</i>',
                },
                {
                    xtype: 'container',
                    padding: 32,
                    cls: 'a-dialog-card a-dialog-card-last',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'h5',
                            html: 'Approvers',
                        },
                        {
                            xtype: 'container',
                            cls: 'mt-16',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'h3 m-0',
                                    html: 'Then assign role',
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'c-blue-grey-500 mr-16',
                                            html: 'Approve automatically',
                                        },
                                        {
                                            xtype: 'checkboxfield',
                                            ui: 'switch icon',
                                            label: false,
                                            bind: {
                                                checked: '{workflow.approve_automatically}',
                                            },
                                            listeners: {
                                                change: function (me, value) {
                                                    if (!value) {
                                                        let approvals = me.upVM().get('approvals');
                                                        if (!approvals.getCount()) {
                                                            approvals.add({
                                                                roles: null,
                                                                override: false,
                                                            });
                                                        }
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-dialog-card-form',
                            bind: {
                                hidden: '{workflow.approve_automatically}',
                            },
                            items: [
                                {
                                    xtype: 'list',
                                    cls: 'a-form-assign-role-list approvals_list',
                                    bind: {
                                        store: '{approvals}',
                                    },
                                    itemConfig: {
                                        viewModel: {
                                            formulas: {
                                                recordIndex: {
                                                    bind: {
                                                        bindTo: '{record}',
                                                        deep: true,
                                                    },
                                                    get: function (record) {
                                                        if (record) {
                                                            let store = record.store;
                                                            return store.indexOf(record);
                                                        }
                                                    },
                                                },
                                            },
                                        },
                                        xtype: 'container',
                                        cls: 'a-assign-role-item a-bb-100',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'space-between',
                                        },
                                        items: [
                                            {
                                                xtype: 'selectfield',
                                                flex: 2,
                                                clearable: false,
                                                labelAlign: 'left',
                                                ui: 'classic hovered-border',
                                                cls: 'a-field-icon icon-rounded icon-manage-accounts',
                                                padding: '8 0',
                                                valueField: 'id',
                                                displayField: 'name',
                                                multiSelect: true,
                                                placeholder: 'Any role',
                                                bind: {
                                                    store: '{roles}',
                                                    label: '{recordIndex+1} approver',
                                                    value: '{record.roles}',
                                                },
                                            },
                                            {
                                                xtype: 'container',
                                                flex: 1,
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                    pack: 'end',
                                                },
                                                bind: {
                                                    hidden: '{recordIndex === 0 ? false:true}',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'button',
                                                        ui: 'tool round',
                                                        iconCls: 'md-icon md-icon-add-circle',
                                                        tooltip: {
                                                            anchorToTarget: true,
                                                            anchor: true,
                                                            html: 'Add approver',
                                                            align: 'bc-tc?',
                                                            showDelay: 0,
                                                            hideDelay: 0,
                                                            dismissDelay: 0,
                                                            allowOver: false,
                                                            closeAction: 'destroy',
                                                        },
                                                        handler: function (me) {
                                                            me.up('list').getStore().add({
                                                                roles: null,
                                                                override: false,
                                                            });
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                flex: 1,
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                    pack: 'end',
                                                },
                                                bind: {
                                                    hidden: '{recordIndex === 0 ? true:false}',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'checkboxfield',
                                                        bind: {
                                                            checked: '{record.override}',
                                                        },
                                                        boxLabel: 'Override all above',
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-sep-action',
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        ui: 'tool round',
                                                        iconCls: 'md-icon md-icon-delete',
                                                        tooltip: {
                                                            anchorToTarget: true,
                                                            anchor: true,
                                                            html: 'Delete approver',
                                                            align: 'bc-tc?',
                                                            showDelay: 0,
                                                            hideDelay: 0,
                                                            dismissDelay: 0,
                                                            allowOver: false,
                                                            closeAction: 'destroy',
                                                        },
                                                        handler: function (me) {
                                                            me.up('list').getStore().remove(me.upVM().get('record'));
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-dialog-card-info',
                            bind: {
                                cls: 'a-dialog-card-info { workflow.approve_automatically ? "a-form-show":""}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-info-box',
                                    html: '<i class="md-icon">info</i>I would like the system to send an automatic approval message to my vendor on behalf of my organization',
                                },
                            ],
                        },
                    ],
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
