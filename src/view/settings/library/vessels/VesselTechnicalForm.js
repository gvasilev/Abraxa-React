Ext.define('Abraxa.view.common.dialog.vessel.form.VesselTechnicalForm', {
    extend: 'Ext.Container',
    xtype: 'vessel.main.technicalform',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'abraxa.container',
            bodyPadding: 0,
            margin: 0,
            items: [
                {
                    xtype: 'div',
                    html: '<h2>Technical Info</h2>',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        //wrap: true,
                    },
                    cls: 'a-vessel-input-data',

                    items: [
                        {
                            // Left
                            xtype: 'container',
                            margin: '0 24 0 0',
                            layout: {
                                type: 'vbox',
                            },
                            flex: 1,
                            defaults: {
                                cls: 'vesselmodal',
                                labelWidth: 200,
                                clearable: false,
                                labelAlign: 'left',
                                placeholder: AbraxaConstants.placeholders.emptyValue,
                                ui: 'hovered-underline',
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Engine Type',
                                    bind: {
                                        value: '{vessel.engine_model}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    maxLength: 10,
                                    label: 'Engine Power',
                                    bind: {
                                        value: '{vessel.kw_total}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    maxLength: 10,
                                    label: 'HP',
                                    bind: {
                                        value: '{vessel.hp_total}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    maxLength: 10,
                                    label: 'Speed',
                                    bind: {
                                        value: '{vessel.speed}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    maxLength: 10,
                                    label: 'Consumption',
                                    bind: {
                                        value: '{vessel.cons}',
                                    },
                                },
                                {
                                    xtype: 'abraxa.datefield',
                                    placeholder: 'DD/MM/YY',
                                    maxLength: 10,
                                    label: 'Registration',
                                    bind: {
                                        value: '{vessel.registration_date}',
                                    },
                                },
                            ],
                        },
                        {
                            // Right
                            xtype: 'container',
                            margin: '0 0 0 24',
                            layout: {
                                type: 'vbox',
                            },
                            flex: 1,
                            defaults: {
                                cls: 'vesselmodal',
                                labelWidth: 200,
                                clearable: false,
                                labelAlign: 'left',
                                placeholder: AbraxaConstants.placeholders.emptyValue,
                                ui: 'hovered-underline',
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Hull Number',
                                    bind: {
                                        value: '{vessel.hull_number}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    label: 'Ice Class',
                                    bind: {
                                        value: '{vessel.ice_class}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    maxLength: 10,
                                    label: 'RPM',
                                    bind: {
                                        value: '{vessel.rpm}',
                                    },
                                },
                                {
                                    xtype: 'abraxa.datefield',
                                    placeholder: 'DD/MM/YY',
                                    maxLength: 10,
                                    label: 'Keel Laying',
                                    bind: {
                                        value: '{vessel.keel_laying_date}',
                                    },
                                },
                                {
                                    xtype: 'abraxa.datefield',
                                    placeholder: 'DD/MM/YY',
                                    maxLength: 10,
                                    label: 'Launching',
                                    bind: {
                                        value: '{vessel.launching_date}',
                                    },
                                },
                                {
                                    xtype: 'abraxa.datefield',
                                    placeholder: 'DD/MM/YY',
                                    maxLength: 10,
                                    label: 'Order Date',
                                    bind: {
                                        value: '{vessel.order_date}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],

            /*items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    //wrap: true,
                },*/
            /*cls: 'a-vessel-data',
            defaults: {
                xtype: 'container',
                padding: 0,
                layout: 'vbox',
                cls: 'a-cargo-list',
                flex: 1,
                defaults: {
                    xtype: 'displayfield',
                    ui: 'default',
                    encodeHtml: false,
                    padding: 8,
                    labelAlign: 'left',
                    bodyAlign: 'end',
                    labelWidth: 'auto'
                }
            },*/
            /*items: [
                {
                    //container
                    items: [
                        //displayfield
                        {
                            label: 'ENGINE TYPE',
                            bind: {
                                value: '{vessel.engine_model}'
                            }
                        },
                        {
                            label: 'ENGINE POWER',
                            bind: {
                                value: '{vessel.kw_total}'
                            }
                        },
                        {
                            label: 'HP',
                            bind: {
                                value: '{vessel.hp_total}'
                            }
                        },
                        {
                            label: 'SPEED',
                            bind: {
                                value: '{vessel.speed}'
                            }
                        },
                        {
                            label: 'CONSUMPTION',
                            bind: {
                                value: '{vessel.cons}'
                            }
                        }
                    ]
                },
                {
                    //container
                    items: [
                        //displayfield
                        {
                            label: 'HULL NUMBER',
                            bind: {
                                value: '{vessel.hull_number}'
                            }
                        },
                        {
                            label: 'ICE CLASS',
                            bind: {
                                value: '{vessel.ice_class}'
                            }
                        },
                        {
                            label: 'RPM',
                            bind: {
                                value: '{vessel.rpm}'
                            }
                        },
                        {
                            label: 'KEEL LAYING',
                            bind: {
                                value: '{vessel.keel_laying_date}'
                            }
                        },
                        {
                            label: 'LAUNCHING',
                            bind: {
                                value: '{vessel.launching_date}'
                            }
                        },
                        {
                            label: 'REGISTRATION',
                            bind: {
                                value: '{vessel.registration_date}'
                            }
                        },
                        {
                            label: 'ORDER DATE',
                            bind: {
                                value: '{vessel.order_date}'
                            }
                        }
                    ]
                }
            ]*/
            //}]
        },
        {
            xtype: 'abraxa.container',
            bodyPadding: 0,
            margin: '24 0 0 0',
            flex: 1,
            items: [
                {
                    xtype: 'div',
                    html: '<h2>Classification Society</h2>',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        wrap: true,
                    },
                    cls: 'a-vessel-data',
                    defaults: {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 1,
                        defaults: {
                            xtype: 'displayfield',
                            labelWidth: 216,
                            ui: 'default',
                            encodeHtml: false,
                            labelAlign: 'left',
                        },
                    },
                    items: [
                        {
                            //container
                            margin: '0 24 0 0',
                            items: [
                                //displayfield
                                {
                                    label: 'Class',
                                    bind: {
                                        value: '{vessel.class_soc_class}',
                                    },
                                },
                                {
                                    label: 'Date of next Survey',
                                    bind: {
                                        value: '{vessel.class_soc_date_of_next_survey}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        } else {
                                            var getDate = new Date(value);
                                        }
                                        return moment(getDate).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
                                    },
                                },
                                {
                                    label: 'Status',
                                    bind: {
                                        value: '{vessel.class_soc_status}',
                                    },
                                },
                            ],
                        },
                        {
                            //container
                            margin: '0 0 0 24',
                            items: [
                                //displayfield
                                {
                                    label: 'Date of Survey',
                                    bind: {
                                        value: '{vessel.class_soc_date_of_survey}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        } else {
                                            var getDate = new Date(value);
                                        }
                                        return moment(getDate).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
                                    },
                                },
                                {
                                    label: 'Date of latest Status',
                                    bind: {
                                        value: '{vessel.class_soc_date_of_lastest_status}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        } else {
                                            var getDate = new Date(value);
                                        }
                                        return moment(getDate).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
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
