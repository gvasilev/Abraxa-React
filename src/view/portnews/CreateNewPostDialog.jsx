import '../../core/components/fields/FromToDateField';
import '../common/combo/Commodity';
import './CreateNewPostDialogController';
import './CreateNewPostDialogViewModel';
import './PortNewsAttachmentsContainer';
import '../../core/components/combo/Port';

Ext.define('Abraxa.view.portnews.CreateNewPostDialog', {
    extend: 'Ext.Dialog',
    xtype: 'CreateNewPostDialog',
    cls: 'a-dialog-fullscreen a-dialog-card-layout',
    controller: 'CreateNewPostDialogController',
    scrollable: 'y',
    fullscreen: true,
    // closable: true,
    draggable: false,
    width: '100%',
    height: '100%',
    title: false,
    viewModel: 'createNewPostDialogViewModel',
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
            handler: 'onCancel',
        },
    },

    constructor: function () {
// this.callParent(arguments);
        this.getViewModel().set('currentRoute', window.location.href);
        this.getViewModel().set('addedFiles', Ext.create('Ext.data.Store'), { data: [] });

        this.on('show', function () {
            window.history.replaceState({}, '', window.location.href);
            window.addEventListener('popstate', this.prevetBrowserBackButton);
        });

        this.on('destroy', function () {
            window.removeEventListener('popstate', this.prevetBrowserBackButton);
        });
    },

    prevetBrowserBackButton: function (event) {
        const curentRoute = Ext.ComponentQuery.query('dialog')
            .filter((el) => el.isVisible())[0]
            .getViewModel()
            .get('currentRoute');
        window.history.pushState({}, '', curentRoute);
        Ext.toast('Dialog is not closed!', 1000);
    },

    initialize: function () {
// this.callParent(arguments);
        const vm = this.getViewModel();
        vm.set('files', Ext.create('Ext.data.Store'));
    },

    setRecord(record) {
        const vm = this.getViewModel();
        vm.set('record', record);
        vm.set('isEdit', record ? true : false);
        if (record) {
            this.setMasked({
                xtype: 'loadmask',
                message: 'Please wait data is loading...',
            });
        }
    },
    items: [
        {
            xtype: 'div',
            cls: 'a-dialog-card-title',
            bind: {
                html: `{record ? 'Edit post': 'Create a post'}`,
            },
        },
        {
            xtype: 'formpanel',
            testId: 'agreementsInstructionsCreateFormPanel',
            cls: 'a-dialog-card',
            reference: 'instructionForm',
            scrollable: 'y',
            padding: 32,
            defaults: {
                clearable: false,
                labelAlign: 'top',
                ui: 'classic field-lg',
                margin: '0 0 16 0',
            },
            items: [
                {
                    xtype: 'textfield',
                    label: 'Title',
                    labelAlign: 'top',
                    placeholder: 'Enter title',
                    testId: 'agreementsInstructionsCreateEnterTitleField',
                    cls: 'a-field-icon icon-short icon-rounded',
                    required: true,
                    name: 'title',
                    bind: {
                        value: '{recordCopy.title}',
                    },
                    // TODO: This listener doesn't work as expected
                    listeners: {
                        painted: function (me) {
                            setTimeout(() => {
                                me.focus();
                            }, 300);
                        },
                    },
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    defaults: {
                        clearable: false,
                        labelAlign: 'top',
                        flex: 1,
                        ui: 'classic field-lg',
                    },
                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Type',
                            required: true,
                            labelAlign: 'top',
                            editable: false,
                            name: 'type_id',
                            cls: 'a-field-icon icon-place icon-rounded',
                            margin: '0 8 0 0',
                            displayField: 'name',
                            valueField: 'id',
                            queryMode: 'local',
                            displayTpl: '{name:capitalize}',
                            itemTpl: '{name:capitalize}',
                            placeholder: 'Choose type ',
                            bind: {
                                store: '{portNewsType}',
                                value: '{recordCopy.type_id}',
                            },
                        },
                        {
                            xtype: 'FromToDateField',
                            label: 'Validity',
                            labelAlign: 'top',
                            cls: 'a-field-icon icon-date icon-rounded',
                            margin: '0 0 0 8',
                            required: true,
                            bind: {
                                value: '{validityDate}',
                            },
                            name: 'date',
                        },
                    ],
                },
                {
                    // xtype: 'ports.served.combo',
                    xtype: 'port.combo',
                    name: 'port_ids',
                    required: true,
                    flex: 1,
                    label: 'Port',
                    labelAlign: 'top',
                    cls: 'a-field-icon icon-port icon-rounded',
                    multiSelect: true,
                    // forceSelection: true,
                    placeholder: 'Choose ports',
                    bind: {
                        value: '{portIds}',
                    },
                },

                {
                    xtype: 'commodity.combo',
                    cls: 'a-field-icon icon-short icon-rounded',
                    name: 'commodity_ids',
                    label: 'Commodity',
                    labelAlign: 'top',
                    multiSelect: true,
                    valueField: 'id',
                    displayField: 'name',
                    placeholder: 'Choose commodity',
                    bind: {
                        value: '{commodityIds}',
                    },
                    listeners: {
                        painted: 'setUpCommodityServedCombo',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-instructions-container',
                    items: [
                        {
                            xtype: 'froalaeditorfield',
                            name: 'body',
                            label: 'Feed',
                            required: true,
                            shadow: false,
                            labelAlign: 'top',
                            flex: 1,
                            editor: {
                                autofocus: true,
                                attribution: false,
                                quickInsertEnabled: false,
                                theme: 'royal',
                                pastePlain: true,
                                enter: 2,
                                imagePaste: false,
                                height: 300,
                                charCounterCount: false,
                                toolbarButtons: [
                                    'bold',
                                    'italic',
                                    'underline',
                                    'fontSize',
                                    'backgroundColor',
                                    'textColor',
                                    'formatOL',
                                    'formatUL',
                                ],
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    // Ugly fix
                                    fn: function fn(me) {
                                        const component = this.component;
                                        setTimeout(() => {
                                            Ext.select('.fr-element.fr-view').elements[0].focus();
                                        }, 0);
                                    },
                                },
                            },
                            bind: {
                                value: '{recordCopy.body}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'PortNewsAttachmentsContainer',
                            readOnly: false,
                        },
                        {
                            xtype: 'filebutton',
                            flex: 1,
                            multiple: true,

                            accept: '.pdf,.doc,.docs,.xls,.xlsx,.jpeg,.png,',
                            text: 'Upload',
                            ui: 'normal-light',
                            iconCls: 'md-icon-outlined md-icon-cloud-upload',
                            name: 'files',
                            listeners: {
                                change: 'addFiles',
                            },
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
                        xtype: 'button',
                        ui: 'danger-light',
                        text: 'Delete post',
                        hideMode: 'visibility',
                        bind: {
                            hidden: '{record ? false: true}',
                        },
                        handler: 'onDelete',
                    },
                    {
                        xtype: 'container',
                        items: [
                            {
                                xtype: 'button',
                                text: 'Cancel',
                                margin: '0 8',
                                handler: 'onCancel',
                            },
                            {
                                xtype: 'button',
                                text: '',
                                enableToggle: true,
                                ui: 'action loading',
                                bind: {
                                    text: '{record ? "Update & Publish" : "Publish"}',
                                },
                                handler: 'onSubmit',
                            },
                        ],
                    },
                ],
            },
        ],
    },
});
