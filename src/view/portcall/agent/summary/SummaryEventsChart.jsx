Ext.define('Abraxa.view.portcall.summary.SummaryEventsChart', {
    extend: 'Ext.Container',
    xtype: 'portcall.summary.events.chart',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    items: [
        {
            xtype: 'container',
            flex: 1,
            bind: {
                cls: 'a-timeline-overview chameleon_portcall_overview_timeline {object_record.port_ata || sortedEvents.length ? "has-events" : ""}',
            },
            layout: 'vbox',
            items: [
                {
                    xtype: 'div',
                    cls: 'a-port a-previous',
                    bind: {
                        hidden: '{object_record.port_ata || sortedEvents.length ? true : false}',
                        html: '<div class="a-name"><a href="javascript:void(0);">{object_record.previous_port ? object_record.previous_port : "N/A"}</a></div><div class="sm-title">Previous port</div><i class="md-icon-outlined">trip_origin</i>',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a',
                            fn: function (el) {
                                let me = this,
                                    cmp = me.component,
                                    portId = cmp.upVM().get('object_record').get('previous_port_id');
                                if (portId) {
                                    Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .showPortDialogById(portId);
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-port a-current',
                    bind: {
                        html: '<div class="a-name"><a href="javascript:void(0);">{object_record.port_name}</a></div><div class="a-eta">{etaOrAta}</div><i class="md-icon-outlined">trip_origin</i>',
                        hidden: '{object_record.port_ata || sortedEvents.length ? false : true}',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a',
                            fn: function (el) {
                                let me = this,
                                    cmp = me.component,
                                    portId = cmp.upVM().get('object_record').get('port_id');
                                if (portId) {
                                    Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .showPortDialogById(portId);
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-port a-current',
                    bind: {
                        html: '<div class="a-dotted-line"></div><i class="md-icon-outlined">trip_origin</i><div class="a-name"><a href="javascript:void(0);">{object_record.port_name}</a></div><div class="a-eta">{etaOrAta}</div><div class="a-eta">{firstEtb}</div><div class="a-eta">{etdOrAtd}</div><div class="a-countdown">{countdown}</div>',
                        hidden: '{object_record.port_ata || sortedEvents.length ? true : false}',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a',
                            fn: function (el) {
                                let me = this,
                                    cmp = me.component,
                                    porstsServed = cmp.upVM().get('portsServed'),
                                    portId = cmp.upVM().get('object_record').get('port_id');
                                if (portId) {
                                    Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .showPortDialogById(portId);
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'container',
                    layout: 'vbox',
                    flex: 1,
                    bind: {
                        cls: 'a-events {object_record.port_atd ? "a-sailed" : ""}',
                    },
                    items: [
                        {
                            xtype: 'abraxa.formlist',
                            // xtype: 'container',
                            // height: '66%',
                            variableHeights: true,
                            // flex: 1,
                            cls: 'a-events-progress',
                            layout: {
                                type: 'vbox',
                                align: 'stretch',
                            },
                            bind: {
                                store: '{sortedEvents}',
                            },
                            itemConfig: {
                                viewModel: {
                                    formulas: {
                                        berth_info: {
                                            bind: {
                                                bindTo: '{object_record}',
                                                deep: true,
                                            },
                                            get: function (data) {
                                                if (data && this.get('object_id') == 3) {
                                                    let cargo_ops = this.get('object_record.cargo_ops'),
                                                        berth_info = {},
                                                        berths = this.get('object_record').berths(),
                                                        berth = berths.getById(this.get('record').get('berth_id')),
                                                        cargoes = [];
                                                    berth_info.berth = berth;

                                                    if (berth) {
                                                        let prospects = {
                                                                etb: '<b>ETB:</b> ---',
                                                                etc: '<b>ETC:</b> ---',
                                                                etd: '<b>ETD:</b> ---',
                                                            },
                                                            berthCargoes = data
                                                                .getNomination()
                                                                .cargoes()
                                                                .queryBy(function (cargo) {
                                                                    return cargo.get('berth_id') == berth.get('id');
                                                                }).items;

                                                        if (berth.get('etb')) {
                                                            prospects.etb =
                                                                '<b>ETB:</b> ' +
                                                                moment(berth.get('etb')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }
                                                        if (berth.get('berthed')) {
                                                            prospects.etb =
                                                                '<b>Berthed:</b> ' +
                                                                moment(berth.get('berthed')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }
                                                        if (berth.get('etc')) {
                                                            prospects.etc =
                                                                '<b>ETC:</b> ' +
                                                                moment(berth.get('etc')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }
                                                        if (berth.get('completed')) {
                                                            prospects.etc =
                                                                '<b>Completed:</b> ' +
                                                                moment(berth.get('completed')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }
                                                        if (berth.get('etd')) {
                                                            prospects.etd =
                                                                '<b>ETD:</b> ' +
                                                                moment(berth.get('etd')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }
                                                        if (berth.get('departed')) {
                                                            prospects.etd =
                                                                '<b>Departed:</b> ' +
                                                                moment(berth.get('departed')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }

                                                        berth_info.prospects = prospects;

                                                        if (berthCargoes.length) {
                                                            Ext.Array.each(berthCargoes, function (cargo) {
                                                                let handled = 0,
                                                                    percentage = 0;

                                                                cargo_ops.each(function (operation) {
                                                                    if (operation.get('cargo_id') == cargo.get('id'))
                                                                        handled += parseInt(operation.get('handled'));
                                                                });

                                                                (percentage =
                                                                    (100 * (handled ? parseInt(handled) : 0)) /
                                                                    parseInt(cargo.get('quantity'))),
                                                                    (cargo_function =
                                                                        cargo.get('function') == 'Loading'
                                                                            ? 'Loaded'
                                                                            : 'Discharged'),
                                                                    (quantity = numeral(cargo.get('quantity')).format(
                                                                        '0,0.[000]'
                                                                    ));

                                                                cargoes.push(
                                                                    '<div class="a-cargo"><a href="javascript:void(0);" class="commodity_dialog" data-id="' +
                                                                        cargo.get('commodity_id') +
                                                                        '"><b>' +
                                                                        quantity +
                                                                        '</b> ' +
                                                                        cargo.get('unit') +
                                                                        ' - ' +
                                                                        cargo.get('commodity') +
                                                                        '</a><div><b>' +
                                                                        cargo_function +
                                                                        '</b> - ' +
                                                                        percentage.toFixed(0) +
                                                                        '%</div></div>'
                                                                );
                                                            });
                                                        } else {
                                                            if (berth.get('function')) {
                                                                cargoes.push(
                                                                    '<div class="a-function function-' +
                                                                        berth.get('function') +
                                                                        '"><span>' +
                                                                        berth.get('function') +
                                                                        '</span></div>'
                                                                );
                                                            } else {
                                                                cargoes.push(
                                                                    '<div class="a-function function-none"><span>No function</span></div>'
                                                                );
                                                            }
                                                        }
                                                    }

                                                    berth_info.cargoes = cargoes.join('');
                                                    return berth_info;
                                                }
                                            },
                                        },
                                    },
                                },
                                xtype: 'container',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch',
                                },
                                // flex: 1,
                                items: [
                                    {
                                        xtype: 'container',
                                        html: '<i></i>',
                                        height: 64,
                                        style: 'max-height: 64px !important',
                                        maxHeight: 64,
                                        bind: {
                                            hidden: '{record.berth_id ? false : true}',
                                            cls: 'a-event a-berth {berth_info.berth.is_current ? "a-current" : ""}',
                                        },
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'a-berth-tooltip',
                                                bind: {
                                                    hidden: '{record.berth_id ? false : true}',
                                                    html:
                                                        '<div class="a-content">' +
                                                        '<div class="a-column a-column-left">{berth_info.cargoes}</div>' +
                                                        '<div class="a-column a-column-right"><div class="a-berth-info"><a href="javascript:void(0);" class="berthLink" data-id="{berth_info.berth.berth_id}">{berth_info.berth.name}</a><p>{berth_info.prospects.etb}<p>{berth_info.prospects.etc}</p><p>{berth_info.prospects.etd}</p></div></div>' +
                                                        '</div>',
                                                },
                                            },
                                        ],
                                        listeners: {
                                            click: {
                                                element: 'element',
                                                delegate: 'a.commodity_dialog,a.berthLink',
                                                fn: function (item, el, eOpts) {
                                                    if (item.currentTarget.className == 'berthLink') {
                                                        var berthId = parseInt(
                                                            item.currentTarget.getAttribute('data-id')
                                                        );
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showBerthDialogById(berthId);
                                                    }
                                                    if (item.currentTarget.className == 'commodity_dialog') {
                                                        var commodity_id = parseInt(
                                                            item.currentTarget.getAttribute('data-id')
                                                        );
                                                        if (commodity_id)
                                                            Abraxa.Global.showCommodityDialog(commodity_id);
                                                    }
                                                },
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'abraxa.formlist',
                                        flex: 1,
                                        scrollable: false,
                                        layout: {
                                            type: 'vbox',
                                            align: 'stretch',
                                        },
                                        bind: {
                                            store: '{record.events}',
                                        },
                                        itemConfig: {
                                            viewModel: {},
                                            xtype: 'div',
                                            flex: 1,
                                            bind: {
                                                html: '<span class="a-date {record.showDate ? "" : "d-none"}">{record.event_date:date("d M")}</span><i class="event_icon"></i>',
                                                cls: 'a-event {record.event_class}',
                                                tooltip: {
                                                    cls: 'a-event-tooltip {record.event_class}',
                                                    ui: 'info-card',
                                                    style: 'white-space:pre-wrap;word-wrap:break-word;word-break:break-word;',
                                                    anchor: true,
                                                    align: 'bc-tc',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    maxWidth: 300,
                                                    html:
                                                        '<div class="a-header"><div class="sm-title">{record.event_category_name}</div><div class="a-title"><i></i>{record.event_name}</div></div>' +
                                                        '<div class="a-body">' +
                                                        '<div class="row">' +
                                                        '<div class="a-date">{record.event_date:date("d M y")} <em>({record.event_date:date("D")})</em></div>' +
                                                        '<div class="a-sep"></div>' +
                                                        '<div class="a-time">{record.event_from:date("H:i")} {record.event_to ? " - " : ""} {record.event_to:date("H:i")}</div>' +
                                                        '</div>' +
                                                        '<div class="a-comment"><i class="material-icons-outlined">short_text</i> <p>{record.event_comment ? record.event_comment : "No comments"}</p></div>' +
                                                        '</div>',
                                                    // html: '<div class="a-date-day"><span class="a-date">{record.event_date:date("d M y")}</span><span class="a-day">{record.event_date:date("D")}</span></div>' +
                                                    //     '<div class="row"><div class="a-time">{record.event_from:date("H:i")} {record.event_to ? " - " : ""} {record.event_to:date("H:i")}</div><div class="a-name">{record.event_name}</div></div>'
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    bind: {
                                        hidden: '{object_record.port_atd ? true : false}',
                                        cls: '{object_record.port_atd ? "" : "a-boat"}',
                                    },
                                    html: '',
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.formlist',
                            variableHeights: true,
                            flex: 1,
                            bind: {
                                data: '{prospects}',
                                cls: 'a-events-progress',
                                hidden: '{object_record.port_ata || sortedEvents.length ? false : true}',
                            },
                            itemConfig: {
                                viewModel: {
                                    formulas: {
                                        cargoes: {
                                            bind: {
                                                bindTo: '{object_record}',
                                                deep: true,
                                            },
                                            get: function (object_record) {
                                                if (object_record && this.get('object_id') == 3) {
                                                    let berth_info = {},
                                                        record = this.get('record');

                                                    if (object_record) {
                                                        let cargo_ops = object_record.cargo_ops(),
                                                            berthCargoes = object_record
                                                                .getNomination()
                                                                .cargoes()
                                                                .queryBy(function (cargo) {
                                                                    return cargo.get('berth_id') == record.get('id');
                                                                }).items,
                                                            cargoes = [];

                                                        if (berthCargoes.length) {
                                                            Ext.Array.each(berthCargoes, function (cargo) {
                                                                let handled = 0,
                                                                    percentage = 0,
                                                                    quantity = 0,
                                                                    cargo_function;

                                                                cargo_ops.each(function (operation) {
                                                                    if (operation.get('cargo_id') == cargo.id)
                                                                        handled += parseInt(operation.get('handled'));
                                                                });

                                                                (percentage =
                                                                    (100 * (handled ? parseInt(handled) : 0)) /
                                                                    parseInt(cargo.get('quantity'))),
                                                                    (cargo_function =
                                                                        cargo.get('function') == 'Loading'
                                                                            ? 'Loaded'
                                                                            : 'Discharged'),
                                                                    (quantity = numeral(cargo.get('quantity')).format(
                                                                        '0,0.[000]'
                                                                    ));

                                                                // percentage = 0;

                                                                cargoes.push(
                                                                    '<div class="a-cargo"><a href="javascript:void(0);" class="commodity_dialog" data-id="' +
                                                                        cargo.get('commodity_id') +
                                                                        '"><b>' +
                                                                        quantity +
                                                                        '</b> ' +
                                                                        cargo.get('unit') +
                                                                        ' - ' +
                                                                        cargo.get('commodity') +
                                                                        '</a><div><b>' +
                                                                        cargo_function +
                                                                        '</b> - ' +
                                                                        percentage.toFixed(0) +
                                                                        '%</div></div>'
                                                                );
                                                            });
                                                        } else {
                                                            if (record.get('function')) {
                                                                cargoes.push(
                                                                    '<div class="a-function function-' +
                                                                        record.get('function') +
                                                                        '"><span>' +
                                                                        record.get('function') +
                                                                        '</span></div>'
                                                                );
                                                            } else {
                                                                cargoes.push(
                                                                    '<div class="a-function function-none"><span>No function</span></div>'
                                                                );
                                                            }
                                                        }
                                                        cargoes = cargoes.join('');
                                                        return cargoes;
                                                    }
                                                }
                                            },
                                        },
                                        berth_info: {
                                            bind: {
                                                bindTo: '{object_record}',
                                                deep: true,
                                            },
                                            get: function (object_record) {
                                                if (object_record && this.get('object_id') == 3) {
                                                    let prospects = {
                                                            etb: '<b>ETB:</b> ---',
                                                            etc: '<b>ETC:</b> ---',
                                                            etd: '<b>ETD:</b> ---',
                                                        },
                                                        berths = object_record.berths(),
                                                        record = berths.getById(this.get('record').get('id'));

                                                    if (record) {
                                                        if (record.get('etb')) {
                                                            prospects.etb =
                                                                '<b>ETB:</b> ' +
                                                                moment(record.get('etb')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }
                                                        if (record.get('berthed')) {
                                                            prospects.etb =
                                                                '<b>Berthed:</b> ' +
                                                                moment(record.get('berthed')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }
                                                        if (record.get('etc')) {
                                                            prospects.etc =
                                                                '<b>ETC:</b> ' +
                                                                moment(record.get('etc')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }
                                                        if (record.get('completed')) {
                                                            prospects.etc =
                                                                '<b>Completed:</b> ' +
                                                                moment(record.get('completed')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }
                                                        if (record.get('etd')) {
                                                            prospects.etd =
                                                                '<b>ETD:</b> ' +
                                                                moment(record.get('etd')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }
                                                        if (record.get('departed')) {
                                                            prospects.etd =
                                                                '<b>Departed:</b> ' +
                                                                moment(record.get('departed')).format(
                                                                    AbraxaConstants.formatters.date
                                                                        .dayMonYearHyphenTime24
                                                                );
                                                        }

                                                        return {
                                                            prospects: prospects,
                                                        };
                                                    }
                                                }
                                            },
                                        },
                                    },
                                },
                                xtype: 'container',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch',
                                },
                                // flex: 1,
                                items: [
                                    {
                                        xtype: 'container',
                                        cls: 'a-event a-berth a-unassigned',
                                        html: '<i></i>',
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'a-berth-tooltip',
                                                bind: {
                                                    html:
                                                        '<div class="a-content">' +
                                                        '<div class="a-column a-column-left">{cargoes}</div>' +
                                                        '<div class="a-column a-column-right"><div class="a-berth-info"><a href="javascript:void(0);" class="berthLink" data-id="{record.berth_id}">{record.name}</a><p>{berth_info.prospects.etb}</p><p>{berth_info.prospects.etc}</p><p>{berth_info.prospects.etd}</p></div></div>' +
                                                        '</div>',
                                                },
                                            },
                                        ],
                                        listeners: {
                                            click: {
                                                element: 'element',
                                                delegate: 'a.commodity_dialog,a.berthLink',
                                                fn: function (item, el, eOpts) {
                                                    if (item.currentTarget.className == 'berthLink') {
                                                        var berthId = parseInt(
                                                            item.currentTarget.getAttribute('data-id')
                                                        );
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showBerthDialogById(berthId);
                                                    }
                                                    if (item.currentTarget.className == 'commodity_dialog') {
                                                        var commodity_id = parseInt(
                                                            item.currentTarget.getAttribute('data-id')
                                                        );
                                                        if (commodity_id)
                                                            Abraxa.Global.showCommodityDialog(commodity_id);
                                                    }
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'a-port a-finish',
                    bind: {
                        html: '<i class="md-icon-outlined">flag</i><div class="a-eta">{etdOrAtd}</div>',
                        hidden: '{object_record.port_ata || sortedEvents.length ? false : true}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-port a-next',
                    bind: {
                        html: '<i class="md-icon-outlined">trip_origin</i><div class="a-name"><a href="javascript:void(0);">{object_record.next_port ? object_record.next_port : "N/A"}</a></div><div class="sm-title">Next port</div>',
                        hidden: '{object_record.port_ata || sortedEvents.length ? true : false}',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a',
                            fn: function (el) {
                                let me = this,
                                    cmp = me.component,
                                    portId = cmp.upVM().get('object_record').get('next_port_id');
                                if (portId) {
                                    Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .showPortDialogById(portId);
                                }
                            },
                        },
                    },
                },
            ],
        },
    ],
});
