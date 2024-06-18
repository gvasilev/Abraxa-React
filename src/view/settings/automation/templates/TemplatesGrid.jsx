import './AddEditTemplate';

Ext.define('Abraxa.view.settings.automation.templates.TemplatesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.automation.templates.grid',
    testId: 'templatesGrid',
    cls: 'a-offset-grid abraxa-grid',
    margin: '0 -32',
    ui: 'bordered',
    shadow: false,
    flex: 1,
    bind: {
        store: '{templates}',
        hideHeaders: '{templates.count ? false : true}',
    },
    itemConfig: {
        height: 56,
        viewModel: true,
    },
    collapsible: {
        collapseToolText: 'Collapse group',
        tool: {
            ui: 'tool-md',
            margin: '0 8 0 12',
            zone: 'end',
        },
    },
    reference: 'templatesGrid',
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9972 -18910)"><g transform="translate(9138 18565)" opacity="0.4"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(10007 18945)"><path d="M13,33.5H31V38H13Zm0-9H31V29H13ZM26.5,2H8.5A4.513,4.513,0,0,0,4,6.5v36A4.494,4.494,0,0,0,8.477,47H35.5A4.513,4.513,0,0,0,40,42.5v-27Zm9,40.5H8.5V6.5H24.25V17.75H35.5Z" transform="translate(5 2.5)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1.5"/><g transform="translate(18 18)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1"><rect width="8" height="4.5" stroke="none"/><rect x="0.5" y="0.5" width="7" height="3.5" fill="none"/></g></g></g></svg><div class="a-no-content-txt">No templates available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Template',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                handler: function (me) {
                    let currentUserPlan = me.upVM().get('currentUserPlan');
                    if (currentUserPlan == 'starter') {
                        Ext.create('Abraxa.view.main.UpgradeDialog').show();
                    } else {
                        let type = this.upVM().get('templatesTabs').activeTab.type;
                        mixpanel.track('Template ' + type + ' - button');
                        Ext.create('Abraxa.view.settings.automation.templates.AddEditTemplate', {
                            viewModel: {
                                parent: me.upVM(),
                                data: {
                                    title:
                                        'Create <span class="a-fix-' +
                                        type +
                                        '">&nbsp;' +
                                        type +
                                        '&nbsp;</span> template',
                                    editMode: false,
                                    record: Ext.create('Abraxa.model.template.Template', {
                                        type: type,
                                    }),
                                },
                            },
                        }).show();
                    }
                },
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    plugins: {
        grideditable: false,
        gridcellediting: {
            triggerEvent: 'tap',
            selectOnEdit: true,
        },
    },
    columns: [
        {
            text: 'Template',
            cls: 'a-column-offset-x32',
            dataIndex: 'name',
            groupable: false,
            minWidth: 320,
            flex: 4,
            cell: {
                cls: 'a-cell-offset-x32',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    let count = 0;
                    switch (record.get('type')) {
                        case 'task':
                            count = record.get('task_items_count') + ' tasks';
                            break;
                        case 'sof':
                            count = record.get('sof_events_count') + ' events';
                            break;
                        case 'disbursement':
                            count = record.get('disbursement_items_count') + ' items';
                            break;

                        default:
                            break;
                    }
                    return (
                        '<div class="hbox a_grid_action"><div class="a-badge a-badge-x32 a-badge-tasks"><i class="material-icons-outlined">description</i></div><div class="ml-16 text-truncate"><div class="text-truncate fw-b c-blue">' +
                        value +
                        '</div><div class="sm-title">' +
                        count +
                        '</div></div></div>'
                    );
                }
            },
            sorter: {
                sorterFn: function (record1, record2) {
                    let val1 = record1.get('name') || '';
                    let val2 = record2.get('name') || '';
                    return val1.localeCompare(val2);
                },
            },
        },
        {
            text: 'Office',
            dataIndex: 'office_id',
            minWidth: 180,
            cell: {
                cls: 'no_expand',
                encodeHtml: false,
            },
            // Fix broken template of group headers
            groupHeaderTpl: new Ext.XTemplate('<div class="d-flex">{[this.parseOfficeName(values)]} ({count})</div>', {
                parseOfficeName: function (value) {
                    let officeName = AbraxaConstants.placeholders.emptySpan;

                    if (value && value.children && value.children[0] && value.children[0].get('office_name')) {
                        officeName = value.children[0].get('office_name');
                    }

                    return officeName;
                },
            }),
            editor: {
                field: {
                    xtype: 'selectfield',
                    label: '',
                    valueField: 'id',
                    displayField: 'office_name',
                    cls: 'a-field-icon icon-rounded icon-business-center',
                    queryMode: 'local',
                    editable: false,
                    placeholder: 'Choose an office',
                    bind: {
                        store: '{offices}',
                    },
                },

                listeners: {
                    complete: function (editor, newValue, startValue, eOpts) {
                        if (newValue === startValue) return;
                        let record = editor.ownerCmp.getRecord();
                        let store = editor.upVM().get('templates');
                        if (record && record.dirty) {
                            store.sync({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function () {
                                    Ext.Msg.alert('Something went wrong', 'Error while updating record.');
                                },
                            });
                        }
                    },
                    beforecomplete: function (editor, newValue, startValue, eOpts) {
                        if (newValue === startValue) return;
                        let value = editor.getField().getInputValue();
                        let gridRecord = editor.ownerCmp.getRecord();
                        gridRecord.set('office_name', value);
                    },
                },
            },
            renderer: function (value, record) {
                if (value) {
                    return (
                        '<span class="hbox c-blue-grey d-flex"><i class="md-icon-outlined md-18 mr-8">maps_home_work</i>' +
                        record.get('office_name') +
                        '</span>'
                    );
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            sorter: {
                sorterFn: function (record1, record2) {
                    let val1 = record1.get('office_name') || '';
                    let val2 = record2.get('office_name') || '';
                    return val1.localeCompare(val2);
                },
            },
        },
        {
            text: 'Created by',
            minWidth: 220,
            cell: {
                cls: 'no_expand',
                encodeHtml: false,
                xtype: 'widgetcell',
                selectable: true,
                widget: {
                    xtype: 'public.updated.by',
                    padding: '0 12',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{record.created_by_user}',
                            updated_at: '{record.created_at}',
                        },
                    },
                },
            },
            sorter: {
                sorterFn: function (record1, record2) {
                    let val1 = '';
                    let val2 = '';
                    if (record1.get('created_by_user')) {
                        val1 = record1.get('created_by_user').full_name;
                    }
                    if (record2.get('created_by_user')) {
                        val2 = record2.get('created_by_user').full_name;
                    }
                    return val1.localeCompare(val2);
                },
            },
        },
        {
            text: 'Updated by',
            minWidth: 220,
            cell: {
                cls: 'no_expand',
                encodeHtml: false,
                xtype: 'widgetcell',
                selectable: true,
                widget: {
                    xtype: 'public.updated.by',
                    padding: '0 12',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{record.updated_by_user}',
                            updated_at: '{record.updated_at}',
                        },
                    },
                },
            },
            sorter: {
                sorterFn: function (record1, record2) {
                    let val1 = '';
                    let val2 = '';
                    if (record1.get('updated_by_user')) {
                        val1 = record1.get('updated_by_user').full_name;
                    }
                    if (record1.get('updated_by_user')) {
                        val2 = record2.get('updated_by_user').full_name;
                    }
                    return val1.localeCompare(val2);
                },
            },
        },
        {
            dataIndex: '',
            minWidth: 110,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cls: 'a-column-actions',
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        arrow: false,
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        menu: {
                            cls: 'a-main-edit-menu',
                            width: 160,
                            ui: 'has-icons medium',
                            items: [
                                {
                                    text: 'Edit',
                                    hidden: true,
                                    iconCls: 'md-icon-outlined md-icon-edit',
                                    handler: function (me) {
                                        let type = this.upVM().get('templatesTabs').activeTab.type;
                                        let dialog = Ext.create(
                                            'Abraxa.view.settings.automation.templates.AddEditTemplate',
                                            {
                                                viewModel: {
                                                    parent: me.upVM(),
                                                    data: {
                                                        title:
                                                            'Edit <span class="a-fix-' +
                                                            type +
                                                            '">&nbsp;' +
                                                            type +
                                                            '&nbsp;</span> template',
                                                        editMode: true,
                                                        record: me.upVM().get('record'),
                                                    },
                                                },
                                            }
                                        );
                                        dialog.show();
                                    },
                                },
                                {
                                    text: 'Delete',
                                    testId: 'deleteTemplateBtnRulesAndTeamsSettingsTestId',
                                    iconCls: 'md-icon-outlined md-icon-delete',
                                    ui: 'decline',
                                    separator: false,
                                    slug: 'settingsTemplateDelete',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (button, el, data) {
                                        Ext.Msg.confirm(
                                            'Delete',
                                            'Are you sure you would like to delete this template?',
                                            function (answer) {
                                                if (answer != 'yes') return;
                                                let store = button.upVM().get('templates'),
                                                    record = this.upVM().get('record');
                                                store.remove(record);
                                                store.sync({
                                                    success: function () {
                                                        Ext.toast('Record deleted', 1000);
                                                    },
                                                });
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
                                                    testId: 'deleteTemplateBtnRulesAndTeamsSettingsTestIdConfirm',
                                                    itemId: 'yes',
                                                    ui: 'decline alt',
                                                    text: 'Delete',
                                                },
                                            ]
                                        );
                                    },
                                },
                            ],
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function () {
                            let upContainer = Ext.ComponentQuery.query('[itemId=automationMainContainer]')[0],
                                downContainer = Ext.ComponentQuery.query('[itemId=templateDetails]')[0];
                            upContainer.setHidden(true);
                            downContainer
                                .setShowAnimation({
                                    type: 'slide',
                                    direction: 'left',
                                })
                                .show();
                        },
                    },
                ],
            },
        },
    ],

    listeners: {
        childtap: function (me, selection) {
            let record = selection.record;
            if (record && selection.cell && !selection.cell.hasCls('no_expand')) {
                let upContainer = Ext.ComponentQuery.query('[itemId=automationMainContainer]')[0],
                    downContainer = Ext.ComponentQuery.query('[itemId=templateDetails]')[0];
                upContainer.setHidden(true);
                downContainer
                    .setShowAnimation({
                        type: 'slide',
                        direction: 'left',
                    })
                    .show();
            }
        },
    },
});
