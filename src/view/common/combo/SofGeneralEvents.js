Ext.define('Abraxa.view.common.combo.SofGeneralEvents', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'sof.general.events',
    valueField: 'id',
    displayField: 'name',
    minChars: 2,
    queryMode: 'local',
    anyMatch: true,
    typeAhead: false,
    forceSelection: true,
    matchFieldWidth: true,
    itemTpl:
        '<div class="hbox">' +
        '<span class="a-badge-sof sof-{type.category.name:lowercase}"></span>' +
        '<div><label class="sm-type">{type.category.name}</label>' +
        '<div class="sm-value">{name}</div></div>' +
        '</div>',
    floatedPicker: {
        cls: 'a-combo-sof-events',
        listeners: {
            painted: function () {
                this.setMinWidth(this.ownerCmp.getWidth());
            },
        },
    },

    // listeners: {
    //     expand: function () {
    //         let combo = this,
    //             pickerRecords = combo.getPicker().getItems(),
    //             buttonExists = pickerRecords.keys.indexOf('addSofEventButton');
    //         if (buttonExists === -1) {
    //             combo.getPicker().add({
    //                 xtype: 'container',
    //                 docked: 'bottom',
    //                 layout: 'hbox',
    //                 itemId: 'addSofEventButton',
    //                 flex: 1,
    //                 style: 'background-color:#fff',
    //                 items: [{
    //                     xtype: 'button',
    //                     margin: 4,
    //                     flex: 1,
    //                     text: 'Add Event',
    //                     ui: 'solid-normal btn-sm',
    //                     iconCls: 'md-icon-add',
    //                     handler: function (me) {
    //                         let dialog = this.up('dialog');
    //                         if (dialog) {
    //                             dialog.hide();
    //                         }
    //                         let modal = Ext.create('Abraxa.view.settings.library.sof.SofEventForm', {
    //                             viewModel: {
    //                                 parent: me.upVM(),
    //                                 data: {
    //                                     title: 'Create SOF event',
    //                                     editMode: false,
    //                                     record: Ext.create('Abraxa.model.sof.DefaultEvents', {})
    //                                 },
    //                                 stores: {
    //                                     defaultSofEventCategories: {
    //                                         type: 'sof-default-event-categories',
    //                                         autoLoad: true
    //                                     },
    //                                     defaultSofEventTypes: {
    //                                         type: 'sof-default-event-types',
    //                                         autoLoad: true
    //                                     },
    //                                     sofEvents: {
    //                                         type: 'sof-general-events',
    //                                         autoLoad: true
    //                                     },
    //                                 }
    //                             }
    //                         });
    //                         modal.show();
    //                         if (dialog) {
    //                             modal.on('destroy', function () {
    //                                 if (combo.getStore().source) {
    //                                     combo.getStore().getSource().reload();
    //                                 } else {
    //                                     combo.getStore().reload();
    //                                 }
    //                                 dialog.show();
    //                             })
    //                         } else {
    //                             modal.on('destroy', function () {
    //                                 if (combo.getStore().source) {
    //                                     combo.getStore().getSource().reload();
    //                                 } else {
    //                                     combo.getStore().reload();
    //                                 }
    //                                 combo.focus();
    //                                 combo.select();
    //                             })
    //                         }
    //                     }
    //                 }]
    //             });
    //         }
    //     }
    // }
});
