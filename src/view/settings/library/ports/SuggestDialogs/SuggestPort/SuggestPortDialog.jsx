import '../SuggestController';
import './SuggestPortAdditional';
import './SuggestPortCoordinates';
import './SuggestPortFacilities';
import './SuggestPortGeneral';
import './SuggestPortHealth';
import './SuggestPortLDLocations';
import './SuggestPortPilotage';
import './SuggestPortRestrictions';
import './SuggestPortServices';
import './SuggestPortSupplies';

Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortDialog', {
    extend: 'Ext.Dialog',
    xtype: 'SuggestPortDialog',
    cls: 'a-dialog-fullscreen a-dialog-card-layout',
    scrollable: 'y',
    fullscreen: true,
    // closable: true,
    draggable: false,
    width: '100%',
    height: '100%',
    title: false,
    controller: 'suggests.controller',
    keyMapEnabled: true,
    //    keyMap: {
    //        scope: 'this',
    //        ESC: function () {
    //            let dialog = Ext.ComponentQuery.query('[xtype=SuggestPortDialog]')[0];
    //            Ext.Msg.confirm(
    //                'Confirmation',
    //                'Would you like to discard all changes?',
    //                function (answer) {
    //                    if (answer == 'yes') {
    //                        dialog.destroy();
    //                    }
    //                },
    //                this,
    //                [
    //                    {
    //                        xtype: 'button',
    //                        itemId: 'no',
    //                        margin: '0 8 0 0',
    //                        text: 'Cancel',
    //                    },
    //                    {
    //                        xtype: 'button',
    //                        itemId: 'yes',
    //                        enableToggle: true,
    //                        ui: 'action loading',
    //                        text: 'Discard',
    //                    },
    //                ]
    //            );
    //        },
    //    },
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
    items: [
        {
            xtype: 'div',
            cls: 'a-dialog-card-title a-dialog-has-icon',
            bind: {
                html: '{addEditPortTitle}',
            },
        },
        {
            xtype: 'formpanel',
            cls: 'a-dialog-card a-dialog-card-md',
            scrollable: 'y',
            padding: 0,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    minHeight: 64,
                    padding: '0 32',
                    items: [
                        {
                            xtype: 'title',
                            cls: 'fs-18',
                            title: 'Port information',
                        },
                        {
                            xtype: 'button',
                            ui: 'default small',
                            iconCls: 'md-icon-collapse-all',
                            text: 'Collapse all',
                            handler: function (me) {
                                let containers = Ext.ComponentQuery.query('[cls~=a-collapsible-trigger]');
                                if (me.getText() == 'Expand all') {
                                    me.setText('Collapse all');
                                    me.setIconCls('md-icon-collapse-all');
                                } else {
                                    me.setText('Expand all');
                                    me.setIconCls('md-icon-expand-all');
                                }
                                Ext.Array.each(containers, function (container) {
                                    container.el.dom.click();
                                });
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-dialog-card-body',
                    defaults: {
                        clearable: false,
                        labelAlign: 'top',
                        ui: 'classic field-lg',
                    },
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
                            xtype: 'textfield',
                            label: 'Port name',
                            labelAlign: 'top',
                            placeholder: 'Please type the port name',
                            cls: 'a-field-icon icon-port icon-rounded',
                            required: true,
                            name: 'Port name',
                            bind: {
                                value: '{record.meta_name}',
                            },
                            listeners: {
                                painted: function (me) {
                                    setTimeout(() => {
                                        me.focus();
                                    }, 300);
                                },
                            },
                        },
                        {
                            //General section
                            xtype: 'SuggestPortGeneral',
                        },
                        {
                            //Coordinates section
                            xtype: 'SuggestPortCoordinates',
                        },
                        {
                            //Additional Port information section
                            xtype: 'SuggestPortAdditional',
                        },
                        {
                            //Pilotage and Towage section
                            xtype: 'SuggestPortPilotage',
                        },
                        {
                            //Restrictions section
                            xtype: 'SuggestPortRestrictions',
                        },
                        {
                            //Health information section
                            xtype: 'SuggestPortHealth',
                        },
                        {
                            //Loading and Discharging Locations section
                            xtype: 'SuggestPortLDLocations',
                        },
                        {
                            //Facilities section
                            xtype: 'SuggestPortFacilities',
                        },
                        {
                            //Services section
                            xtype: 'SuggestPortServices',
                        },
                        {
                            //Supplies section
                            xtype: 'SuggestPortSupplies',
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
                cls: 'a-dialog-card-footer-inner a-dialog-card-footer-inner-md',
                layout: {
                    type: 'vbox',
                    align: 'end',
                    pack: 'space-between',
                },
                items: [
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
                                ui: 'action loading portSubmission',
                                text: 'Submit for preview',
                            },
                        ],
                    },
                ],
            },
        ],
    },
});
