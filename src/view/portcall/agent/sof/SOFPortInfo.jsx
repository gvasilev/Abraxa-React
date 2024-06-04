import './BunkersUnitCombo';
Ext.define('Abraxa.view.portcall.sof.SOFPortInfo', {
    extend: 'Ext.Container',
    xtype: 'sof.port.info',
    cls: 'a-bnc-main a-bnc-port',
    items: [
        {
            xtype: 'div',
            cls: 'sm-heading',
            html: '<div class="a-badge a-badge-master"><span>M</span></div><h5>Master information</h5>',
        },
        {
            xtype: 'container',
            cls: 'a-master-form overflow-y',
            bodyCls: 'chameleon_portcall_ops_general_master',
            items: [
                {
                    xtype: 'container',
                    slug: 'portcallMaster',
                    showNoPermissions: true,
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'overflow-y',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            defaults: {
                                labelAlign: 'left',
                                ui: 'classic',
                                flex: 1,
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Name',
                                    placeholder: 'Master name',
                                    clearable: false,
                                    slug: 'portcallMaster',
                                    ui: 'hovered-border classic',
                                    subObject: 'general',
                                    liveFieldId: 'master_name',
                                    bind: {
                                        cls: 'a-field-icon icon-short icon-rounded live-field',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        value: '{master.master_name}',
                                        readOnly: '{nonEditable ? true : false}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    listeners: {
                                        focusleave: function (me) {
                                            let store = this.upVM().get('masters');
                                            store.sync({
                                                success: function () {
                                                    let master = me.upVM().get('master'),
                                                        signatures = me.upVM().get('signatures');
                                                    if (master && master.get('master_name')) {
                                                        if (signatures) {
                                                            let masterSignature = signatures.findRecord(
                                                                'type',
                                                                'master',
                                                                0,
                                                                false,
                                                                false,
                                                                true
                                                            );
                                                            if (
                                                                masterSignature &&
                                                                !masterSignature.get('is_manual_edit')
                                                            ) {
                                                                masterSignature.set(
                                                                    'company_name',
                                                                    master.get('master_name')
                                                                );
                                                                masterSignature.save();
                                                            }
                                                        }
                                                    }
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        },
                                    },
                                },
                                {
                                    xtype: 'div',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'overflow-y',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            defaults: {
                                labelAlign: 'left',
                                ui: 'classic',
                                flex: 1,
                                listeners: {
                                    focusleave: function () {
                                        let store = this.upVM().get('masters');

                                        store.sync({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'emailfield',
                                    label: 'Email',
                                    validators: 'email',
                                    placeholder: 'master@example.com',
                                    slug: 'portcallMaster',
                                    clearable: false,
                                    ui: 'hovered-border classic',
                                    subObject: 'general',
                                    liveFieldId: 'master_email',
                                    bind: {
                                        cls: 'a-field-icon icon-email icon-rounded live-field',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        value: '{master.master_email}',
                                        readOnly: '{nonEditable ? true : false}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                },
                                {
                                    xtype: 'div',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'overflow-y',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            defaults: {
                                labelAlign: 'left',
                                ui: 'classic',
                                flex: 1,
                                listeners: {
                                    focusleave: function () {
                                        let store = this.upVM().get('masters');
                                        store.sync({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'abraxa.phonefield',
                                    label: 'Phone',
                                    slug: 'portcallMaster',
                                    clearable: false,
                                    ui: 'hovered-border classic',
                                    subObject: 'general',
                                    liveFieldId: 'master_phone',
                                    bind: {
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        cls: 'a-field-icon icon-phone icon-rounded live-field',
                                        value: '{master.master_phone}',
                                        readOnly: '{nonEditable ? true : false}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                },
                                {
                                    xtype: 'div',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            html: '<hr class="mt-16 mb-8">',
                        },
                        // {
                        // xtype: 'container',
                        // layout: {
                        //     type: 'hbox',
                        //     align: 'center'
                        // },
                        // defaults: {
                        //     labelAlign: 'left',
                        //     ui: 'classic',
                        //     flex: 1,
                        //     listeners: {
                        //         focusleave: function () {
                        //             let store = this.upVM().get('object_record').masters();

                        //             store.sync({
                        //                 success: function () {
                        //                     Ext.toast('Record updated', 1000);
                        //                 }
                        //             })
                        //         }
                        //     }
                        // },
                        // items: [{
                        //     xtype: 'abraxa.phonefield',
                        //     label: 'Phone',
                        //     cls: 'a-field-icon icon-email icon-rounded',
                        //     bind: {
                        //         ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                        //         value: '{master.master_phone}'
                        //     }
                        // }, {
                        //     xtype: 'abraxa.phonefield',
                        //     label: 'Phone',
                        //     cls: 'a-field-icon icon-email icon-rounded',
                        //     bind: {
                        //         ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                        //         value: '{master.master_phone_alt}'
                        //     }
                        // }]
                        // }
                    ],
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'sm-heading',
            html: '<div class="a-badge a-badge-anchor"><i class="md-icon-outlined">anchor</i></div><h5>Port information</h5>',
        },
        {
            xtype: 'container',
            cls: 'a-port-form overflow-y',
            bodyCls: 'chameleon_portcall_ops_general_port',
            items: [
                {
                    xtype: 'container',
                    showNoPermissions: true,
                    slug: 'portcallPortItinerary',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    defaults: {
                        labelAlign: 'left',
                        ui: 'classic',
                        slug: 'portcallPortItinerary',
                        bind: {
                            permission: '{userPermissions}',
                        },
                    },
                    items: [
                        {
                            xtype: 'port.combo',
                            cls: 'a-field-icon a-field-port icon-port icon-rounded',
                            label: '<i class="md-icon-outlined">trip_origin</i>Previous port',
                            placeholder: 'Enter previous port',
                            valueField: 'port_name',
                            displayField: 'port_name',
                            ui: 'hovered-border classic',
                            forceSelection: false,
                            subObject: 'general',
                            floatedPicker: {
                                listeners: {
                                    select: function () {
                                        let record = this.upVM().get('object_record'),
                                            port_id = this.getSelection().get('port_id');

                                        record.set('previous_port_id', port_id);
                                    },
                                },
                            },
                            bind: {
                                value: '{object_record.previous_port}',
                                inputValue: '{object_record.previous_port}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                objectPermission: '{objectPermissions}',
                                permission: '{userPermissions}',
                            },
                            listeners: {
                                painted: function (me) {
                                    if (me.upVM().get('object_record.previous_port')) {
                                        me.getStore().load({
                                            params: {
                                                query: me.upVM().get('object_record.previous_port'),
                                            },
                                            callback: function (records, operation, success) {
                                                // do something after the load finishes
                                            },
                                            scope: this,
                                        });
                                        me.setValue(me.upVM().get('object_record.previous_port'));
                                    }
                                },
                                clearicontap: function () {
                                    let record = this.upVM().get('object_record');
                                    record.set('previous_port_id', null);
                                },
                                blur: function () {
                                    let record = this.upVM().get('object_record');

                                    if (record.dirty) {
                                        record.save({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-spacer',
                        },
                        {
                            xtype: 'container',
                            cls: 'overflow-y',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            defaults: {
                                labelAlign: 'left',
                                ui: 'classic',
                            },
                            items: [
                                {
                                    xtype: 'ports.served.combo',
                                    cls: 'a-field-icon a-field-port a-current icon-port icon-rounded current_port_combo',
                                    label: '<i class="md-icon-outlined">trip_origin</i>Current port',
                                    placeholder: 'Enter current port',
                                    slug: 'portcallPortItinerary',
                                    ui: 'hovered-border classic',
                                    flex: 1,
                                    subObject: 'general',
                                    bind: {
                                        value: '{object_record.port_id}',
                                        inputValue: '{object_record.port_name}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    listeners: {
                                        select: function () {
                                            if (this.getSelection()) {
                                                let record = this.upVM().get('object_record');
                                                record.set('port_name', this.getSelection().get('port_name'));
                                                if (
                                                    this.getSelection().get('port') &&
                                                    this.getSelection().get('port').code
                                                ) {
                                                    record.set('port_code', this.getSelection().get('port').code);
                                                }
                                            }
                                        },
                                        painted: function () {
                                            let record = this.upVM().get('object_record');

                                            if (record) this.setInputValue(record.get('port_name'));
                                        },
                                        blur: function () {
                                            let record = this.upVM().get('object_record');

                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'container',
                                    padding: '0 0 0 116',
                                    hidden: true,
                                    flex: 1,
                                    layout: {
                                        type: 'hbox',
                                        pack: 'start',
                                    },
                                    items: [
                                        {
                                            xtype: 'checkbox',
                                            boxLabel: 'Pre-arrivals submitted',
                                            slug: 'portcallGeneralPreArrival',
                                            subObject: 'portcallPortItinerary',
                                            bind: {
                                                checked: '{object_record.pre_arrival_sent}',
                                                cls: '{nonEditable ? "hidden" : ""}',
                                                hidden: '{nonEditable && !object_record.pre_arrival_sent ? true : false}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                click: {
                                                    element: 'boxElement',
                                                    scope: this,
                                                    fn: function (a, b, c, d) {
                                                        a.event.preventDefault();
                                                        var cmp = Ext.get(a.getTarget()).component;
                                                        var componentIsChecked = cmp.isChecked();
                                                        if (componentIsChecked) {
                                                            cmp.uncheck();
                                                        } else {
                                                            cmp.check();
                                                        }

                                                        let record = cmp.upVM().get('object_record');

                                                        record.set('pre_arrival_sent', componentIsChecked);

                                                        record.save({
                                                            success: function () {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                        return false;
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
                            layout: 'hbox',
                            cls: 'overflow-y',
                            defaults: {
                                listeners: {
                                    blur: function () {
                                        let record = this.upVM().get('object_record');

                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-validation overflow-y',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.datetimefield',
                                            cls: 'a-field-icon icon-rounded live-field',
                                            labelAlign: 'left',
                                            ui: 'hovered-border classic',
                                            label: 'Arrival PS',
                                            slug: 'portcallPortItinerary',
                                            subObject: 'general',
                                            liveFieldId: 'arrival_ps',
                                            bind: {
                                                dateTime: '{object_record.arrival_ps}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                blur: function () {
                                                    let record = this.upVM().get('object_record');

                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function () {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-validation overflow-y',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.datetimefield',
                                            cls: 'a-field-icon icon-rounded live-field',
                                            labelAlign: 'left',
                                            ui: 'classic',
                                            label: 'Departure PS',
                                            slug: 'portcallPortItinerary',
                                            ui: 'hovered-border classic',
                                            subObject: 'general',
                                            liveFieldId: 'departure_ps',
                                            bind: {
                                                dateTime: '{object_record.departure_ps}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                blur: function () {
                                                    let record = this.upVM().get('object_record');

                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function () {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
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
                            layout: 'hbox',
                            cls: 'overflow-y',
                            defaults: {
                                listeners: {
                                    blur: function () {
                                        let record = this.upVM().get('object_record');

                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-validation overflow-y',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.datetimefield',
                                            cls: 'a-field-icon icon-rounded live-field',
                                            labelAlign: 'left',
                                            ui: 'hovered-border classic',
                                            itemId: 'ETAField',
                                            label: 'ETA',
                                            slug: 'portcallPortItinerary',
                                            subObject: 'general',
                                            liveFieldId: 'port_eta',
                                            bind: {
                                                dateTime: '{object_record.port_eta}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                // focusleave: function (me) {
                                                //     me.fireEvent('blur', me);
                                                // },
                                                blur: function (me) {
                                                    let record = me.upVM().get('object_record'),
                                                        eta = me.getValue(),
                                                        etd = me.find('ETDField'),
                                                        atd = me.find('ATDField');
                                                    // me.up('container').removeCls('is-invalid');
                                                    if (etd || atd) {
                                                        if (etd.getValue()) {
                                                            if (moment(eta).isSameOrAfter(etd.getValue())) {
                                                                me.clearValue();
                                                                me.up('container').addCls('is-invalid');
                                                            }
                                                        }
                                                        if (atd.getValue()) {
                                                            if (moment(eta).isSameOrAfter(atd.getValue())) {
                                                                me.clearValue();
                                                                me.up('container').addCls('is-invalid');
                                                            }
                                                        }
                                                    }
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function () {
                                                                me.up('container').removeCls('is-invalid');
                                                                Ext.toast('Record updated', 1000);
                                                                let url =
                                                                    Env.ApiEndpoint +
                                                                    'kpi/portcall-prospects/' +
                                                                    record.get('id');
                                                                Ext.ComponentQuery.query(
                                                                    '[itemId=prospectChart]'
                                                                )[0].setChartDataUrl(url, 'json');
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-info-icon',
                                            html: '<i class="md-icon-outlined md-18">info</i>',
                                            tooltip: {
                                                ui: 'info',
                                                html: 'Date & time cannot precede your previous event',
                                                maxWidth: 220,
                                                anchor: true,
                                                anchorToTarget: true,
                                                align: 'bc-tc?',
                                                closeAction: 'destroy',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-validation overflow-y',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.datetimefield',
                                            cls: 'a-field-icon icon-rounded live-field',
                                            labelAlign: 'left',
                                            ui: 'classic',
                                            label: 'ATA',
                                            itemId: 'ATAField',
                                            slug: 'portcallPortItinerary',
                                            ui: 'hovered-border classic',
                                            subObject: 'general',
                                            liveFieldId: 'port_ata',
                                            bind: {
                                                dateTime: '{object_record.port_ata}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                // focusleave: function (me) {
                                                //     me.fireEvent('blur', me);
                                                // },
                                                blur: function (me) {
                                                    let record = me.upVM().get('object_record'),
                                                        ata = me.getValue(),
                                                        etd = me.find('ETDField'),
                                                        atd = me.find('ATDField');
                                                    // me.up('container').removeCls('is-invalid');
                                                    if (etd || atd) {
                                                        if (etd.getValue()) {
                                                            if (moment(ata).isSameOrAfter(etd.getValue())) {
                                                                me.clearValue();
                                                                me.up('container').addCls('is-invalid');
                                                            }
                                                        }
                                                        if (atd.getValue()) {
                                                            if (moment(ata).isSameOrAfter(atd.getValue())) {
                                                                me.clearValue();
                                                                me.up('container').addCls('is-invalid');
                                                            }
                                                        }
                                                    }
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function () {
                                                                me.up('container').removeCls('is-invalid');
                                                                Ext.toast('Record updated', 1000);
                                                                let url =
                                                                    Env.ApiEndpoint +
                                                                    'kpi/portcall-prospects/' +
                                                                    record.get('id');
                                                                Ext.ComponentQuery.query(
                                                                    '[itemId=prospectChart]'
                                                                )[0].setChartDataUrl(url, 'json');
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-info-icon',
                                            html: '<i class="md-icon-outlined md-18">info</i>',
                                            tooltip: {
                                                ui: 'info',
                                                html: 'Date & time cannot precede your previous event',
                                                maxWidth: 220,
                                                anchor: true,
                                                anchorToTarget: true,
                                                align: 'bc-tc?',
                                                closeAction: 'destroy',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            cls: 'overflow-y',
                            defaults: {
                                listeners: {
                                    blur: function () {
                                        let record = this.upVM().get('object_record');

                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-validation overflow-y',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.datetimefield',
                                            cls: 'a-field-icon icon-rounded live-field',
                                            labelAlign: 'left',
                                            ui: 'hovered-border classic',
                                            label: 'ETD',
                                            itemId: 'ETDField',
                                            slug: 'portcallPortItinerary',
                                            subObject: 'general',
                                            liveFieldId: 'port_etd',
                                            bind: {
                                                dateTime: '{object_record.port_etd}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                // focusleave: function (me) {
                                                //     me.fireEvent('blur', me);
                                                // },
                                                blur: function (me) {
                                                    let record = me.upVM().get('object_record'),
                                                        etd = me.getValue(),
                                                        eta = me.find('ETAField'),
                                                        ata = me.find('ATAField');
                                                    // me.up('container').removeCls('is-invalid');
                                                    if (eta || ata) {
                                                        if (eta.getValue()) {
                                                            if (moment(etd).isSameOrBefore(eta.getValue())) {
                                                                me.clearValue();
                                                                me.up('container').addCls('is-invalid');
                                                            }
                                                        }
                                                        if (ata.getValue()) {
                                                            if (moment(etd).isSameOrBefore(ata.getValue())) {
                                                                me.clearValue();
                                                                me.up('container').addCls('is-invalid');
                                                            }
                                                        }
                                                    }
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function () {
                                                                me.up('container').removeCls('is-invalid');
                                                                Ext.toast('Record updated', 1000);
                                                                let url =
                                                                    Env.ApiEndpoint +
                                                                    'kpi/portcall-prospects/' +
                                                                    record.get('id');
                                                                Ext.ComponentQuery.query(
                                                                    '[itemId=prospectChart]'
                                                                )[0].setChartDataUrl(url, 'json');
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-info-icon',
                                            html: '<i class="md-icon-outlined md-18">info</i>',
                                            tooltip: {
                                                ui: 'info',
                                                html: 'Date & time cannot precede your previous event',
                                                maxWidth: 220,
                                                anchor: true,
                                                anchorToTarget: true,
                                                align: 'bc-tc?',
                                                closeAction: 'destroy',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-validation overflow-y',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.datetimefield',
                                            cls: 'a-field-icon icon-rounded live-field',
                                            labelAlign: 'left',
                                            ui: 'classic',
                                            label: 'ATD',
                                            itemId: 'ATDField',
                                            slug: 'portcallPortItinerary',
                                            ui: 'hovered-border classic',
                                            subObject: 'general',
                                            liveFieldId: 'port_atd',
                                            bind: {
                                                dateTime: '{object_record.port_atd}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                // focusleave: function (me) {
                                                //     me.fireEvent('blur', me);
                                                // },
                                                blur: function (me) {
                                                    let record = me.upVM().get('object_record'),
                                                        atd = me.getValue(),
                                                        eta = me.find('ETAField'),
                                                        ata = me.find('ATAField');
                                                    // me.up('container').removeCls('is-invalid');
                                                    if (eta || ata) {
                                                        if (eta.getValue()) {
                                                            if (moment(atd).isSameOrBefore(eta.getValue())) {
                                                                me.clearValue();
                                                                me.up('container').addCls('is-invalid');
                                                            }
                                                        }
                                                        if (ata) {
                                                            if (moment(atd).isSameOrBefore(ata.getValue())) {
                                                                me.clearValue();
                                                                me.up('container').addCls('is-invalid');
                                                            }
                                                        }
                                                    }
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function () {
                                                                me.up('container').removeCls('is-invalid');
                                                                Ext.toast('Record updated', 1000);
                                                                let url =
                                                                    Env.ApiEndpoint +
                                                                    'kpi/portcall-prospects/' +
                                                                    record.get('id');
                                                                Ext.ComponentQuery.query(
                                                                    '[itemId=prospectChart]'
                                                                )[0].setChartDataUrl(url, 'json');
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-info-icon',
                                            html: '<i class="md-icon-outlined md-18">info</i>',
                                            tooltip: {
                                                ui: 'info',
                                                html: 'Date & time cannot precede your previous event',
                                                maxWidth: 220,
                                                anchor: true,
                                                anchorToTarget: true,
                                                align: 'bc-tc?',
                                                closeAction: 'destroy',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'a-spacer',
                        },
                        {
                            xtype: 'container',
                            margin: '-8 0 0 132',
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'ml-12',
                                    html: '<h5 class="mb-0">Itinerary</h5>',
                                },
                                {
                                    xtype: 'container',
                                    margin: '0 4 16 4',
                                    cls: 'overflow-y',
                                    items: [
                                        {
                                            xtype: 'textareafield',
                                            // maxHeight: '68',
                                            cls: 'live-field',
                                            scrollable: true,
                                            minHeight: 42,
                                            slug: 'portcallPortItinerary',
                                            subObject: 'general',
                                            ui: 'hovered-border classic',
                                            placeholder: 'Enter remarks',
                                            liveFieldId: 'itinerary',
                                            bind: {
                                                value: '{object_record.itinerary}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                focusleave: function () {
                                                    let record = this.upVM().get('object_record');

                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function () {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                                change: function () {
                                                    if (this.initialConfig.height) return;
                                                    if (!this.inputElement.dom.style.overflow)
                                                        this.inputElement.dom.style.overflow = 'hidden';
                                                    this.setHeight(1);
                                                    var reqHeight = this.inputElement.dom.scrollHeight;
                                                    this.setHeight(reqHeight + 2);
                                                    return;
                                                },
                                                painted: function () {
                                                    if (this.initialConfig.height) return;
                                                    if (!this.inputElement.dom.style.overflow)
                                                        this.inputElement.dom.style.overflow = 'hidden';
                                                    this.setHeight(1);
                                                    var reqHeight = this.inputElement.dom.scrollHeight;
                                                    this.setHeight(reqHeight + 2);
                                                    return;
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'port.combo',
                            cls: 'a-field-icon a-field-port icon-port icon-rounded',
                            label: '<i class="md-icon-outlined">trip_origin</i>Next port',
                            placeholder: 'Enter next port',
                            valueField: 'port_name',
                            displayField: 'port_name',
                            forceSelection: false,
                            slug: 'portcallPortItinerary',
                            ui: 'hovered-border classic',
                            subObject: 'general',
                            // liveFieldId: 'next_port',
                            floatedPicker: {
                                listeners: {
                                    select: function () {
                                        let record = this.upVM().get('object_record'),
                                            port_id = this.getSelection().get('port_id');

                                        record.set('next_port_id', port_id);
                                    },
                                },
                            },
                            bind: {
                                value: '{object_record.next_port}',
                                inputValue: '{object_record.next_port}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            listeners: {
                                painted: function (me) {
                                    if (me.upVM().get('object_record.next_port')) {
                                        me.getStore().load({
                                            params: {
                                                query: me.upVM().get('object_record.next_port'),
                                            },
                                            callback: function (records, operation, success) {
                                                // do something after the load finishes
                                            },
                                            scope: this,
                                        });
                                        me.setValue(me.upVM().get('object_record.next_port'));
                                    }
                                },
                                clearicontap: function () {
                                    let record = this.upVM().get('object_record');
                                    record.set('next_port_id', null);
                                },
                                blur: function () {
                                    let record = this.upVM().get('object_record');

                                    if (record.dirty) {
                                        record.save({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            cls: 'overflow-y',
                            items: [
                                {
                                    xtype: 'abraxa.datetimefield',
                                    cls: 'a-field-icon icon-rounded live-field',
                                    labelAlign: 'left',
                                    ui: 'hovered-border classic',
                                    label: 'ETA',
                                    slug: 'portcallPortItinerary',
                                    subObject: 'general',
                                    liveFieldId: 'next_port_eta',
                                    bind: {
                                        dateTime: '{object_record.next_port_eta}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    listeners: {
                                        focusleave: function () {
                                            let record = this.upVM().get('object_record');

                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        let url =
                                                            Env.ApiEndpoint +
                                                            'kpi/portcall-prospects/' +
                                                            record.get('id');
                                                        Ext.ComponentQuery.query(
                                                            '[itemId=prospectChart]'
                                                        )[0].setChartDataUrl(url, 'json');
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'div',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            html: '<hr class="mt-16 mb-8">',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            maxWidth: 908,
            items: [
                {
                    xtype: 'div',
                    cls: 'sm-heading',
                    html: '<div class="a-badge a-badge-arrival-departure"><i class="md-icon-outlined">sync_alt</i></div><h5>Arrival & Departure conditions</h5>',
                },
                // {
                //     xtype: 'button',
                //     right: 0,
                //     ui: 'normal small',
                //     bind: {
                //         text: '{showSuppliedBunkers ? "Hide supplied" : "Show supplied"}'
                //     },
                //     handler: function () {
                //         let showSupplied = this.upVM().get('showSuppliedBunkers');

                //         if (showSupplied) {
                //             this.upVM().set('showSuppliedBunkers', false);
                //         } else {
                //             this.upVM().set('showSuppliedBunkers', true);
                //         }
                //     }
                // }
            ],
        },
        {
            xtype: 'container',
            cls: 'a-port-conditions',
            items: [
                {
                    xtype: 'container',
                    showNoPermissions: true,
                    slug: 'portcallBunkers',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    bodyCls: 'chameleon_portcall_ops_general_conditions',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-header',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'div',
                                    margin: '0 16 0 0',
                                    flex: 1,
                                    html: 'Item',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'on-arrival',
                                    flex: 1,
                                    html: 'On arrival',
                                },
                                {
                                    xtype: 'div',
                                    width: 16,
                                },
                                {
                                    xtype: 'div',
                                    // hidden: true,
                                    // bind: {
                                    //     hidden: '{!showSuppliedBunkers}'
                                    // },
                                    flex: 1,
                                    html: 'Supplied',
                                },
                                {
                                    xtype: 'div',
                                    // hidden: true,
                                    // bind: {
                                    //     hidden: '{!showSuppliedBunkers}'
                                    // },
                                    width: 16,
                                },
                                {
                                    xtype: 'div',
                                    cls: 'on-departure',
                                    flex: 1,
                                    html: 'On departure',
                                },
                                {
                                    xtype: 'div',
                                    width: 30,
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.formlist',
                            bind: {
                                store: '{bunkers}',
                            },
                            itemConfig: {
                                viewModel: {},
                                xtype: 'container',
                                cls: 'a-port-condition-item',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'default.expense.items.combo',
                                        margin: '0 16 0 0',
                                        flex: 1,
                                        cls: 'a-field-icon icon-supplies icon-rounded',
                                        ui: 'hovered-border classic',
                                        placeholder: 'Choose item',
                                        slug: 'portcallBunkers',
                                        label: false,
                                        subObject: 'general',
                                        bind: {
                                            value: '{record.default_fuel_types_id}',
                                            readOnly: '{nonEditable ? true : false}',
                                            ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                            permission: '{userPermissions}',
                                            objectPermission: '{objectPermissions}',
                                            store: '{defaultBunkers}',
                                        },
                                        listeners: {
                                            blur: function () {
                                                let store = this.upVM().get('bunkers');

                                                store.sync({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        layout: 'hbox',
                                        defaults: {
                                            ui: 'hovered-border classic',
                                            listeners: {
                                                blur: function () {
                                                    let store = this.upVM().get('bunkers');

                                                    store.sync({
                                                        success: function () {
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                },
                                            },
                                        },
                                        items: [
                                            {
                                                xtype: 'numberfield',
                                                cls: 'a-prepend',
                                                label: false,
                                                placeholder: '00.00',
                                                clearable: false,
                                                slug: 'portcallBunkers',
                                                ui: 'hovered-border classic',
                                                subObject: 'general',
                                                bind: {
                                                    value: '{record.arrival_quantity}',
                                                    readOnly: '{nonEditable ? true : false}',
                                                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                    permission: '{userPermissions}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                            },
                                            {
                                                xtype: 'bunkers.unitcombo',
                                                cls: 'a-append',
                                                placeholder: 'mts',
                                                slug: 'portcallBunkers',
                                                label: false,
                                                ui: 'hovered-border classic',
                                                subObject: 'general',
                                                bind: {
                                                    value: '{record.arrival_unit}',
                                                    readOnly: '{nonEditable ? true : false}',
                                                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                    permission: '{userPermissions}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'div',
                                        width: 16,
                                        // bind: {
                                        //     hidden: '{!showSuppliedBunkers}'
                                        // },
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        layout: 'hbox',
                                        // hidden: true,
                                        // bind: {
                                        //     hidden: '{!showSuppliedBunkers}'
                                        // },
                                        defaults: {
                                            ui: 'hovered-border classic',
                                            listeners: {
                                                blur: function () {
                                                    let store = this.upVM().get('bunkers');

                                                    store.sync({
                                                        success: function () {
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                },
                                            },
                                        },
                                        items: [
                                            {
                                                xtype: 'numberfield',
                                                cls: 'a-prepend',
                                                label: false,
                                                placeholder: '00.00',
                                                clearable: false,
                                                slug: 'portcallBunkers',
                                                subObject: 'general',
                                                bind: {
                                                    value: '{record.supplied_quantity}',
                                                    readOnly: '{nonEditable ? true : false}',
                                                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                    permission: '{userPermissions}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                            },
                                            {
                                                xtype: 'bunkers.unitcombo',
                                                cls: 'a-append',
                                                placeholder: 'mts',
                                                label: false,
                                                slug: 'portcallBunkers',
                                                subObject: 'general',
                                                bind: {
                                                    value: '{record.supplied_unit}',
                                                    readOnly: '{nonEditable ? true : false}',
                                                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                    permission: '{userPermissions}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'div',
                                        width: 16,
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        layout: 'hbox',
                                        defaults: {
                                            ui: 'hovered-border classic',
                                            listeners: {
                                                blur: function () {
                                                    let store = this.upVM().get('bunkers');

                                                    store.sync({
                                                        success: function () {
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                },
                                            },
                                        },
                                        items: [
                                            {
                                                xtype: 'numberfield',
                                                cls: 'a-prepend',
                                                label: false,
                                                placeholder: '00.00',
                                                clearable: false,
                                                slug: 'portcallBunkers',
                                                subObject: 'general',
                                                bind: {
                                                    value: '{record.departure_quantity}',
                                                    readOnly: '{nonEditable ? true : false}',
                                                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                    permission: '{userPermissions}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                            },
                                            {
                                                xtype: 'bunkers.unitcombo',
                                                cls: 'a-append',
                                                placeholder: 'mts',
                                                label: false,
                                                slug: 'portcallBunkers',
                                                subObject: 'general',
                                                bind: {
                                                    value: '{record.departure_unit}',
                                                    readOnly: '{nonEditable ? true : false}',
                                                    ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                    permission: '{userPermissions}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'container',
                                        width: 30,
                                        slug: 'portcallBunkers',
                                        bind: {
                                            hidden: '{nonEditable ? true : false}',
                                            permission: '{userPermissions}',
                                        },
                                        layout: {
                                            type: 'hbox',
                                            align: 'center',
                                            pack: 'end',
                                        },
                                        items: [
                                            {
                                                xtype: 'button',
                                                ui: 'tool-sm round',
                                                iconCls: 'md-icon-remove-circle-outline',
                                                slug: 'portcallBunkers',
                                                bind: {
                                                    cls: '{nonEditable ? "hidden" : ""}',
                                                    permission: '{userPermissions}',
                                                },
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    html: 'Remove',
                                                    align: 'bc-tc?',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    allowOver: false,
                                                    closeAction: 'destroy',
                                                },
                                                handler: function () {
                                                    let store = this.upVM().get('bunkers'),
                                                        record = this.upVM().get('record');

                                                    store.remove(record);

                                                    if (!record.phantom) {
                                                        store.sync({
                                                            success: function () {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-draft-container',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            defaults: {
                                defaults: {
                                    ui: 'hovered-border classic',
                                    clearable: false,
                                    placeholder: '00.00',
                                    listeners: {
                                        blur: function () {
                                            let portCall = this.upVM().get('object_record');
                                            if (portCall.dirty) {
                                                portCall.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Drafts Fwd/Aft',
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-draft-on-arrival',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            cls: 'a-prepend',
                                            label: false,
                                            bind: {
                                                value: '{object_record.fore_draft_arrival}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'numberfield',
                                            cls: 'a-append',
                                            label: false,
                                            bind: {
                                                value: '{object_record.aft_draft_arrival}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'combobox',
                                            options: ['m', 'dm', 'cm'],
                                            placeholder: AbraxaConstants.placeholders.emptyValue,
                                            bind: {
                                                value: '{object_record.arrival_draft_unit}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'div',
                                    flex: 1,
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-draft-on-departure',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            cls: 'a-prepend',
                                            label: false,
                                            bind: {
                                                value: '{object_record.fore_draft_departure}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'numberfield',
                                            cls: 'a-append',
                                            label: false,
                                            bind: {
                                                value: '{object_record.aft_draft_departure}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'combobox',
                                            options: ['m', 'dm', 'cm'],
                                            placeholder: AbraxaConstants.placeholders.emptyValue,
                                            bind: {
                                                value: '{object_record.departure_draft_unit}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'button',
                            margin: '8 0 0 0',
                            text: 'Item',
                            ui: 'normal small',
                            height: 28,
                            iconCls: 'md-icon-add',
                            slug: 'portcallBunkers',
                            subObject: 'general',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            handler: function () {
                                let store = this.upVM().get('bunkers'),
                                    vm = this.upVM();

                                store.add({
                                    portcall_id: vm.get('object_record').get('id'),
                                });
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
