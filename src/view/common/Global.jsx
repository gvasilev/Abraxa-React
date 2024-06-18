/**
 * Global class for functions used a lot like show port dialog
 */
import '../common/dialog/commodity/CommodityDialog';
import '../../model/commodity/Commodity';

Ext.define('Abraxa.Global', {
    singleton: true,

    // getPort: function (portId) {
    //     if (portId) {
    //         Ext.Ajax.request({
    //             url: Env.ApiEndpoint + "ports/" + portId,
    //             method: "GET",
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("id_token"),
    //                 "Content-Type": "application/json"
    //             },
    //             jsonData: {},
    //             success: function (response) {
    //                 var isPortServed = false;
    //                 var responseData = JSON.parse(response.responseText);

    //                 // Load ports served store
    //                 var storeCompanyBerths = Ext.create('Abraxa.store.settings.companysettings.PortsServed', {
    //                     autoLoad: false
    //                 });

    //                 storeCompanyBerths.load({
    //                     callback: function (records, operation, success) {
    //                         if (success == true) {
    //                             let recordExists = storeCompanyBerths.findRecord('port_id', portId, 0, false, false, true);

    //                             if (recordExists) isPortServed = true;

    //                             Ext.create("Abraxa.view.common.dialog.Port", {
    //                                 viewModel: {
    //                                     data: {
    //                                         record: responseData,
    //                                         berthClicked: false,
    //                                         isPortServed: isPortServed
    //                                     }
    //                                 }
    //                             }).show();
    //                         }
    //                     }
    //                 });
    //             },
    //             failure: function (response) {
    //                 Ext.Msg.alert("Status", "Request Failed.");
    //             }
    //         });
    //     }
    // },

    getBerthInPort: function (portId, berthId) {
        if (portId && berthId) {
            let porstsServed = Ext.getCmp('main-viewport').getViewModel().get('portsServed'),
                portsServedRecord = porstsServed.findRecord('port_id', portId),
                portDialog = Ext.create('Abraxa.view.common.dialog.PortMain'),
                portDialogVM = portDialog.getVM(),
                portModel = new Abraxa.model.common.Port({
                    id: portId,
                });
            portModel.load({
                success: function () {
                    portDialogVM.set('port', portModel);
                    if (portsServedRecord) {
                        portDialogVM.set('getIsPortServed', true);
                    }
                    portDialog.down('tabbar').setActiveTab(2);
                    let selectedBerth = portModel.berths().getById(berthId);
                    var mainContainer = Ext.ComponentQuery.query('#portBerthsMainContainerItemId')[0];
                    mainContainer.setActiveItem(1);
                    mainContainer.getViewModel().set('selectedBerth', selectedBerth);
                    portDialog.show();
                },
            });
        }
    },

    // Show Discounts tooltip (inq offer)
    showDiscountsTooltip: function (type, data, currentTarget, options = [], vm) {
        var tooltip_el = Ext.create('Abraxa.view.common.tooltips.DiscountsTooltip', {
            viewModel: {
                data: {
                    type: type,
                    record: data,
                    clickedElement: currentTarget,
                },
            },
        }).showBy(currentTarget, 'bc-tc?');
    },

    validityFromToWholeString: function (validity_from_date, validity_to_date) {
        let date = '';
        var validity_from =
            validity_from_date == '0000-00-00' || validity_from_date == null
                ? ''
                : moment(new Date(validity_from_date)).format('D MMM YYYY');
        var validity_to =
            validity_to_date == '0000-00-00' || validity_to_date == null
                ? ''
                : moment(new Date(validity_to_date)).format('D MMM YYYY');
        let firstDateExists = validity_from_date == '0000-00-00' || validity_from_date == null ? false : true;

        if (validity_from_date == '0000-00-00' || validity_from_date == null) {
        } else {
            date += validity_from + ' - ';
        }

        if (validity_to_date == '0000-00-00' || validity_to_date == null) {
        } else {
            if (firstDateExists) {
                date += validity_to;
            } else {
                date += ' - ' + validity_to;
            }
        }

        return date;
    },

    validityFromToWholeStringShortYear: function (validity_from_date, validity_to_date) {
        let date = '';
        var validity_from =
            validity_from_date == '0000-00-00' || validity_from_date == null
                ? ''
                : moment(new Date(validity_from_date)).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
        var validity_to =
            validity_to_date == '0000-00-00' || validity_to_date == null
                ? ''
                : moment(new Date(validity_to_date)).format(AbraxaConstants.formatters.date.dayAbbrMonYear);
        let firstDateExists = validity_from_date == '0000-00-00' || validity_from_date == null ? false : true;

        if (validity_from_date == '0000-00-00' || validity_from_date == null) {
        } else {
            date += validity_from + ' - ';
        }

        if (validity_to_date == '0000-00-00' || validity_to_date == null) {
        } else {
            if (firstDateExists) {
                date += validity_to;
            } else {
                date += ' - ' + validity_to;
            }
        }

        return date;
    },

    getTooltipHtml: function (type = 'multipleRecords', store) {
        var html = '';
        var recordsLength = type == 'singleRecord' ? 1 : parseInt(store.getCount().toString());

        for (i = 0; i < recordsLength; i++) {
            if (type == 'singleRecord') {
                var record = store;
            } else {
                var record = store.data.items[i];
            }

            let port_name = record.data.port_name ? record.data.port_name : AbraxaConstants.placeholders.emptyValue;
            let validity_from_to = Abraxa.Global.validityFromToWholeStringShortYear(
                record.data.validity_from,
                record.data.validity_to
            );
            var offer_item =
                record.data.offer_item != '' && record.data.offer_item
                    ? record.data.offer_item
                    : AbraxaConstants.placeholders.emptyValue;

            if (validity_from_to == '') {
                validity_from_to = AbraxaConstants.placeholders.emptyValue;
            }

            if (offer_item == '') {
                offer_item = AbraxaConstants.placeholders.emptyValue;
            }

            let style_agreement = '';

            if (record.data.discount_type != 'Agreement') {
                style_agreement = 'display:none;';
            }

            if (record) {
                html +=
                    '<div class="tooltip-body">' +
                    '<div class="tooltip-title">' +
                    '<div class="badge badge-discount"><span class="a-icon">%</span></div>' +
                    '<div class="sm-label">DISCOUNT</div><div class="label">' +
                    record.data.discount_company_name +
                    '</div></div>' +
                    '<div class="tooltip-content">' +
                    '<ul>' +
                    '<li><div class="sm-label">Port</div><div class="hbox"><i class="material-icons">location_on</i><span>' +
                    port_name +
                    '</span></div></li>' +
                    '<li><div class="sm-label">Type</div><div class="hbox"><i class="material-icons">error_outline</i><span>' +
                    record.data.discount_type +
                    '</span></div></li>' +
                    '<li><div class="sm-label">Item</div><div class="hbox"><i class="material-icons">error_outline</i><span>' +
                    offer_item +
                    '</span></div></li>' +
                    '<li><div class="sm-label">Value</div><div class="hbox"><i class="material-icons">error_outline</i><span>' +
                    record.data.item_value +
                    '</span></div></li>' +
                    '<li style="max-width: 250px;"><div class="sm-label">Validity (From - To)</div><div class="hbox"><i class="material-icons">date_range</i><span>' +
                    validity_from_to +
                    '</span></div></li>' +
                    '</ul>' +
                    '<div style="' +
                    style_agreement +
                    '" class="tooltip-desc"><div class="sm-label">Agreement details</div>' +
                    '<div class="hbox align-items-start"><i class="material-icons md-18 mr-8">insert_comment</i><div class="">' +
                    record.data.agreement +
                    '</div></div>' +
                    '</div>' +
                    '<div class="text-center"><a href="javascript:void(0);" class="view_details c-link" data-orgid="' +
                    record.data.discount_company_id +
                    '">View details</a></div>' +
                    '</div>' +
                    '</div>';

                if (type != 'singleRecord' && i + 1 < recordsLength) {
                    html += '<hr class="md">';
                }
            }
        }
        return html;
    },

    /**
     *   OrgId is a single company
     */
    getOrganizationDiscountsAndShowTooltip: function (orgId, currentTarget, port = null) {
        var store = Ext.create('Abraxa.store.damanager.Discounts', {
            autoLoad: false,
        });

        store.load({
            params: {
                org_id: orgId,
                port_id: port,
            },
            callback: function (records, operation, success) {
                if (success == true) {
                    Abraxa.Global.showDiscountsTooltip('multipleRecords', store, currentTarget);
                }
            },
        });
    },

    /**
     *   OrgId is a single company
     */
    getOrganizationBalanceTooltip: function (orgId, currentTarget) {
        if (orgId) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'organizations/' + orgId + '/balance',
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                    'Content-Type': 'application/json',
                },
                jsonData: {},
                success: function (response) {
                    var tooltip_el = Ext.create('Abraxa.view.common.tooltips.OrgBalanceTooltip', {
                        viewModel: {
                            data: {
                                balance: JSON.parse(response.responseText),
                                clickedElement: currentTarget,
                            },
                        },
                    }).showBy(currentTarget, 'bc-tc?');
                },
                failure: function (response) {
                    Ext.Msg.alert('Status', 'Request Failed.');
                },
            });
        }
    },

    getOrganizationBalance: function (orgId, callback) {
        if (orgId) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'organizations/' + orgId + '/balance',
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                    'Content-Type': 'application/json',
                },
                jsonData: {},
                success: function (response) {
                    callback(parseFloat(JSON.parse(response.responseText)));
                },
                failure: function (response) {
                    Ext.Msg.alert('Status', 'Request Failed.');
                },
            });
        }
    },

    // Notes component
    getNotesObjIdFromHash: function (routeHash) {
        var listOfModules = {
            '#companydatabase': 1,
            '#inquiries': 6,
            '#portlog': 10,
        };

        if (listOfModules.hasOwnProperty(routeHash)) {
            return listOfModules[routeHash];
        }
    },

    // Does a module need to show tags for the notes
    getNotesWithTags: function (routeHash) {
        var listOfModules = {
            '#companydatabase': 1,
            '#inquiries': 6,
            '#portlog': 10,
        };

        if (listOfModules.hasOwnProperty(routeHash)) {
            if (routeHash == '#companydatabase') {
                return null;
            } else {
                return 1;
            }
        }
    },
    getCommodity: function (commodityId) {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'commodities/' + commodityId,
                method: 'GET',
                disableCaching: false,
                success: function (response) {
                    var data = Ext.decode(response.responseText);
                    let model = new Abraxa.model.common.Commodity(Object.assign({}, data));
                    resolve(model);
                },
                failure: function failure(response) {},
            });
        });
    },
    // Show commodity dialog
    showCommodityDialog: function (commodity) {
        let me = this;
        if (Ext.isNumeric(commodity)) {
            me.getCommodity(commodity).then(function (model) {
                if (model) {
                    me.openCommodityDialog(model);
                }
            });
        } else {
            me.openCommodityDialog(commodity);
        }
    },
    openCommodityDialog(commodityModel) {
        const vm = Ext.getCmp('main-viewport').getViewModel();
        const dialog = Ext.create('Abraxa.view.common.dialog.Commodity', {
            viewModel: {
                parent: vm,
                data: {
                    action: 'view',
                    commodity: commodityModel,
                },
                formulas: {
                    ownCommodity: {
                        bind: {
                            bindTo: '{commodity}',
                            deep: true,
                        },
                        get: function (commodity) {
                            if (commodity && commodity.company_id) {
                                let currentUser = this.get('currentUser');
                                if (currentUser.get('current_company_id') == commodity.company_id) {
                                    return false;
                                }
                                return true;
                            }
                            return false;
                        },
                    },
                    commodityImg: {
                        bind: {
                            bindTo: '{commodity}',
                            deep: true,
                        },
                        get: function (selection) {
                            if (selection) {
                                if (selection.get('image_name')) {
                                    return (
                                        'https://static.abraxa.com/images/commodities/' + selection.get('image_name')
                                    );
                                } else {
                                    if (selection.get('image_url')) {
                                        return selection.get('image_url');
                                    }
                                    return 'https://static.abraxa.com/images/bgr-no-cargo.svg';
                                }
                            } else {
                                return 'https://static.abraxa.com/images/bgr-no-cargo.svg';
                            }
                        },
                    },
                },
            },
        }).show();
    },
});
