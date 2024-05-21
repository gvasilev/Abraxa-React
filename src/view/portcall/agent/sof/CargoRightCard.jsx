Ext.define('Abraxa.view.portcall.sof.CargoRightCard', {
    extend: 'Ext.Container',
    xtype: 'cargo.right.card',
    cls: 'a-right-container a-cargo-right-container',
    hidden: true,
    // bind: {
    //     hidden: '{selectedCargo.selection ? false : true}'
    // },
    // minWidth: 480,
    // maxWidth: 480,
    // layout: 'vbox',
    // height: "100%",
    // // zIndex: 1001,
    // docked: 'right',
    // viewModel: {
    //     stores: {
    //         comments: {
    //             source: '{notes}',
    //             filters: '{noteFilter}'
    //         },
    //         objectTasks: {
    //             source: '{tasks}',
    //             filters: '{taskFilter}'
    //         }
    //     },
    //     formulas: {
    //         noteFilter: {
    //             bind: {
    //                 bindTo: '{selectedCargo.selection}',
    //                 deep: true
    //             },
    //             get: function (record) {
    //                 if (record) {
    //                     let store = this.get('comments');
    //                     if (store)
    //                         store.clearFilter();

    //                     return function (rec) {
    //                         if (rec.get('noteable_type') == record.get('model_name') && rec.get('noteable_id') == record.get('id')) {
    //                             return true;
    //                         }
    //                     }
    //                 } else {
    //                     return function (item) {
    //                         return true;
    //                     };
    //                 }
    //             }
    //         },
    //         taskFilter: {
    //             bind: {
    //                 bindTo: '{selectedCargo.selection}',
    //                 deep: true
    //             },
    //             get: function (record) {
    //                 if (record) {
    //                     let store = this.get('objectTasks');
    //                     if (store)
    //                         store.clearFilter();

    //                     return function (rec) {
    //                         if (rec.get('taskable_type') == record.get('model_name') && rec.get('taskable_id') == record.get('id')) {
    //                             return true;
    //                         }
    //                     }
    //                 } else {
    //                     return function (item) {
    //                         return true;
    //                     };
    //                 }
    //             }
    //         },
    //         dialogTitle: {
    //             bind: {
    //                 bindTo: '{selectedCargo.selection}',
    //                 deep: true
    //             },
    //             get: function (record) {
    //                 if (record) {
    //                     var store = this.get('cargoes'),
    //                         index = store.indexOf(record) + 1;

    //                     return '<div class="a-badge a-badge-cargo"><i></i></div><div><span class="a-panel-title">' + (record.get('commodity') ? record.get('commodity') : 'Cargo ' + index) + '</span><span class="a-panel-id">#CARGO-' + index + '</span></div>';
    //                 } else {
    //                     return '';
    //                 }
    //             }
    //         },
    //         relatedDocuments: {
    //             bind: {
    //                 bindTo: '{selectedCargo.selection}',
    //                 deep: true
    //             },
    //             get: function (record) {
    //                 if (record) {
    //                     let files = [],
    //                         cargo_id = record.get('id'),
    //                         allDocuments = this.get('allDocuments');

    //                     allDocuments.forEach(function (document) {
    //                         if (document.getDocumentData().get('cargo_id') == cargo_id) {
    //                             files.push(document);
    //                         }
    //                     });
    //                     return files;
    //                 }
    //             }
    //         },
    //         itemTemplate: {
    //             bind: {
    //                 bindTo: '{nonEditable}',
    //                 deep: true
    //             },
    //             get: function (live) {
    //                 if (live) {
    //                     return '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{extension}"></div><div><a class="file_name" href="javascript:void(0);">{original_name}</a><span class="sm-title">{size}</span></div></div>';
    //                 }
    //                 return '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{extension}"></div><div><a class="file_name" href="javascript:void(0);">{original_name}</a><span class="sm-title">{size}</span></div></div>';
    //             }
    //         },
    //     }
    // },
    // items: [{
    //         xtype: 'container',
    //         cls: 'a-titlebar a-bb-100',
    //         items: [{
    //                 xtype: 'title',
    //                 bind: {
    //                     title: '{dialogTitle}'
    //                 },
    //             },
    //             {
    //                 xtype: 'container',
    //                 cls: 'a-actions',
    //                 layout: {
    //                     type: 'hbox',
    //                     align: 'middle'
    //                 },
    //                 items: [{
    //                         xtype: 'button',
    //                         ui: 'round tool-round-md',
    //                         iconCls: 'md-icon-outlined md-icon-task-alt',
    //                         slug: 'taskCreate',
    //                         bind: {
    //                             permission: '{userPermissions}',
    //                             disabled: '{object_record.is_archived ? true : false}',
    //                         },
    //                         tooltip: {
    //                             anchorToTarget: true,
    //                             html: "Add task",
    //                             align: "bc-tc?",
    //                             showDelay: 0,
    //                             hideDelay: 0,
    //                             dismissDelay: 0,
    //                             allowOver: false,
    //                             closeAction: 'destroy'
    //                         },
    //                         handler: function () {
    //                             let record = this.upVM().get('selectedCargo.selection'),
    //                                 subObjects = this.upVM().get('subObjects'),
    //                                 subObject = Ext.Array.filter(subObjects, function (rec) {
    //                                     return (rec.id == record.get('id') && rec.model == record.get('model_name'))
    //                                 })[0];

    //                             Ext.create('Abraxa.view.tasks.AddTaskPopup', {
    //                                 viewModel: {
    //                                     parent: this.upVM(),
    //                                     data: {
    //                                         object_record: this.upVM().get('object_record'),
    //                                         subObjects: this.upVM().get('subObjects'),
    //                                         selectedSubObject: subObject.id,
    //                                         relatedObject: true,
    //                                         users: this.upVM().get('users'),
    //                                         currentUser: this.upVM().get('currentUser'),
    //                                         editMode: false,
    //                                         taskEdit: false,
    //                                         record: Ext.create('Abraxa.model.task.Task', {
    //                                             status: 'to-do',
    //                                             object_id: 3,
    //                                             object_meta_id: this.upVM().get('object_record').get('id'),
    //                                             taskable_type: this.upVM().get('selectedCargo.selection').get('model_name'),
    //                                             taskable_id: this.upVM().get('selectedCargo.selection').get('id'),
    //                                             priority: 'normal'
    //                                         })
    //                                     }
    //                                 }
    //                             }).show();
    //                         }
    //                     },
    //                     {
    //                         xtype: 'button',
    //                         iconCls: 'md-icon-outlined md-icon-delete',
    //                         ui: 'round tool-round-md',
    //                         subObject: 'cargo',
    //                         bind: {
    //                             cls: '{nonEditable ? "hidden" : ""}',
    //                             permission: '{userPermissions}',
    //                             objectPermission: '{objectPermissions}'
    //                         },
    //                         tooltip: {
    //                             anchorToTarget: true,
    //                             html: "Delete",
    //                             align: "bc-tc?",
    //                             showDelay: 0,
    //                             hideDelay: 0,
    //                             dismissDelay: 0,
    //                             allowOver: false,
    //                             closeAction: 'destroy'
    //                         },
    //                         handler: function (me) {
    //                             let record = me.upVM().get('selectedCargo.selection');
    //                             let store = me.upVM().get('cargoes');
    //                             Ext.Msg.confirm(
    //                                 'Delete',
    //                                 'Are you sure you would like to delete this cargo?',
    //                                 function (answer) {
    //                                     if (answer == 'yes') {
    //                                         store.remove(record);
    //                                         store.sync({
    //                                             success: function (response, options) {
    //                                                 Ext.toast('Record updated', 1000);
    //                                             }
    //                                         });
    //                                     }
    //                                 }, this, [{
    //                                     xtype: 'button',
    //                                     itemId: 'no',
    //                                     margin: '0 8 0 0',
    //                                     text: 'Cancel'
    //                                 }, {
    //                                     xtype: 'button',
    //                                     itemId: 'yes',
    //                                     ui: 'decline alt',
    //                                     text: 'Delete'
    //                                 }]
    //                             );
    //                         }
    //                     },
    //                     {
    //                         xtype: 'button',
    //                         ui: 'round tool-round-md',
    //                         iconCls: 'md-icon-keyboard-tab md-icon-outlined',
    //                         handler: function (me) {
    //                             let record = this.upVM().get('selectedCargo.selection'),
    //                                 grid = Ext.ComponentQuery.query('sof\\.cargolist')[0];

    //                             if (record) {
    //                                 record.reject();
    //                             }
    //                             grid.deselectAll();
    //                             me.up('[xtype=cargo\\.right.\\card]').hide();
    //                         },
    //                         tooltip: {
    //                             anchorToTarget: true,
    //                             html: '<span class="tooltip_expand">Close <em>esc</em></span>',
    //                             align: 'bc-tc?',
    //                             showDelay: 0,
    //                             hideDelay: 0,
    //                             dismissDelay: 0,
    //                             allowOver: false,
    //                             closeAction: 'destroy'
    //                         },
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         xtype: 'container',
    //         cls: 'a-portcall-info',
    //         padding: '10 0 0 0',
    //         layout: 'vbox',
    //         scrollable: 'y',
    //         flex: 1,
    //         items: [{
    //                 xtype: 'container',
    //                 cls: 'a-portcall-data',
    //                 defaults: {
    //                     cls: 'a-data-item',
    //                 },
    //                 items: [{
    //                         xtype: 'container',
    //                         cls: 'a-data-item',
    //                         defaults: {
    //                             cls: 'a-field-icon icon-short icon-rounded',
    //                             labelAlign: 'left',
    //                             ui: 'hovered-border classic',
    //                             listeners: {
    //                                 blur: function (me) {
    //                                     let store = this.upVM().get('cargoes');

    //                                     store.sync({
    //                                         success: function () {
    //                                             let portcall = me.upVM().get('object_record');
    //                                             portcall.set('updated_at', new Date());
    //                                             Ext.toast('Record updated', 1000);
    //                                         }
    //                                     });
    //                                 }
    //                             }
    //                         },
    //                         items: [{
    //                             xtype: 'unit.field',
    //                             slug: 'portcallCargoGeneral',
    //                             subObject: 'cargo',
    //                             label: 'Quantity',
    //                             bind: {
    //                                 value: "{selectedCargo.selection.bl_quantity}",
    //                                 valueUnit: "{selectedCargo.selection.bl_unit}",
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             },
    //                             options: ["mts", "cbm", "cbft", "units", "Kilograms", "TEU"]
    //                         }, {
    //                             xtype: "commodity.combo",
    //                             margin: '8 0 0 0',
    //                             label: 'Commodity',
    //                             valueField: 'id',
    //                             displayField: 'name',
    //                             slug: 'portcallCargoGeneral',
    //                             subObject: 'cargo',
    //                             bind: {
    //                                 value: "{selectedCargo.selection.commodity_id}",
    //                                 inputValue: "{selectedCargo.selection.commodity}",
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             },
    //                             listeners: {
    //                                 select: function () {
    //                                     let record = this.upVM().get('selectedCargo.selection');
    //                                     record.set('commodity', this.getSelection().get('name'));
    //                                 }
    //                             }
    //                         }, {
    //                             xtype: 'selectfield',
    //                             label: 'Operation',
    //                             placeholder: 'Choose operation',
    //                             options: ['Loading', 'Discharging'],
    //                             slug: 'portcallCargoGeneral',
    //                             subObject: 'cargo',
    //                             bind: {
    //                                 value: '{selectedCargo.selection.function}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             }
    //                         }, {
    //                             xtype: 'port.combo',
    //                             cls: 'a-field-icon icon-port icon-rounded',
    //                             slug: 'portcallCargoOriginDest',
    //                             subObject: 'cargo',
    //                             clearable: false,
    //                             bind: {
    //                                 value: '{selectedCargo.selection.origin_destination_id}',
    //                                 inputValue: '{selectedCargo.selection.origin_destination}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 label: '{selectedCargo.selection.function:lowercase() == "discharging" ? "Load port" : "Discharge port"}',
    //                                 objectPermission: '{objectPermissions}'
    //                             },
    //                             listeners: {
    //                                 select: function () {
    //                                     let record = this.upVM().get('selectedCargo.selection');
    //                                     record.set('origin_destination', this.getSelection().get('port_name'));
    //                                 },
    //                                 clearicontap: function () {
    //                                     let record = this.upVM().get('selectedCargo.selection');
    //                                     record.set('origin_destination', null);
    //                                 }
    //                             }
    //                         }, {
    //                             xtype: 'selectfield',
    //                             ui: 'hovered-border classic',
    //                             label: 'Customs status',
    //                             slug: 'portcallCargoCustoms',
    //                             subObject: 'cargo',
    //                             placeholder: 'Enter customs status',
    //                             options: ['T2L', 'EU', 'T1', 'Export doc', 'Non EU'],
    //                             bind: {
    //                                 value: '{selectedCargo.selection.customs_status}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                             },
    //                         }, {
    //                             xtype: 'draftfield',
    //                             margin: '4 0',
    //                             ui: 'hovered-border classic',
    //                             label: 'Stowage factor',
    //                             slug: 'portcallCargoStowage',
    //                             subObject: 'cargo',
    //                             options: ["cbm/mt", "cbft/mt", "cbm/lt", "cbft/lt"],
    //                             bind: {
    //                                 value: '{selectedCargo.selection.stowage_factor}',
    //                                 valueUnit: '{selectedCargo.selection.stowage_factor_unit}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             },
    //                         }, {
    //                             xtype: 'abraxa.datefield',
    //                             margin: '8 0 0 0',
    //                             cls: 'a-field-icon icon-date icon-rounded',
    //                             label: 'CP date',
    //                             slug: 'portcallCargoCPDate',
    //                             subObject: 'cargo',
    //                             bind: {
    //                                 value: '{selectedCargo.selection.cp_date}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             }
    //                         }]
    //                     },
    //                     {
    //                         xtype: 'container',
    //                         hidden: true,
    //                         bind: {
    //                             hidden: '{cargoAdvanced ? false : true}'
    //                         },
    //                         defaults: {
    //                             cls: 'a-field-icon icon-business-center icon-rounded',
    //                             labelAlign: 'left',
    //                             ui: 'hovered-border classic',
    //                             listeners: {
    //                                 blur: function () {
    //                                     let store = this.upVM().get('cargoes');

    //                                     store.sync({
    //                                         success: function () {
    //                                             Ext.toast('Record updated', 1000);
    //                                         }
    //                                     });
    //                                 }
    //                             }
    //                         },
    //                         items: [{
    //                             xtype: 'organization.combo',
    //                             label: 'Charterer',
    //                             placeholder: 'Enter company',
    //                             slug: 'portcallCargoCharterer',
    //                             subObject: 'cargo',
    //                             bind: {
    //                                 value: '{nonEditable ? null : selectedCargo.selection.charterer_id}',
    //                                 inputValue: '{selectedCargo.selection.charterer_name}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             },
    //                             listeners: {
    //                                 select: function () {
    //                                     let record = this.upVM().get('selectedCargo.selection');
    //                                     record.set('charterer_name', this.getSelection().get('org_name'));
    //                                     record.set('charterer_id', this.getSelection().get('org_id'));
    //                                 },
    //                                 painted: function () {
    //                                     let record = this.upVM().get('selectedCargo.selection');

    //                                     if (record)
    //                                         this.setInputValue(record.get('charterer_name'));
    //                                 }
    //                             }
    //                         }, {
    //                             xtype: 'organization.combo',
    //                             label: 'Shipper',
    //                             placeholder: 'Enter company',
    //                             slug: 'portcallCargoShipper',
    //                             subObject: 'cargo',
    //                             focusable: false,
    //                             bind: {
    //                                 value: '{nonEditable ? null : selectedCargo.selection.shipper_id}',
    //                                 inputValue: '{selectedCargo.selection.shipper}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             },
    //                             listeners: {
    //                                 select: function (cmp, newValue) {
    //                                     let record = this.upVM().get('selectedCargo.selection');
    //                                     record.set('shipper', this.getSelection().get('org_name'));
    //                                     record.set('shipper_id', this.getSelection().get('org_id'));
    //                                     if (newValue) {
    //                                         var address = newValue.get("org_address") ? (newValue.get("org_address") + '\n') : "",
    //                                             city = newValue.get("city_name") ? (newValue.get("city_name") + '\n') : "",
    //                                             country = newValue.get("country_name") ? newValue.get("country_name") : "";

    //                                         var formattedAddress = address + city + country;
    //                                         record.set('shipper_address', formattedAddress);
    //                                     }
    //                                 },
    //                                 painted: function () {
    //                                     let record = this.upVM().get('selectedCargo.selection');

    //                                     if (record)
    //                                         this.setInputValue(record.get('shipper'));
    //                                 }
    //                             }
    //                         }, {
    //                             xtype: 'organization.combo',
    //                             label: 'Receiver',
    //                             placeholder: 'Choose company',
    //                             slug: 'portcallCargoReceiver',
    //                             subObject: 'cargo',
    //                             bind: {
    //                                 value: '{nonEditable ? null : selectedCargo.selection.receiver_id}',
    //                                 inputValue: '{selectedCargo.selection.receiver}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             },
    //                             listeners: {
    //                                 select: function (cmp, newValue) {
    //                                     let record = this.upVM().get('selectedCargo.selection');
    //                                     record.set('receiver', this.getSelection().get('org_name'));
    //                                     record.set('receiver_id', this.getSelection().get('org_id'));
    //                                     if (newValue) {
    //                                         var address = newValue.get("org_address") ? (newValue.get("org_address") + '\n') : "",
    //                                             city = newValue.get("city_name") ? (newValue.get("city_name") + '\n') : "",
    //                                             country = newValue.get("country_name") ? newValue.get("country_name") : "";

    //                                         var formattedAddress = address + city + country;
    //                                         record.set('receiver_address', formattedAddress);
    //                                     }
    //                                 },
    //                                 painted: function () {
    //                                     let record = this.upVM().get('selectedCargo.selection');

    //                                     if (record)
    //                                         this.setInputValue(record.get('receiver'));
    //                                 }
    //                             },
    //                         }, {
    //                             xtype: 'organization.combo',
    //                             label: 'Consignee',
    //                             placeholder: 'Choose company',
    //                             slug: 'portcallCargoConsignee',
    //                             subObject: 'cargo',
    //                             bind: {
    //                                 value: '{nonEditable ? null : selectedCargo.selection.consignee_id}',
    //                                 inputValue: '{selectedCargo.selection.consignee_name}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             },
    //                             listeners: {
    //                                 blur: function (cmp) {
    //                                     let record = this.upVM().get('selectedCargo.selection'),
    //                                         newValue = this.getSelection();

    //                                     if (newValue) {
    //                                         record.set('consignee_name', this.getSelection().get('org_name'));
    //                                         record.set('consignee_id', this.getSelection().get('org_id'));

    //                                         var address = newValue.get("org_address") ? (newValue.get("org_address") + '\n') : "",
    //                                             city = newValue.get("city_name") ? (newValue.get("city_name") + '\n') : "",
    //                                             country = newValue.get("country_name") ? newValue.get("country_name") : "";

    //                                         var formattedAddress = address + city + country;
    //                                         record.set('consignee_address', formattedAddress);

    //                                         let store = this.upVM().get('cargoes');

    //                                         store.sync({
    //                                             success: function () {
    //                                                 Ext.toast('Record updated', 1000);
    //                                             }
    //                                         });
    //                                     }
    //                                 },
    //                                 painted: function () {
    //                                     let record = this.upVM().get('selectedCargo.selection');
    //                                     if (record) {
    //                                         this.setInputValue(record.get('consignee_name'));
    //                                     }

    //                                 }
    //                             }
    //                         }, {
    //                             xtype: 'organization.combo',
    //                             label: 'Notify',
    //                             placeholder: 'Choose company',
    //                             slug: 'portcallCargoNotify',
    //                             subObject: 'cargo',
    //                             bind: {
    //                                 value: '{nonEditable ? null : selectedCargo.selection.notify_id}',
    //                                 inputValue: '{selectedCargo.selection.notify_name}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             },
    //                             listeners: {
    //                                 select: function (cmp, newValue) {
    //                                     let record = this.upVM().get('selectedCargo.selection');
    //                                     record.set('notify_name', this.getSelection().get('org_name'));
    //                                     if (newValue) {
    //                                         var address = newValue.get("org_address") ? (newValue.get("org_address") + '\n') : "",
    //                                             city = newValue.get("city_name") ? (newValue.get("city_name") + '\n') : "",
    //                                             country = newValue.get("country_name") ? newValue.get("country_name") : "";

    //                                         var formattedAddress = address + city + country;
    //                                         record.set('notify_address', formattedAddress);
    //                                     }
    //                                 },
    //                                 painted: function () {
    //                                     let record = this.upVM().get('selectedCargo.selection');

    //                                     if (record)
    //                                         this.setInputValue(record.get('notify_name'));
    //                                 }
    //                             }
    //                         }, {
    //                             xtype: 'textareafield',
    //                             ui: 'no-border classic',
    //                             cls: 'a-field-icon icon-short',
    //                             labelAlign: 'top',
    //                             label: 'Description of goods',
    //                             scrollable: false,
    //                             minHeight: 60,
    //                             margin: '8 0',
    //                             flex: 1,
    //                             placeholder: 'Description',
    //                             slug: 'portcallCargoDescription',
    //                             subObject: 'cargo',
    //                             bind: {
    //                                 value: '{selectedCargo.selection.description_of_goods}',
    //                                 readOnly: '{nonEditable ? true : false}',
    //                                 ui: '{nonEditable ? "viewonly classic" : "no-border classic"}',
    //                                 permission: '{userPermissions}',
    //                                 objectPermission: '{objectPermissions}'
    //                             }
    //                         }]
    //                     }, {
    //                         xtype: 'button',
    //                         ui: 'tool-text-sm normal',
    //                         margin: '0 12 8',
    //                         enableToggle: true,
    //                         bind: {
    //                             text: '{cargoAdvanced ? "Hide advanced" : "Show advanced"}',
    //                             iconCls: '{cargoAdvanced ? "md-icon-outlined md-icon-unfold-less" : "md-icon-outlined md-icon-unfold-more"}',
    //                         },
    //                         handler: function () {
    //                             let advancedMode = this.upVM().get('cargoAdvanced');

    //                             if (advancedMode) {
    //                                 this.upVM().set('cargoAdvanced', false);
    //                             } else {
    //                                 this.upVM().set('cargoAdvanced', true);
    //                             }
    //                         }
    //                     }
    //                 ]
    //             }, {
    //                 xtype: 'container',
    //                 cls: 'a-portcall-extra',
    //                 slug: 'portCallCrewingAttachments',
    //                 hidden: true,
    //                 bind: {
    //                     hidden: '{relatedDocuments.length ? false : true}'
    //                 },
    //                 items: [{
    //                         xtype: 'container',
    //                         cls: 'a-titlebar',
    //                         items: [{
    //                             xtype: 'title',
    //                             title: 'Related documents'
    //                         }]
    //                     },
    //                     {
    //                         xtype: 'list',
    //                         cls: 'a-attachments-list',
    //                         deselectable: false,
    //                         layout: {
    //                             type: 'hbox',
    //                             wrap: true
    //                         },
    //                         itemConfig: {
    //                             cls: 'a-attachment-item',
    //                             minWidth: 0,
    //                             layout: {
    //                                 type: 'hbox',
    //                                 pack: 'space-between'
    //                             },
    //                         },
    //                         bind: {
    //                             store: '{relatedDocuments}',
    //                             itemTpl: '{itemTemplate}',
    //                         },
    //                         listeners: {
    //                             click: {
    //                                 element: 'element',
    //                                 delegate: 'a.file_name,i.remove_attachment',
    //                                 fn: function (cmp, a) {
    //                                     let ids = [],
    //                                         object_record = this.component.upVM().get('object_record'),
    //                                         cdbStore = this.component.upVM().get('organizations'),
    //                                         userPermissions = this.component.upVM().get('userPermissions'),
    //                                         allDocuments = this.component.upVM().get('allDocuments'),
    //                                         cargo_id = this.component.upVM().get('selectedCargo.selection').get('id'),
    //                                         selectedFile = this.component.getSelection();

    //                                     // allDocuments.forEach(function (document) {
    //                                     //     if (document.getDocumentData().get('cargo_id') == cargo_id &&
    //                                     //         file.get('id') == document.get('id')) {
    //                                     //         selectedFile = document;
    //                                     //     }
    //                                     // });

    //                                     if (cmp.currentTarget.className == 'file_name') {
    //                                         if (selectedFile) {
    //                                             let store = Ext.create('Abraxa.store.adocs.Documents');
    //                                             let editor = Ext.create('Abraxa.view.adocs.DocumentEditor', {
    //                                                 viewModel: {
    //                                                     data: {
    //                                                         document_type: 'cargo',
    //                                                         object_record: object_record,
    //                                                         cargoes: object_record.cargoes(),
    //                                                         organizations: cdbStore,
    //                                                         userPermissions: userPermissions,
    //                                                         selectedRecord: selectedFile,
    //                                                         allDocuments: Ext.create('Ext.data.Store', {
    //                                                             data: allDocuments
    //                                                         }),
    //                                                         nonEditable: this.component.upVM().get('nonEditable')
    //                                                     },
    //                                                     stores: {
    //                                                         pages: {
    //                                                             source: '{selectedDocument.selection.pages}',
    //                                                             extraParams: {
    //                                                                 document_id: '{selectedDocument.selection.id}'
    //                                                             }
    //                                                         }
    //                                                     },
    //                                                     formulas: {
    //                                                         documentData: {
    //                                                             bind: {
    //                                                                 bindTo: '{selectedDocument.selection}',
    //                                                                 deep: true
    //                                                             },
    //                                                             get: function (record) {
    //                                                                 if (record) {
    //                                                                     return record.getDocumentData();
    //                                                                 }
    //                                                             }
    //                                                         },
    //                                                         isLocked: {
    //                                                             bind: {
    //                                                                 bindTo: '{selectedDocument.selection}',
    //                                                                 deep: true
    //                                                             },
    //                                                             get: function (record) {
    //                                                                 if (record) {
    //                                                                     let store = Ext.getCmp("main-viewport").getViewModel().get('userPermissions');
    //                                                                     if (store && Object.keys(store).length > 0) {
    //                                                                         let permissionRecord = store['portcall'];
    //                                                                         if (permissionRecord && permissionRecord.edit) {
    //                                                                             let folderDocument = record.getDocumentAdocsDocumentFolderFile();
    //                                                                             return !folderDocument.get('status') || folderDocument.get('status').toLowerCase() == "draft" ? false : true;
    //                                                                         }
    //                                                                     }
    //                                                                     return true;
    //                                                                 }
    //                                                             }
    //                                                         }
    //                                                     }
    //                                                 }
    //                                             });
    //                                             store.setData(allDocuments);
    //                                             store.setGrouper({
    //                                                 groupFn: function (record) {
    //                                                     return record.getDocumentData().get('cargo_id');
    //                                                 }
    //                                             });
    //                                             store.filter({
    //                                                 filterFn: function (record) {
    //                                                     return record.getDocumentData().get('cargo_id') == selectedFile.getDocumentData().get('cargo_id');
    //                                                 }
    //                                             });
    //                                             store.each(function (value, index) {
    //                                                 if (value.pages()) {
    //                                                     value.pages().getProxy().setExtraParams({
    //                                                         document_id: value.get('id')
    //                                                     });
    //                                                     value.pages().load();
    //                                                 }
    //                                             })
    //                                             editor.getVM().set('documents', store);
    //                                             editor.getVM().set('document_type', 'cargo');
    //                                             editor.show();
    //                                         }
    //                                     }
    //                                     // if (cmp.currentTarget.className.indexOf('remove_attachment') !== -1) {
    //                                     //     if (selectedFile) {
    //                                     //         selectedFile.erase();
    //                                     //     }
    //                                     // }
    //                                 }
    //                             },
    //                         },
    //                     }
    //                 ]
    //             }, {
    //                 xtype: 'container',
    //                 cls: 'a-portcall-extra a-private-tasks',
    //                 hidden: true,
    //                 slug: 'task',
    //                 bind: {
    //                     hidden: '{objectTasks.count ? false : true}',
    //                     permission: '{userPermissions}',
    //                 },
    //                 items: [{
    //                     xtype: 'container',
    //                     cls: 'a-titlebar',
    //                     items: [{
    //                         xtype: 'title',
    //                         title: '<div><span class="a-panel-title">Tasks</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>'
    //                     }]
    //                 }, {
    //                     xtype: 'tasks.list',
    //                     minHeight: 120,
    //                     bind: {
    //                         store: '{objectTasks}'
    //                     }
    //                 }]
    //             },
    //             {
    //                 xtype: 'container',
    //                 cls: 'a-portcall-extra a-private-comments',
    //                 slug: 'portcallSupplyComments',
    //                 bind: {
    //                     permission: '{userPermissions}',
    //                 },
    //                 items: [{
    //                     xtype: 'container',
    //                     cls: 'a-titlebar',
    //                     items: [{
    //                         xtype: 'title',
    //                         title: '<div><span class="a-panel-title">Notes</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>'
    //                     }]
    //                 }, {
    //                     xtype: 'comments',
    //                     minHeight: 120,
    //                     bind: {
    //                         store: '{comments}'
    //                     }
    //                 }]
    //             },
    //             {
    //                 xtype: 'comments.input',
    //                 docked: 'bottom',
    //                 slug: 'portcallSupplyComments',
    //                 bind: {
    //                     permission: '{userPermissions}',
    //                     hidden: '{object_record.is_archived ? true : false}',
    //                     viewModel: {
    //                         data: {
    //                             comments: '{comments}',
    //                             record: '{selectedCargo.selection}'
    //                         }
    //                     }
    //                 }
    //             }
    //         ]
    //     },
    // ],
});
