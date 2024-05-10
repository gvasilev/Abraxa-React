Ext.define('Abraxa.view.adocs.SofDocumentForm', {
    extend: 'Ext.Dialog',
    xtype: 'adocs.sof.document.form',
    cls: 'a-dialog-create a-dialog-has-icon',
    controller: 'document.controller',
    width: 580,
    padding: 0,
    minHeight: 460,
    border: false,
    maxHeight: '90%',
    scrollable: 'y',
    closable: true,
    draggable: false,
    title: '<div class="a-badge a-badge-sof"><i class="material-icons-outlined">timer</i></div>New Operational document',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: {
        stores: {
            cargoHoldsStore: {
                data: [],
            },
        },
    },
    items: [
        {
            xtype: 'formpanel',
            maxWidth: 470,
            margin: '0 0 0 72',
            defaults: {
                ui: 'classic hovered-border',
                labelAlign: 'left',
                labelWidth: 120,
            },
            items: [
                {
                    xtype: 'textfield',
                    ui: 'field-xl no-border classic',
                    cls: 'operational_document_name',
                    label: false,
                    placeholder: 'Document name',
                    required: true,
                    value: 'Statement of facts',
                    reference: 'documentName',
                    clearable: false,
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'start',
                    },
                    margin: '8 0',
                    items: [
                        {
                            xtype: 'label',
                            cls: 'c-blue-grey fs-13 mr-16',
                            width: 140,
                            html: 'Record',
                        },
                        {
                            xtype: 'div',
                            cls: 'a-note-subheader',
                            bind: {
                                html: '<div class="x-chip a-chip-app"><i class="md-icon-outlined">business_center</i><div class="x-text-el">{object_record.voyage.vessel_name} <span class="sm-title">({object_record.file_id})</span></div></div>',
                                hidden: '{object_record ? false : true}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'textfield',
                    label: 'Folder',
                    cls: 'a-field-icon icon-folder icon-rounded',
                    placeholder: 'Choose folder',
                    value: 'My Documents',
                    disabled: true,
                    ui: 'viewonly classic hovered-border',
                },
                {
                    xtype: 'selectfield',
                    label: 'Template',
                    cls: 'a-field-icon icon-description icon-rounded',
                    placeholder: 'Choose template',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    required: true,
                    value: 18,
                    reference: 'operationalTemplate',
                    bind: {
                        store: '{documentTypes}',
                    },
                    listeners: {
                        expand: function () {
                            this.getStore().clearFilter();
                            this.getStore().addFilter(function (record) {
                                return record.get('category').type == 'operational';
                            });
                        },
                        select: function (me, selection) {
                            Ext.ComponentQuery.query('[cls=operational_document_name]')[0].setValue(
                                selection.get('name')
                            );
                        },
                    },
                },
                {
                    //additional container for SOF template
                    xtype: 'container',
                    hidden: true,
                    bind: {
                        hidden: '{operationalTemplate.selection.id == 18 ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'divider divider-offset',
                            html: '',
                        },
                        {
                            xtype: 'abraxa.datefield',
                            label: 'Date',
                            name: 'document_date',
                            labelAlign: 'left',
                            cls: 'a-field-icon icon-date icon-rounded',
                            ui: 'classic hovered-border',
                            clearable: false,
                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                        },
                        {
                            xtype: 'textfield',
                            label: 'Place',
                            placeholder: 'Enter place',
                            labelAlign: 'left',
                            name: 'place',
                            cls: 'a-field-icon icon-place icon-rounded',
                            ui: 'classic hovered-border',
                        },
                        {
                            xtype: 'selectfield',
                            labelAlign: 'left',
                            label: 'Events grouping',
                            placeholder: 'Choose type',
                            name: 'event_group',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            value: 'type',
                            options: [
                                {
                                    value: 'type',
                                    text: 'Grouped working events',
                                },
                                {
                                    value: 'chronological',
                                    text: 'Chronological',
                                },
                            ],
                        },
                        {
                            xtype: 'selectfield',
                            labelAlign: 'left',
                            label: 'Date format',
                            name: 'time_format',
                            placeholder: 'Choose type',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            value: 1,
                            options: [
                                {
                                    value: 1,
                                    text: Ext.Date.format(new Date(), 'd M Y'),
                                },
                                {
                                    value: 2,
                                    text: Ext.Date.format(
                                        new Date(),
                                        AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading
                                    ),
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'divider divider-offset',
                            html: '',
                        },
                        {
                            xtype: 'container',
                            margin: '24 0',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'label',
                                    width: 164,
                                    html: 'Bunkers & Drafts',
                                },
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    name: 'include_bunkers',
                                    checked: true,
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            margin: '24 0',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'label',
                                    width: 164,
                                    html: 'Cargo details',
                                },
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    name: 'include_cargoes',
                                    checked: true,
                                },
                            ],
                        },
                    ],
                },
                {
                    //additional container for Stowage Plan template
                    xtype: 'container',
                    hidden: true,
                    bind: {
                        hidden: '{operationalTemplate.selection.id == 41 ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'divider divider-offset',
                            html: '',
                        },
                        {
                            xtype: 'selectfield',
                            labelAlign: 'left',
                            cls: 'a-field-icon icon-numbers icon-rounded',
                            ui: 'classic hovered-border',
                            clearable: false,
                            label: 'Number of holds',
                            name: 'number_of_holds',
                            displayField: 'value',
                            valueField: 'value',
                            value: 4,
                            margin: '0 0 12 0',
                            options: [
                                {
                                    value: 4,
                                },
                                {
                                    value: 5,
                                },
                                {
                                    value: 6,
                                },
                                {
                                    value: 7,
                                },
                            ],
                            listeners: {
                                select: function (cmp) {
                                    let cargoHoldsStore = this.upVM().get('cargoHoldsStore'),
                                        numberOfHolds = cmp.getValue();

                                    cargoHoldsStore.removeAll();

                                    for (let i = 0; i < numberOfHolds; i++) {
                                        cargoHoldsStore.add({});
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'abraxa.componentdataview',
                            bind: {
                                store: '{cargoHoldsStore}',
                            },
                            itemConfig: {
                                viewModel: {
                                    formulas: {
                                        recordIndex: function (get) {
                                            let store = get('cargoHoldsStore');

                                            return store.indexOf(get('record')) + 1;
                                        },
                                    },
                                },
                                xtype: 'container',
                                cls: 'border border-radius',
                                padding: 8,
                                margin: '0 0 12',
                                items: [
                                    {
                                        xtype: 'selectfield',
                                        labelAlign: 'left',
                                        labelMinWidth: 131,
                                        valueField: 'id',
                                        displayField: 'commodity',
                                        displayTpl: '{quantity:number("0,000.###")}{unit} - {commodity}',
                                        itemTpl: '{quantity:number("0,000.###")}{unit} - {commodity}',
                                        placeholder: 'Choose cargo',
                                        clearable: true,
                                        ui: 'classic hovered-border',
                                        cls: 'a-field-icon icon-short icon-rounded',
                                        bind: {
                                            label: 'Hold {recordIndex}',
                                            store: '{object_record.nomination.cargoes}',
                                        },
                                        listeners: {
                                            change: function (cmp) {
                                                let record = cmp.upVM().get('record'),
                                                    cargo = cmp.getSelection();

                                                if (cargo) {
                                                    cmp.up('container')
                                                        .down('abraxa\\.quantityunit')
                                                        .setUnit(cargo.get('unit'));
                                                    // cmp.up('container')
                                                    //     .down('abraxa\\.quantityunit')
                                                    //     .setReadOnlyUnit(true);
                                                    record.set('cargo_id', cargo.get('id'));
                                                } else {
                                                    cmp.up('container').down('abraxa\\.quantityunit').setUnit(null);
                                                    // cmp.up('container')
                                                    //     .down('abraxa\\.quantityunit')
                                                    //     .setReadOnlyUnit(false);
                                                    record.set('cargo_id', null);
                                                }
                                            },
                                            painted: function (cmp) {
                                                cmp.clearValue();
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'abraxa.quantityunit',
                                        label: 'Quantity',
                                        labelAlign: 'left',
                                        labelMinWidth: 131,
                                        ui: 'classic hovered-border',
                                        cls: 'a-field-icon icon-short icon-rounded',
                                        // required: true,
                                        bind: {
                                            options: '{defaultCargoUnits}',
                                            quantity: '{record.quantity}',
                                            unit: '{record.unit}',
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                text: 'Cancel',
                margin: '0 8',
                handler: function () {
                    this.up('dialog').close();
                },
            },
            {
                xtype: 'button',
                text: 'Create',
                testId: 'sofDocumentFormCreateButton',
                enableToggle: true,
                ui: 'action loading',
                handler: function (btn) {
                    let templateID = btn.upVM().get('operationalTemplate.selection.category.id');
                    if (templateID === 13) {
                        btn.up('dialog').getController().generateOperationalDocument(btn);
                    } else if (templateID === 14) {
                        btn.up('dialog').getController().generateStowagePlanDocument(btn);
                    } else {
                        btn.up('dialog').getController().generateSofDocument(btn);
                    }
                },
            },
        ],
    },
});
