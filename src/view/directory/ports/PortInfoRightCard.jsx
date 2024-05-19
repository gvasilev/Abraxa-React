Ext.define('Abraxa.view.directory.ports.PortInfoRightCard', {
    extend: 'Ext.Container',
    xtype: 'PortInfoRightCard',
    cls: 'a-right-container a-right-container-full',
    hidden: true,
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch', //this is needed to stretch grids in sections
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-directory-inner-container a-port-details-container',
            layout: 'vbox',
            flex: 1,
            items: [
                // Port details header
                {
                    xtype: 'container',
                    cls: 'a-port-details-header',
                    docked: 'top',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-header-title-bar',
                            flex: 1,
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'tool',
                                    iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                                    margin: '0 16 0 0',
                                    ui: 'tool-lg',
                                    handler: function (me) {
                                        me.upVM().set('subTabId', null);
                                        window.history.back();
                                        //clear subTabId in viewmodel
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    bind: {
                                        html: '<div class="a-header-title">{selectedRecord.name}</div><span class="a-status-badge a-status-md {badgeString === "terminal" ? "bg-light-purple":"bg-light-yellow" }">{badgeString:capitalize}</span>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container', // terminal header container
                            cls: 'a-header-info-bar',
                            hidden: false,
                            bind: {
                                hidden: '{badgeString === "terminal" ? false:true}',
                            },
                            layout: {
                                type: 'hbox',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Type</div><div class="a-header-info-value">{selectedRecord.type ? selectedRecord.type:"<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">ISPS code</div><div class="a-header-info-value">{selectedRecord.isps_code ? selectedRecord.isps_code:"<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Port</div><div class="a-header-info-value c-blue cursor-pointer">{object_record.name ? object_record.name:"<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: '.cursor-pointer',
                                            fn: function () {
                                                Ext.getCmp('main-viewport')
                                                    .getController()
                                                    .redirectTo(
                                                        'port-info/' + this.component.upVM().get('object_record.id')
                                                    );
                                            },
                                        },
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Country</div><div class="a-header-info-value">{object_record.country ? object_record.country:"<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Working time</div><div class="a-header-info-value">{selectedRecord.info_work_hours ? selectedRecord.info_work_hours.start:"<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container', // berth header container
                            cls: 'a-header-info-bar',
                            hidden: false,
                            bind: {
                                hidden: '{badgeString === "berth" ? false:true}',
                            },
                            layout: {
                                type: 'hbox',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Berth IMO</div><div class="a-header-info-value">{selectedRecord.name ? selectedRecord.name : "<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Terminal</div><div class="a-header-info-value c-blue cursor-pointer">{selectedRecord.terminal_name ? selectedRecord.terminal_name : "<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: '.cursor-pointer',
                                            fn: function () {
                                                Ext.getCmp('main-viewport')
                                                    .getController()
                                                    .redirectTo(
                                                        'port-info/' + this.component.upVM().get('object_record.id')
                                                    );
                                            },
                                        },
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Port</div><div class="a-header-info-value c-blue cursor-pointer">{object_record.name ? object_record.name:"<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: '.cursor-pointer',
                                            fn: function () {
                                                Ext.getCmp('main-viewport')
                                                    .getController()
                                                    .redirectTo(
                                                        'port-info/' + this.component.upVM().get('object_record.id')
                                                    );
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                // Port details body
                {
                    xtype: 'container',
                    cls: 'a-port-details-body',
                    flex: 1,
                    layout: 'vbox',
                    scrollable: true,
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-directory-inner-wrapper right_card_content', //this class is needed to get container and clear items when selections is changed
                            layout: 'vbox',
                            // flex: 1,
                            bind: {
                                items: '{selectionContent}',
                            },
                        },
                    ],
                },
                {
                    // Port details footer
                    xtype: 'container',
                    cls: 'a-port-details-footer',
                    docked: 'bottom',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            hidden: false,
                            bind: {
                                hidden: '{badgeString === "terminal" ? false:true}', //terminals tab
                                html: '<span class="text-info">Last terminal updated:</span> {selectedRecord.updated_at ? (selectedRecord.updated_at:date("d M y")) : "<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                        {
                            xtype: 'div',
                            hidden: false,
                            bind: {
                                hidden: '{badgeString === "berth" ? false:true}', //berths tab
                                html: '<span class="text-info">Last berth updated:</span> {selectedRecord.updated_at ? (selectedRecord.updated_at:date("d M y")) : "<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
