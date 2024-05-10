Ext.define('Abraxa.view.portcall.appointment.AppointmentInstructions', {
    extend: 'Ext.Container',
    xtype: 'appointment.instructions',
    flex: 1,
    padding: '8 24',
    subObject: 'appointment',
    bind: {
        permission: '{userPermissions}',
        objectPermission: '{objectPermissions}',
    },
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'div',
                            html: "<div class='hbox'><div class='a-badge a-badge-default'><i class='md-icon-outlined'>description</i></div><div class='a-panel-title fs-14'>Instructions</div></div>",
                            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right',
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        let component = this.component;
                                        component.toggleCls('is-collapsed');
                                        component
                                            .up('container')
                                            .up('container')
                                            .up('container')
                                            .down('[cls~=a-collapsible-container]')
                                            .toggleCls('is-collapsed');
                                    },
                                },
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-collapsible-container',
            items: [
                {
                    xtype: 'container',
                    padding: '0 0 0 48',
                    showNoPermissions: true,
                    slug: 'portcallVoyInstructions',
                    bind: {
                        permission: '{userPermissions}',
                        cls: 'a-appointments-form {instructions.count ? "w-50":""}',
                    },
                    layout: 'vbox',
                    defaults: {
                        labelAlign: 'left',
                        ui: 'classic',
                        flex: 1,
                    },
                    items: [
                        {
                            xtype: 'abraxa.formlist',
                            minHeight: 280,
                            cls: 'a-portcall-data a-cargo-data instruction_list',
                            bind: {
                                store: '{instructions}',
                            },
                            itemTpl: null,
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
                                        html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9972 -18910)"><g transform="translate(9138 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(10007 18945)"><path d="M13,33.5H31V38H13Zm0-9H31V29H13ZM26.5,2H8.5A4.513,4.513,0,0,0,4,6.5v36A4.494,4.494,0,0,0,8.477,47H35.5A4.513,4.513,0,0,0,40,42.5v-27Zm9,40.5H8.5V6.5H24.25V17.75H35.5Z" transform="translate(5 2.5)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1.5"/><g transform="translate(18 18)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1"><rect width="8" height="4.5" stroke="none"/><rect x="0.5" y="0.5" width="7" height="3.5" fill="none"/></g></g></g></svg><div class="a-no-content-txt">No instructions available</div></div>',
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Instructions',
                                        cls: 'a-no-content-btn',
                                        ui: 'normal-light medium',
                                        iconCls: 'md-icon-add',
                                        slug: 'portcallVoyInstructions',
                                        bind: {
                                            cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                                            permission: '{userPermissions}',
                                        },
                                        handler: function (me) {
                                            let record = me.upVM().get('object_record'),
                                                nomination = me.upVM().get('nomination');
                                            Ext.create('Abraxa.view.portcall.appointment.AddInstructions', {
                                                viewModel: {
                                                    parent: me.upVM(),
                                                    stores: {
                                                        files: Ext.create('Ext.data.Store'),
                                                    },
                                                    data: {
                                                        editMode: false,
                                                        portcall: record,
                                                        nomination: nomination,
                                                        instruction: Ext.create('Abraxa.model.portcall.Instruction', {
                                                            owner_id: record.get('id'),
                                                            owner_type: record.get('model_name'),
                                                        }),
                                                    },
                                                },
                                            }).show();
                                        },
                                    },
                                ],
                            },
                            emptyTextDefaults: {
                                xtype: 'emptytext',
                                cls: 'a-empty-text',
                            },
                            itemConfig: {
                                viewModel: true,
                                xtype: 'container',
                                padding: '8 0 0 0',
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'h1',
                                        bind: {
                                            html: '<a href="javascript:void(0);" class="instruction_link">{record.title}</a>',
                                        },
                                        listeners: {
                                            click: {
                                                element: 'element',
                                                delegate: 'a.instruction_link',
                                                fn: function () {
                                                    var record = this.component.upVM().get('record');
                                                    Ext.ComponentQuery.query('[xtype=appointment\\.main]')[0]
                                                        .getVM()
                                                        .set('selectedInstruction', record);
                                                },
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'div',
                                        margin: '12 0',
                                        bind: {
                                            html: '{record.description_short} <a href="javascript:void(0);" class="fw-b c-link instruction_link">view more</a>',
                                        },
                                        listeners: {
                                            click: {
                                                element: 'element',
                                                delegate: 'a.instruction_link',
                                                fn: function () {
                                                    var record = this.component.upVM().get('record');
                                                    Ext.ComponentQuery.query('[xtype=appointment\\.main]')[0]
                                                        .getVM()
                                                        .set('selectedInstruction', record);
                                                },
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        bind: {
                                            hidden: '{record.attachments.count ? false:true}',
                                        },
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'h5',
                                                html: 'Attachments',
                                            },
                                            {
                                                xtype: 'list',
                                                padding: '8 0 0 0',
                                                margin: '0 -4',
                                                layout: {
                                                    type: 'hbox',
                                                    wrap: true,
                                                },
                                                bind: {
                                                    store: '{record.attachments}',
                                                },
                                                cls: 'a-voyage-attachments',
                                                itemConfig: {
                                                    cls: 'a-attachment-item',
                                                    margin: '0 4 8 4',
                                                    minWidth: 0,
                                                    viewModel: {
                                                        formulas: {
                                                            itemTpl: {
                                                                bind: {
                                                                    bindTo: '{record.document}',
                                                                    deep: true,
                                                                },
                                                                get: function (record) {
                                                                    let document = record;
                                                                    let nonEditable = this.get('nonEditable');
                                                                    if (nonEditable) {
                                                                        return (
                                                                            '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="' +
                                                                            document.getData().extension +
                                                                            '"></div><div><a class="file_name" href="javascript:void(0);">' +
                                                                            document.getData().name +
                                                                            '.' +
                                                                            document.getData().extension +
                                                                            '</a><span class="sm-title">' +
                                                                            document.getData().size +
                                                                            ' kb</span></div></div>'
                                                                        );
                                                                    } else {
                                                                        if (
                                                                            this.get('userPermissions')
                                                                                .portcallVoyInstructions.edit
                                                                        ) {
                                                                            return (
                                                                                '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="' +
                                                                                document.getData().extension +
                                                                                '"></div><div><a class="file_name" href="javascript:void(0);">' +
                                                                                document.getData().name +
                                                                                '.' +
                                                                                document.getData().extension +
                                                                                '</a><span class="sm-title">' +
                                                                                document.getData().size +
                                                                                ' kb</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>'
                                                                            );
                                                                        } else {
                                                                            return (
                                                                                '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="' +
                                                                                document.getData().extension +
                                                                                '"></div><div><a class="file_name" href="javascript:void(0);">' +
                                                                                document.getData().name +
                                                                                '.' +
                                                                                document.getData().extension +
                                                                                '</a><span class="sm-title">' +
                                                                                document.getData().size +
                                                                                ' kb</span></div></div>'
                                                                            );
                                                                        }
                                                                    }
                                                                },
                                                            },
                                                        },
                                                    },
                                                    layout: {
                                                        type: 'hbox',
                                                        pack: 'space-between',
                                                    },
                                                    bind: {
                                                        tpl: '{itemTpl}',
                                                    },
                                                },
                                                listeners: {
                                                    childtap: function (me, selection, events) {
                                                        var store = me.getStore();
                                                        let record = selection.record;
                                                        var selectedInstruction = me.upVM().get('record'),
                                                            controller = me
                                                                .find('dropped-portcall-right-instructions')
                                                                .getController(),
                                                            ids = [];
                                                        if (
                                                            selection.sourceElement.classList.contains(
                                                                'remove_attachment'
                                                            )
                                                        ) {
                                                            Ext.Msg.confirm(
                                                                'Delete',
                                                                'Are you sure you would like to delete this entry?',
                                                                function (answer) {
                                                                    if (answer != 'yes') return;
                                                                    store.remove(record);
                                                                    ids.push(record.get('id'));
                                                                    controller.deleteFiles(ids, selectedInstruction);
                                                                    Ext.toast('Record updated', 1000);
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
                                                                        ui: 'decline alt',
                                                                        text: 'Delete',
                                                                        separator: true,
                                                                    },
                                                                ]
                                                            );
                                                        } else {
                                                            if (record) {
                                                                var selectedFile = record.getDocument(),
                                                                    documents = [];

                                                                store.each(function (attachment) {
                                                                    documents.push(attachment.getDocument());
                                                                });

                                                                Abraxa.getApplication()
                                                                    .getController('AbraxaController')
                                                                    .previewFile(me, selectedFile, documents);

                                                                return;
                                                            }
                                                        }
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'public.updated.by',
                                        margin: '16 0 0 0',
                                        maxWidth: 164,
                                        bind: {
                                            data: {
                                                user: '{record.updated_by_user}',
                                                updated_at: '{record.updated_at}',
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'divider divider-offset offset-x0',
                                        html: '<hr>',
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'toolbar',
                            docked: 'bottom',
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-add',
                                    ui: 'normal small',
                                    text: 'Add instructions',
                                    left: 48,
                                    slug: 'portcallVoyInstructions',
                                    bind: {
                                        cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                                        permission: '{userPermissions}',
                                        hidden: '{instructions.count ? false:true}',
                                    },
                                    handler: function (me) {
                                        let record = me.upVM().get('object_record'),
                                            nomination = me.upVM().get('nomination');
                                        Ext.create('Abraxa.view.portcall.appointment.AddInstructions', {
                                            viewModel: {
                                                parent: me.upVM(),
                                                stores: {
                                                    files: Ext.create('Ext.data.Store'),
                                                },
                                                data: {
                                                    editMode: false,
                                                    portcall: record,
                                                    nomination: nomination,
                                                    instruction: Ext.create('Abraxa.model.portcall.Instruction', {
                                                        owner_id: record.get('id'),
                                                        owner_type: record.get('model_name'),
                                                    }),
                                                },
                                            },
                                        }).show();
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
