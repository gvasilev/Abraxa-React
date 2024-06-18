Ext.define('Abraxa.view.adocs.CargoDocumentForm', {
    extend: 'Ext.Dialog',
    xtype: 'adocs.cargo.document.form',
    testId: 'adocsCargoDocDialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    controller: 'document.controller',
    width: 580,
    padding: 0,
    minHeight: 400,
    maxHeight: 860,
    scrollable: 'y',
    closable: true,
    draggable: false,
    title: '<div class="a-badge a-badge-cargo"><i></i></div>New cargo documents',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'formpanel',
            testId: 'adocsCargoDocForm',
            maxWidth: 430,
            margin: '0 0 0 72',
            defaults: {
                ui: 'classic hovered-border',
                labelAlign: 'left',
                labelWidth: 120,
            },
            items: [
                {
                    xtype: 'form.error',
                    testId: 'adocsCargoDocFormErr',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    showAnimation: 'fadeIn',
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
                    testId: 'adocsCargoDocFolderField',
                    cls: 'a-field-icon icon-folder icon-rounded',
                    placeholder: 'Choose folder',
                    value: 'My Documents',
                    disabled: true,
                    ui: 'viewonly classic hovered-border',
                },
                {
                    xtype: 'selectfield',
                    editable: false,
                    label: 'Cargoes',
                    testId: 'adocsCargoDocCargoesField',
                    labelAlign: 'left',
                    labelWidth: 120,
                    multiSelect: true,
                    forceSelection: true,
                    reference: 'documentsSelectedCargoes',
                    valueField: 'id',
                    displayField: 'commodity',
                    displayTpl: '{quantity:number("0,000.###")}{unit} - {commodity}',
                    itemTpl: '{quantity:number("0,000.###")}{unit} - {commodity}',
                    placeholder: 'Choose cargoes',
                    required: true,
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    chipView: {
                        xtype: 'chipview',
                        displayTpl: '{quantity:number("0,000.###")}{unit} - {commodity}',
                    },
                    bind: {
                        store: '{object_record.nomination.cargoes}',
                    },
                },
                {
                    xtype: 'selectfield',
                    editable: false,
                    label: 'Documents',
                    testId: 'adocsCargoDocDocumentsField',
                    labelAlign: 'left',
                    labelWidth: 120,
                    multiSelect: true,
                    forceSelection: true,
                    valueField: 'id',
                    displayField: 'name',
                    itemTpl: '{name}',
                    placeholder: 'Choose document types',
                    reference: 'selectedDocumentTypes',
                    required: true,
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-file icon-rounded',
                    listeners: {
                        expand: function () {
                            this.getStore().clearFilter();
                            this.getStore().addFilter(function (record) {
                                return record.get('category').type == 'cargo';
                            });
                        },
                    },
                    bind: {
                        store: '{documentTypes}',
                    },
                    chipView: {
                        xtype: 'chipview',
                        displayTpl: '{name}',
                    },
                },
                {
                    xtype: 'checkbox',
                    boxLabel: 'Combine manifest',
                    testId: 'adocsCargoDocCombineManifestCheckbox',
                    ui: 'large',
                    margin: '6 0 6 146',
                    hidden: true,
                    reference: 'combineCargoes',
                    publishes: ['checked'],
                    bind: {
                        hidden: '{!showCombined && selectedCargoes > 1 ? false : true}',
                    },
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
                testId: 'adocsCargoDocFormCancelBtn',
                margin: '0 8',
                handler: function () {
                    this.up('dialog').close();
                },
            },
            {
                xtype: 'button',
                text: 'Create',
                testId: 'cargoDocumentFormCreateButton',
                enableToggle: true,
                ui: 'action loading',
                handler: function (cmp) {
                    let form = this.up('dialog').down('formpanel');

                    if (form.validate()) {
                        form.down('form\\.error').hide();
                        this.up('dialog').getController().generateCargoDocs(cmp);
                    } else {
                        form.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
                    }
                },
            },
        ],
    },
});
