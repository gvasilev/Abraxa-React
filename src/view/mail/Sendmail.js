Ext.define('Abraxa.view.mail.Sendmail', {
    extend: 'Ext.Dialog',
    xtype: 'sendmail',
    title: 'Mail',
    id: 'sendmail-popup',
    // ui: 'type3',
    controller: 'sendmail-controller',
    manageBorders: false,
    header: false,
    height: '94%',
    maxWidth: '64%',
    minWidth: 1200,
    // minWidth: '64%',
    hideMode: 'display',
    cls: 'a-mail sendmail-popup',
    scrollable: true,
    tools: {
        close: {
            tooltip: {
                anchorToTarget: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    },
    draggable: false,
    maximizable: false,
    padding: 0,
    margin: 0,
    flex: 1,
    maximized: false,
    reference: 'mailPopup',
    publishes: 'maximized',
    layout: {
        type: 'hbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-mail-left-panel',
            tools: {
                xtype: 'segmentedbutton',
                ui: 'segmented',
                items: [
                    {
                        text: 'Sent',
                        pressed: true,
                    },
                    {
                        text: 'Draft',
                    },
                ],
            },
            // scrollable: true,
            bind: {
                width: '{mailPopup.maximized ? 420 : 350}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-header',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            margin: 16,
                            html: '<div class="a-obj-logo a-logo-amail"><i class="material-icons-outlined md-24 c-white">send</i></div>',
                        },
                        {
                            xtype: 'div',
                            cls: 'a-title',
                            html: 'Reporting',
                        },
                    ],
                },
                {
                    xttype: 'container',
                    cls: 'a-subheader',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-title',
                            html: 'Sent messages',
                        },
                        // {
                        //     xtype: 'button',
                        //     iconCls: 'md-icon-filter-list',
                        //     cls: 'non-editable',
                        //     ui: 'tool-md toggle round',
                        //     enableToggler: true,
                        //     id: 'buttonTest',
                        //     tooltip: {
                        //         anchorToTarget: true,
                        //         align: 'bc-tc?',
                        //         html: 'Filter',
                        //         showDelay: 0,
                        //         hideDelay: 0,
                        //         dismissDelay: 0,
                        //         closeAction: 'destroy'
                        //     },
                        // },
                    ],
                },
                {
                    xtype: 'mail-list',
                },
                {
                    xtype: 'container',
                    cls: 'a-distribution-groups',
                    height: 'calc(40% - 132px)',
                    // scrollable: true,
                    layout: 'vbox',
                    bind: {
                        hidden: '{object_id == 6 ? true:false}',
                    },
                    flex: 1,
                    items: [
                        {
                            xtype: 'div',
                            cls: 'sm-heading',
                            html: '<h5>Distribution Groups</h5><i class="md-icon md-icon-outlined md-17">help_outline</i>',
                        },
                        {
                            xtype: 'mail.distribution.groups',
                            flex: 1,
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: 16,
                    docked: 'bottom',
                    bind: {
                        hidden: '{object_id == 6 ? true:false}',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-add',
                            ui: 'normal small',
                            text: 'Add group',
                            slug: 'portcallReportAddDistributionGroup',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let object_record = me.upVM().get('object_record');
                                Ext.create('Abraxa.view.mail.AddEditDistributionGroup', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            title: 'Create distribution group',
                                            editMode: false,
                                            fromPortcall: false,
                                            record: Ext.create('Abraxa.model.distributionGroup.DistributionGroup', {
                                                distributable_type: object_record.get('model_name'),
                                                distributable_id: object_record.get('id'),
                                                dist_emails: null,
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
        {
            xtype: 'sendmail-editor',
            flex: 9,
            showAnimation: {
                type: 'fadeIn',
            },
            style: 'border-radius: 0',
        },
        {
            xtype: 'mail-preview',
            cls: 'a-mail-preview',
            flex: 9,
            hidden: true,
            showAnimation: 'fadeIn',
        },
    ],
    listeners: {
        destroy: function (me) {
            let offerView = Ext.ComponentQuery.query('[itemId=offer-mainlayout]');
            if (offerView.length > 0) {
                let vm = offerView[0].getVM();
                let mailData = vm.get('mailData');
                if (mailData) {
                    mailData.reload();
                }
            }
        },
    },
});
