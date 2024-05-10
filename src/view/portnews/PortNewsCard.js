Ext.define('Abraxa.view.portnews.PortNewsCard', {
    xtype: 'PortNewsCard',
    extend: 'Ext.Container',
    viewModel: 'portNewsCardViewModel',

    initialize: function () {
        this.mask({
            xtype: 'loadmask',
        });
    },

    setRecord(record) {
        this.getViewModel().set('record', record);
    },

    listeners: {
        painted: function () {
            this.el.on('click', function () {
                const portNewsCardVM = this.component.getViewModel();
                const record = portNewsCardVM.get('record');
                if (record.get('user_data').is_new) {
                    portNewsCardVM.set('isNewInProggress', true);
                    const userData = record.get('user_data');
                    userData.is_new = false;
                    record.set('user_data', { ...userData });
                    Ext.Ajax.request({
                        url: `${Env.ApiEndpoint}port-news/${record.get('id')}/user-data`,
                        method: 'PATCH',
                        // headers: {
                        //     Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                        //     'Content-Type': 'application/json',
                        // },
                        jsonData: { is_new: false },
                        success: function (response, options) {
                            portNewsCardVM.set('isNewInProggress', false);
                        },
                        failure: function () {},
                    });
                }
            });
        },
    },

    items: [
        {
            //Header
            xtype: 'container',
            cls: 'a-card-header',
            layout: {
                type: 'hbox',
                pack: 'space-between',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'component',
                    cls: 'a-card-header-title',
                    bind: {
                        html: '{title}',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-card-header-extra',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'component',
                            cls: 'a-card-header-date',
                            bind: {
                                html: '<div class="a-date-title">Validity</div><div class="a-date-value"><b>{record.validity_from:date("d M y")}</b> until <b>{record.validity_to:date("d M y")}</b></div>',
                            },
                        },
                        {
                            xtype: 'button',
                            cls: 'a-card-header-action',
                            ui: 'tool-lg round',
                            iconCls: 'md-icon-edit md-icon-outlined',
                            bind: {
                                hidden: '{record.company.id !== currentUser.company.id}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                anchor: true,
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                html: 'Edit post',
                                align: 'bc-tc?',
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                const record = this.up('PortNewsCard').getViewModel().get('record');
                                const editDialog = Ext.create('Abraxa.view.portnews.CreateNewPostDialog', {
                                    record: record,
                                });
                                editDialog.show();
                            },
                        },
                    ],
                },
            ],
        },

        //Main info
        {
            xtype: 'container',
            cls: 'a-card-body',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-card-info-bar a-bb-100',
                    layout: {
                        type: 'vbox',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'mb-16',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'PortNewsTypes',
                                    // Ugly fix
                                    margin: '0 0 0 -4px',
                                    editable: false,
                                    viewModel: {
                                        formulas: {
                                            typeName1: {
                                                bind: {
                                                    bindTo: '{portNewsTypes}',
                                                    deep: true,
                                                },
                                                get: function (portNewsTypes) {
                                                    const store = portNewsTypes;
                                                    const recordTypeId = this.get('record.type_id');
                                                    if (recordTypeId === null)
                                                        return [
                                                            {
                                                                id: null,
                                                                name: '',
                                                            },
                                                        ];
                                                    const index = store.find('id', recordTypeId);

                                                    return [
                                                        {
                                                            id: recordTypeId,
                                                            name: store.getAt(index).get('name'),
                                                        },
                                                    ];
                                                },
                                            },
                                            typeName: function (get) {
                                                const recordTypeId = get('record.type_id');
                                                const store = this.getView()
                                                    .up('PortNewsCard')
                                                    .upVM()
                                                    .get('portNewsTypes');
                                                const index = store.find('id', recordTypeId);

                                                return [
                                                    {
                                                        id: recordTypeId,
                                                        name: store.getAt(index).get('name'),
                                                    },
                                                ];
                                            },
                                        },
                                    },
                                    bind: {
                                        store: '{typeName}',
                                    },
                                },
                                {
                                    xtype: 'component',
                                    cls: 'a-card-info-updated',
                                    bind: {
                                        html: '{updatedCreatedBy}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'component',
                            cls: 'a-card-info-list',
                            bind: {
                                html: '<i class="md-icon md-icon-location-on"></i><div>{ports}</div>',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: 'a',
                                    fn: function (element, htmlEl, c) {
                                        const recordId = +element.target.getAttribute('id');
                                        if (recordId) {
                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .showPortDialogById(recordId);
                                        }
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'component',
                    cls: 'a-card-body-text a-bb-100',
                    bind: {
                        html: '{record.body}',
                    },
                },
                {
                    xtype: 'component',
                    cls: 'a-card-info-bar a-card-info-list a-bb-100',
                    bind: {
                        html: '<i class="md-icon">tag</i><span>{commodities}</span>',
                        hidden: '{!record.commodities.length}',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a',
                            fn: function (element, htmlEl, c) {
                                const recordId = +element.target.getAttribute('id');
                                if (recordId) {
                                    Abraxa.Global.showCommodityDialog(recordId);
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'PortNewsAttachmentsContainer',
                    cls: 'a-card-info-bar a-card-info-list',
                    readOnly: true,
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-card-footer',
            docked: 'bottom',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'button',
                    ui: 'default outlined',
                    iconCls: 'md-icon md-icon-thumb-up',
                    cls: 'a-has-counter',
                    bind: {
                        html: '{likeButtonHtml}',
                        iconCls: '{likeButtonIconCls}',
                    },
                    html: 'Like',

                    handler: function (button) {
                        button.setDisabled(true);
                        const vm = this.up('PortNewsCard').getViewModel();
                        const currentUser = vm.get('currentUser');
                        const record = vm.get('record');

                        if (record) {
                            const userData = record.get('user_data');
                            const likes = record.likes();

                            let isCurrentUser = likes.findBy(function (rec) {
                                return rec.get('liker').id == currentUser.get('id');
                            });
                            if (isCurrentUser === -1) {
                                likes.add({
                                    likable_type: 'Modules\\PortNews\\Models\\PortNews',
                                    likable_id: record.get('id'),
                                });
                            } else {
                                likes.removeAt(isCurrentUser);
                            }

                            likes.sync({
                                callback: function () {
                                    button.setDisabled(false);
                                },
                            });
                        }
                    },
                },
            ],
        },
    ],
});
