Ext.define('Abraxa.view.adocs.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'adocs.main',
    controller: 'adocs.controller',
    padding: 0,
    margin: 0,
    layout: 'hbox',
    alwaysOnTop: true,
    height: '100%',
    items: [
        {
            xtype: 'container',
            shadow: true,
            flex: 3,
            style: 'text-align: center',
            items: [
                {
                    xtype: 'list',
                    padding: 0,
                    margin: 0,
                    resetFocusPosition: true,
                    activeItem: 0,
                    cls: 'a-cursor-pointer',
                    minHeight: 240,
                    itemInnerCls: 'w-100',
                    innerCls: 'w-100',
                    emptyText:
                        '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-10234 -18910)"><g transform="translate(9400 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(9718.83 18893.16)"><path d="M580.64,51.64v14.8h14.8Z" fill="#c8d4e6"/><path d="M574.659,83.667h19.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H574.659a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,574.659,83.667Z" fill="#c8d4e6"/><path d="M574.659,91.187h8.7a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-8.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,574.659,91.187Z" fill="#c8d4e6"/><path d="M574.659,76.147h19.129A1.652,1.652,0,0,1,595.44,77.8h0a1.652,1.652,0,0,1-1.652,1.652H574.659a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,574.659,76.147Z" fill="#c8d4e6"/><path d="M602.24,100.67V65.41L581.68,44.84H561.84a6.85,6.85,0,0,0-6.82,6.86L555,81h-7.24a3.594,3.594,0,0,0-3.59,3.59v9.07a3.594,3.594,0,0,0,3.59,3.59H555l-.01,9.29a6.841,6.841,0,0,0,6.82,6.85h33.64a6.841,6.841,0,0,0,6.82-6.85Zm-54.48-5.42a1.588,1.588,0,0,1-1.59-1.59V84.59A1.588,1.588,0,0,1,547.76,83h17.02a1.6,1.6,0,0,1,1.6,1.59v9.07a1.6,1.6,0,0,1-1.6,1.59Zm47.69,15.64H561.81a4.34,4.34,0,0,1-4.32-4.35l.01-9.29h7.28a3.6,3.6,0,0,0,3.6-3.59V84.59a3.6,3.6,0,0,0-3.6-3.59H557.5l.02-29.3a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v34.23l.03,5.87A4.34,4.34,0,0,1,595.45,110.89Z" fill="#c8d4e6"/><path d="M548.154,92.309v-6.4h1.968a3.08,3.08,0,0,1,1.185.222,2.681,2.681,0,0,1,.923.624,2.848,2.848,0,0,1,.6.965,3.455,3.455,0,0,1,.216,1.248v.29a3.463,3.463,0,0,1-.214,1.246,2.782,2.782,0,0,1-.6.962,2.691,2.691,0,0,1-.93.622,3.143,3.143,0,0,1-1.19.22Zm1.318-5.33V91.25h.638a1.429,1.429,0,0,0,1.19-.517,2.324,2.324,0,0,0,.409-1.474v-.3a2.324,2.324,0,0,0-.4-1.479,1.429,1.429,0,0,0-1.183-.5Z" fill="#c8d4e6"/><path d="M558.809,89.254a4.039,4.039,0,0,1-.2,1.316,2.822,2.822,0,0,1-.556.987,2.4,2.4,0,0,1-.858.622,2.914,2.914,0,0,1-2.207,0,2.473,2.473,0,0,1-.864-.622,2.868,2.868,0,0,1-.564-.987,3.983,3.983,0,0,1-.2-1.316v-.281a4.029,4.029,0,0,1,.2-1.314,2.885,2.885,0,0,1,.56-.993,2.424,2.424,0,0,1,.862-.626,2.9,2.9,0,0,1,2.205,0,2.42,2.42,0,0,1,.861.626,2.9,2.9,0,0,1,.561.993,4.029,4.029,0,0,1,.2,1.314Zm-1.336-.289a2.692,2.692,0,0,0-.36-1.529,1.271,1.271,0,0,0-2.057,0,2.692,2.692,0,0,0-.36,1.529v.289a3.734,3.734,0,0,0,.094.886,1.983,1.983,0,0,0,.273.646,1.193,1.193,0,0,0,.436.4,1.28,1.28,0,0,0,.594.133,1.159,1.159,0,0,0,1.024-.527,2.733,2.733,0,0,0,.356-1.534Z" fill="#c8d4e6"/><path d="M564.339,90.178a2.592,2.592,0,0,1-.219.9,2.084,2.084,0,0,1-.509.7,2.323,2.323,0,0,1-.789.457,3.124,3.124,0,0,1-1.057.165,2.757,2.757,0,0,1-1.105-.212,2.269,2.269,0,0,1-.832-.614,2.793,2.793,0,0,1-.522-.968,4.165,4.165,0,0,1-.183-1.278V88.9a4.059,4.059,0,0,1,.189-1.278,2.857,2.857,0,0,1,.534-.972,2.362,2.362,0,0,1,.837-.615,2.743,2.743,0,0,1,1.1-.215,3.066,3.066,0,0,1,1.056.169,2.273,2.273,0,0,1,.78.471,2.152,2.152,0,0,1,.5.716,3.027,3.027,0,0,1,.229.9h-1.318a2.028,2.028,0,0,0-.1-.505.99.99,0,0,0-.222-.369.9.9,0,0,0-.374-.227,1.75,1.75,0,0,0-.552-.077,1.12,1.12,0,0,0-1,.486,2.749,2.749,0,0,0-.327,1.506v.429a4.641,4.641,0,0,0,.073.871,1.837,1.837,0,0,0,.228.623,1,1,0,0,0,.4.376,1.318,1.318,0,0,0,.6.126,1.824,1.824,0,0,0,.538-.07.961.961,0,0,0,.378-.214.946.946,0,0,0,.234-.358,1.75,1.75,0,0,0,.106-.5Z" fill="#c8d4e6"/></g></g></svg><div class="a-no-content-txt">No folder available</div></div>',
                    bind: {
                        store: {
                            bindTo: '{folders}',
                            deep: true,
                        },
                    },
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        cls: 'a-bb-100',
                        flex: 1,
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'container',
                                flex: 1,
                                encodeHtml: false,
                                bind: {
                                    html: '<div style="cursor: pointer; display: flex; align-items: center; line-height:1;"><i class="material-icons">folders</i><span class="fw-b">{record.folder_name}</span></div>',
                                },
                            },
                            {
                                xtype: 'container',
                                cls: 'a-actions-hover',
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'md-icon-edit',
                                        ui: 'round tool-round-md',
                                        tooltip: {
                                            anchorToTarget: true,
                                            html: 'Edit',
                                            align: 'bc-tc?',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            allowOver: false,
                                            closeAction: 'destroy',
                                        },
                                        handler: function (btn) {
                                            let vm = btn.upVM(),
                                                record = btn.upVM().get('record'),
                                                dialog = Ext.create('Abraxa.view.adocs.CreateEditFolder', {
                                                    viewModel: {
                                                        parent: vm,
                                                        data: {
                                                            action: 'update',
                                                            record: record,
                                                        },
                                                    },
                                                });
                                            dialog.show();
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'md-icon-delete',
                                        ui: 'round tool-round-md',
                                        tooltip: {
                                            anchorToTarget: true,
                                            html: 'Delete',
                                            align: 'bc-tc?',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            allowOver: false,
                                            closeAction: 'destroy',
                                        },
                                        handler: function (item, el, eOpts) {
                                            var vm = this.upVM();
                                            let store = this.upVM().get('folders');
                                            var record = vm.get('record');
                                            Ext.Msg.confirm(
                                                'Confirmation',
                                                'Are you sure you want to delete this record?',
                                                function (answer) {
                                                    if (answer == 'yes') {
                                                        store.remove(record);
                                                        store.sync({
                                                            success: function (err, msg) {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                }
                                            );
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    listeners: {
                        // painted: function () {
                        //     this.select(0);
                        // },
                        select: function (me, selected) {
                            // if (selected) {
                            //     let type = selected.get('type');
                            //     let files = this.upVM().get('allFiles');
                            //     files.clearFilter();
                            //     files.addFilter({
                            //         property: "type",
                            //         operator: "=",
                            //         value: type,
                            //         exactMatch: true
                            //     });
                            // }
                        },
                    },
                },
                {
                    xtype: 'toolbar',
                    ui: 'toolbar-panel-bottom',
                    border: true,
                    docked: 'bottom',
                    padding: '0 8',
                    margin: 0,
                    scrollable: false,
                    flex: 1,
                    items: [
                        {
                            xtype: 'button',
                            text: 'Add folder',
                            iconCls: 'md-icon-add',
                            ui: 'confirm round raised btn-normal',
                            handler: function (btn) {
                                let vm = btn.upVM(),
                                    dialog = Ext.create('Abraxa.view.adocs.CreateEditFolder', {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                action: 'create',
                                                record: new Abraxa.model.adocs.DocumentFolder({
                                                    documentable_id: vm.get('object_record').get('id'),
                                                    documentable_type: vm.get('object_record').get('model_name'),
                                                }),
                                            },
                                        },
                                    });
                                dialog.show();
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            flex: 9,
            items: [
                {
                    xtype: 'dataview',
                    flex: 9,
                    minHeight: 400,
                    ui: 'docs',
                    itemConfig: {},
                    inline: true,
                    ripple: false,
                    padding: 16,
                    selectable: 'simple',
                    style: 'cursor: pointer',
                    emptyText:
                        '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-10234 -18910)"><g transform="translate(9400 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(9718.83 18893.16)"><path d="M580.64,51.64v14.8h14.8Z" fill="#c8d4e6"/><path d="M574.659,83.667h19.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H574.659a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,574.659,83.667Z" fill="#c8d4e6"/><path d="M574.659,91.187h8.7a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-8.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,574.659,91.187Z" fill="#c8d4e6"/><path d="M574.659,76.147h19.129A1.652,1.652,0,0,1,595.44,77.8h0a1.652,1.652,0,0,1-1.652,1.652H574.659a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,574.659,76.147Z" fill="#c8d4e6"/><path d="M602.24,100.67V65.41L581.68,44.84H561.84a6.85,6.85,0,0,0-6.82,6.86L555,81h-7.24a3.594,3.594,0,0,0-3.59,3.59v9.07a3.594,3.594,0,0,0,3.59,3.59H555l-.01,9.29a6.841,6.841,0,0,0,6.82,6.85h33.64a6.841,6.841,0,0,0,6.82-6.85Zm-54.48-5.42a1.588,1.588,0,0,1-1.59-1.59V84.59A1.588,1.588,0,0,1,547.76,83h17.02a1.6,1.6,0,0,1,1.6,1.59v9.07a1.6,1.6,0,0,1-1.6,1.59Zm47.69,15.64H561.81a4.34,4.34,0,0,1-4.32-4.35l.01-9.29h7.28a3.6,3.6,0,0,0,3.6-3.59V84.59a3.6,3.6,0,0,0-3.6-3.59H557.5l.02-29.3a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v34.23l.03,5.87A4.34,4.34,0,0,1,595.45,110.89Z" fill="#c8d4e6"/><path d="M548.154,92.309v-6.4h1.968a3.08,3.08,0,0,1,1.185.222,2.681,2.681,0,0,1,.923.624,2.848,2.848,0,0,1,.6.965,3.455,3.455,0,0,1,.216,1.248v.29a3.463,3.463,0,0,1-.214,1.246,2.782,2.782,0,0,1-.6.962,2.691,2.691,0,0,1-.93.622,3.143,3.143,0,0,1-1.19.22Zm1.318-5.33V91.25h.638a1.429,1.429,0,0,0,1.19-.517,2.324,2.324,0,0,0,.409-1.474v-.3a2.324,2.324,0,0,0-.4-1.479,1.429,1.429,0,0,0-1.183-.5Z" fill="#c8d4e6"/><path d="M558.809,89.254a4.039,4.039,0,0,1-.2,1.316,2.822,2.822,0,0,1-.556.987,2.4,2.4,0,0,1-.858.622,2.914,2.914,0,0,1-2.207,0,2.473,2.473,0,0,1-.864-.622,2.868,2.868,0,0,1-.564-.987,3.983,3.983,0,0,1-.2-1.316v-.281a4.029,4.029,0,0,1,.2-1.314,2.885,2.885,0,0,1,.56-.993,2.424,2.424,0,0,1,.862-.626,2.9,2.9,0,0,1,2.205,0,2.42,2.42,0,0,1,.861.626,2.9,2.9,0,0,1,.561.993,4.029,4.029,0,0,1,.2,1.314Zm-1.336-.289a2.692,2.692,0,0,0-.36-1.529,1.271,1.271,0,0,0-2.057,0,2.692,2.692,0,0,0-.36,1.529v.289a3.734,3.734,0,0,0,.094.886,1.983,1.983,0,0,0,.273.646,1.193,1.193,0,0,0,.436.4,1.28,1.28,0,0,0,.594.133,1.159,1.159,0,0,0,1.024-.527,2.733,2.733,0,0,0,.356-1.534Z" fill="#c8d4e6"/><path d="M564.339,90.178a2.592,2.592,0,0,1-.219.9,2.084,2.084,0,0,1-.509.7,2.323,2.323,0,0,1-.789.457,3.124,3.124,0,0,1-1.057.165,2.757,2.757,0,0,1-1.105-.212,2.269,2.269,0,0,1-.832-.614,2.793,2.793,0,0,1-.522-.968,4.165,4.165,0,0,1-.183-1.278V88.9a4.059,4.059,0,0,1,.189-1.278,2.857,2.857,0,0,1,.534-.972,2.362,2.362,0,0,1,.837-.615,2.743,2.743,0,0,1,1.1-.215,3.066,3.066,0,0,1,1.056.169,2.273,2.273,0,0,1,.78.471,2.152,2.152,0,0,1,.5.716,3.027,3.027,0,0,1,.229.9h-1.318a2.028,2.028,0,0,0-.1-.505.99.99,0,0,0-.222-.369.9.9,0,0,0-.374-.227,1.75,1.75,0,0,0-.552-.077,1.12,1.12,0,0,0-1,.486,2.749,2.749,0,0,0-.327,1.506v.429a4.641,4.641,0,0,0,.073.871,1.837,1.837,0,0,0,.228.623,1,1,0,0,0,.4.376,1.318,1.318,0,0,0,.6.126,1.824,1.824,0,0,0,.538-.07.961.961,0,0,0,.378-.214.946.946,0,0,0,.234-.358,1.75,1.75,0,0,0,.106-.5Z" fill="#c8d4e6"/></g></g></svg><div class="a-no-content-txt">No documents available</div></div>',
                    itemTpl: new Ext.XTemplate(
                        '<div oncontextmenu="return false;" class="dataview-multisort-item" data-id="{cargo_id}">' +
                            '<div class="file-icon-new file-icon-lg-new <tpl if="values.is_copy">copy</tpl>" data-type="{document_type}"></div>\n' +
                            '<div class="file-title">' +
                            '<a href="javascript:void(0)">{name_original}{[this.getExtension(values.extension)]}</a>' +
                            '</div>' +
                            '<tpl if="!values.is_copy">' +
                            '<div class="file-status status-{status}">{status}</div>' +
                            '</tpl>' +
                            '<tpl if="values.is_combined">' +
                            '<div class="file-badge"><i class="material-icons md-18"> link </i></div>' +
                            '</tpl>' +
                            '</div>',
                        {
                            getExtension: function (extension) {
                                return extension == 'bl' ? '' : '.' + extension;
                            },
                        }
                    ),
                    listeners: {
                        childdoubletap: function (element, location, eOpts) {
                            var me = this;
                            var vm = this.upVM();
                            var selectedFile = location.record;
                            if (selectedFile.get('parent_id')) {
                                selectedFile = vm.get('allFiles').findRecord('id', selectedFile.get('file_id'));
                            }
                            var is_copy = false;
                            if (selectedFile.get('is_copy')) {
                                is_copy = true;
                            }
                            if (selectedFile.get('extension') != 'bl') {
                                var data = {
                                    object_id: 3,
                                    object_meta_id: vm.get('routeParams'),
                                    file_id: selectedFile.get('id'),
                                    document_title: selectedFile.get('name_original'),
                                };
                                me.getController().previewFile(selectedFile, data);
                            } else {
                                var adocsPreview = Ext.create('Abraxa.view.adocs.QuickView', {
                                    viewModel: {
                                        data: {
                                            edit_mode: false,
                                            quick_view: true,
                                            object_id: 3,
                                            object_meta_id: vm.get('routeParams'),
                                            file_id: selectedFile.get('id'),
                                            document_title: '',
                                            allFiles: vm.get('allFiles'),
                                            document_type: selectedFile.get('document_type'),
                                            file: selectedFile,
                                            is_copy: is_copy,
                                        },
                                    },
                                });

                                var previewVM = adocsPreview.down('adocs-preview').getVM();
                                previewVM.get('pagesOriginal').setData(selectedFile.get('pages'));
                                adocsPreview.getVM().set('document_title', selectedFile.get('name_original'));
                                adocsPreview.show();
                                Ext.ComponentQuery.query('[cls~=a-file-bar]')[0].select(0);
                            }
                        },
                    },
                    bind: {
                        store: {
                            bindTo: '{documents}',
                        },
                    },
                },
            ],
        },
    ],
});
