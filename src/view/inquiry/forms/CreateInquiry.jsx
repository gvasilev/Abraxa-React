import '../../common/combo/Vessel';
import './PortsContainerController';
import '../agent/AttachmentContainer';
import '../agent/InstructionsContainer';
import '../../../core/components/fields/UnitField';
import '../../../core/components/fields/DateTimeField';

Ext.define('Abraxa.view.inquiry.forms.CreateInquiry', {
    xtype: 'inquiry.create',
    testId: 'inquiryCreateDialog',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-create-portcall a-dialog-has-icon',
    showAnimation: 'pop',
    minWidth: 640,
    maxWidth: 640,
    maxHeight: '90%',
    layout: 'vbox',
    // scrollable: 'y',
    draggable: false,
    padding: 0,
    controller: 'inquiry-controller',
    tools: {
        back: {
            xtype: 'tool',
            margin: 0,
            ui: 'tool round',
            hidden: true,
            left: 16,
            bind: {
                hidden: '{visibleInstruction ? false : true}',
            },
            cls: 'backTool',
            iconCls: 'md-icon-keyboard-backspace',
            handler: function (me) {
                me.down('[xtype=inquiry\\.instructions\\.container]').hide();
                me.upVM().set('visibleInstruction', false);
                if (me.down('[itemId=showVoyageInstructions]').getPressed()) {
                    me.down('[itemId=showVoyageInstructions]').toggle();
                }
            },
        },
        close: {
            tooltip: {
                showOnTap: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function () {
                let dialog = this.up('dialog'),
                    record = this.upVM().get('object_record');
                if (record.phantom || record.dirty || record.cargoes().needsSync) {
                    Ext.Msg.confirm(
                        'Confirmation',
                        'Would you like to discard all changes?',
                        function (answer) {
                            if (answer == 'yes') {
                                record.cargoes().rejectChanges();
                                record.reject();
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
                } else {
                    dialog.destroy();
                }
            },
        },
        showVoyageInstructions: {
            xtype: 'button',
            ui: 'round tool-sm toggle',
            enableToggle: true,
            text: '',
            itemId: 'showInstructionsButton',
            slug: 'portcallVoyInstructions',
            bind: {
                hidden: '{editMode}',
                // permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-description',
            cls: 'chameleon_create_portcall_attach_file',
            tooltip: {
                showOnTap: true,
                html: 'Voyage instructions',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            listeners: {
                tap: function (me, newValue) {
                    if (me.upVM().get('visibleInstruction')) {
                        me.up('dialog').down('[xtype=inquiry\\.instructions\\.container]').hide();
                        me.upVM().set('visibleInstruction', false);
                        if (me.getPressed()) {
                            me.toggle();
                        }
                    } else {
                        me.up('dialog').down('[xtype=inquiry\\.instructions\\.container]').show();
                        me.upVM().set('visibleInstruction', true);
                    }
                },
            },
        },
        attach: {
            xtype: 'filebutton',
            margin: '0 0 0 8',
            ui: 'round tool-sm toggle',
            text: '',
            slug: 'portcallCreateAttachments',
            bind: {
                hidden: '{editMode}',
                permission: '{userPermissions}',
            },
            accept: '.pdf,.doc,.docs,.xls,.xlsx,.txt,.zip,.jpeg,.pjpeg,.jpeg,.pjpeg,.png,.gif',
            iconCls: 'md-icon-attach-file',
            cls: 'chameleon_create_portcall_attach_file',
            tooltip: {
                showOnTap: true,
                html: 'Attach file',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            listeners: {
                change: function (me, newValue) {
                    if (newValue) {
                        var files = this.getFiles(),
                            len = files.length,
                            ext,
                            fileStore = me.upVM().get('files'),
                            totalSize = 0;

                        let size = function (size) {
                            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                            if (size == 0) return '0 Byte';
                            var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
                            return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
                        };

                        for (var i = 0; i < len; i++) {
                            totalSize += files.item(i).size;
                        }
                        if (totalSize > 10 * 1024 * 1024) {
                            Ext.create('Ext.MessageBox', {
                                ui: 'warning',
                                title: 'Upload Cancelled',
                                innerCls: 'a-bgr-white',
                                message:
                                    'Your file(s) payload size (' +
                                    (totalSize / 1024 / 1024).toFixed(2) +
                                    ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                                    '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />',
                                width: 500,
                                dataTitle: 'Warning',
                                modal: true,
                                draggable: false,
                                bbar: {
                                    manageBorders: false,
                                    items: [
                                        '->',
                                        {
                                            xtype: 'button',
                                            ui: 'action',
                                            text: 'Ok',
                                            handler: function () {
                                                this.up('dialog').destroy();
                                            },
                                        },
                                    ],
                                },
                            }).show();
                            fileField = document.getElementById(me.id);
                            // get the file upload parent element
                            parentNod = fileField.parentNode;
                            // create new element
                            tmpForm = document.createElement('form');
                            parentNod.replaceChild(tmpForm, fileField);
                            tmpForm.appendChild(fileField);
                            tmpForm.reset();
                            parentNod.replaceChild(fileField, tmpForm);
                            document.querySelector("input[type='file']").value = '';
                            me.setValue(null);
                            return;
                        }
                        for (var i = 0; i < len; i++) {
                            ext = files.item(i).name.split('.').pop();
                            let record = {
                                ext: ext,
                                firstName: files.item(i).name.split('.').shift(),
                                file: files.item(i),
                                size: size(totalSize),
                            };
                            fileStore.add(record);
                        }
                    }
                    document.querySelector("input[type='file']").value = '';
                    me.setValue(null);
                },
            },
        },
    },
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'container',
            zIndex: '200',
            id: 'dropped-inquiry-create',
            cls: 'a-drop-container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    itemId: 'mainForm',
                    reference: 'createInquiryAgent',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-dialog-wrap',
                            defaults: {
                                labelAlign: 'left',
                                clearable: false,
                                ui: 'classic hovered-border',
                            },
                            items: [
                                {
                                    //General data
                                    xtype: 'vessel.combo',
                                    testId: 'vesselComboEnquiryCreate',
                                    margin: '0 40 -2 0',
                                    ui: 'field-xl no-border classic',
                                    itemId: 'vesselCombo',
                                    cls: 'a-field-icon icon-search vessel_combo_create',
                                    label: false,
                                    bind: {
                                        value: '{voyage_data.vessel_imo}',
                                        inputValue: '{voyage_data.vessel_name}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            me.focus();
                                            var record = me.upVM().get('voyage_data');
                                            if (record) {
                                                if (record.get('vessel_name')) {
                                                    me.setInputValue(record.get('vessel_name'));
                                                }
                                            }
                                        },
                                        select: function () {
                                            let selection = this.getSelection(),
                                                voyage_data = this.upVM().get('voyage_data');

                                            if (selection) {
                                                voyage_data.set({
                                                    vessel_id: selection.get('id'),
                                                    vessel_imo: selection.get('imo'),
                                                    vessel_name: selection.get('name'),
                                                });
                                                if (selection.get('company_id')) {
                                                    voyage_data.set({
                                                        custom_vessel_id: selection.get('id'),
                                                    });
                                                } else {
                                                    voyage_data.set({
                                                        custom_vessel_id: null,
                                                    });
                                                }
                                            }
                                        },
                                    },
                                    required: true,
                                },
                                {
                                    xtype: 'div',
                                    cls: 'divider mt-0',
                                    html: '',
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-dialog-form a-general-form',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            label: 'Enquiry ID',
                                            placeholder: 'Enter number',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            required: true,
                                            bind: {
                                                value: '{object_record.inquiry_id}',
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-field-assign',
                                            flex: 1,
                                            layout: 'hbox',
                                            slug: 'portcallAssignTo',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    cls: 'a-assign-image',
                                                    left: 203,
                                                    bind: {
                                                        html: '{assignedToImage}',
                                                    },
                                                },
                                                {
                                                    xtype: 'user.combo',
                                                    flex: 1,
                                                    label: 'Assign to',
                                                    placeholder: 'Choose assignee',
                                                    labelAlign: 'left',
                                                    reference: 'usersCombo',
                                                    ui: 'classic hovered-border non-editable',
                                                    clearable: true,
                                                    bind: {
                                                        cls: '{usersCombo.selection ? "a-field-icon icon-rounded":"a-field-icon icon-person icon-rounded"}',
                                                        value: '{object_record.assigned_to}',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'organization.combo',
                                            testId: 'requestingCompanyComboEnquiryCreate',
                                            label: 'Requesting party',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-business-center icon-rounded',
                                            placeholder: 'Choose Company',
                                            required: true,
                                            floatedPicker: {
                                                minWidth: 308,
                                            },
                                            bind: {
                                                value: '{object_record.requesting_party_id}',
                                                inputValue: '{object_record.requesting_party_name}',
                                            },
                                            listeners: {
                                                select: function () {
                                                    let selection = this.getSelection(),
                                                        record = this.upVM().get('object_record');
                                                    record.set('requesting_party_name', selection.get('org_name'));
                                                    record.set('requesting_party_email', selection.get('org_email'));
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            labelAlign: 'left',
                                            label: 'Voy. number',
                                            placeholder: 'Voyage number',
                                            bind: {
                                                value: '{object_record.voyage_number}',
                                            },
                                        },
                                        {
                                            xtype: 'common-combo-currency',
                                            placeholder: 'Currency',
                                            labelAlign: 'left',
                                            label: 'Preferred currency',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-money icon-rounded',
                                            matchFieldWidth: true,
                                            required: true,
                                            bind: {
                                                value: '{object_record.currency}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'div',
                                    cls: 'divider',
                                    html: '',
                                },
                                {
                                    xtype: 'container',
                                    controller: 'portsContainerController',
                                    cls: 'a-dialog-form a-general-form',
                                    items: [
                                        {
                                            xtype: 'abraxa.datetimefield',
                                            testId: 'abraxaDatefieldCreateEnquiry',
                                            label: 'ETA',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-time icon-rounded',
                                            bind: {
                                                dateTime: '{object_record.port_eta}',
                                            },
                                            required: true,
                                            listeners: {
                                                focusleave: function (me) {
                                                    var record = this.upVM().get('object_record');
                                                    record.set({
                                                        port_eta: me.getValue(),
                                                    });
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            items: [
                                                {
                                                    xtype: 'ports.served.combo',
                                                    testId: 'portServedComboInquiryCreate',
                                                    label: 'Port',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-port icon-rounded',
                                                    required: true,
                                                    flex: 1,
                                                    placeholder: 'Choose port',
                                                    bind: {
                                                        value: '{firstPort.port_id}',
                                                    },
                                                    listeners: {
                                                        painted: function (me) {
                                                            me.setError(false);
                                                            if (this.upVM().get('firstPort')) {
                                                                let record = this.upVM().get('firstPort');
                                                                if (record) {
                                                                    this.setValue(record.get('id'));
                                                                }
                                                            }
                                                        },
                                                        select: function () {
                                                            if (this.getSelection()) {
                                                                let record = this.upVM().get('firstPort');
                                                                if (record) {
                                                                    record.set(
                                                                        'name',
                                                                        this.getSelection().get('port_name')
                                                                    );
                                                                }
                                                            }
                                                        },
                                                        beforequery: 'filterComboStore',
                                                    },
                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'md-icon-add-circle-outline',
                                                    margin: '0 0 0 8',
                                                    arrow: false,
                                                    focusable: false,
                                                    ui: 'tool-sm normal round',
                                                    tooltip: {
                                                        anchorToTarget: true,
                                                        html: 'Add alternative ports',
                                                        align: 'bc-tc?',
                                                        showDelay: 0,
                                                        hideDelay: 0,
                                                        dismissDelay: 0,
                                                        allowOver: false,
                                                        closeAction: 'destroy',
                                                    },
                                                    handler: function (me) {
                                                        me.upVM().get('object_record').ports().add({});
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            hidden: true,
                                            bind: {
                                                hidden: '{additionalPortsFiltered.count ? false:true}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'list',
                                                    bind: {
                                                        store: '{additionalPortsFiltered}',
                                                    },
                                                    itemConfig: {
                                                        viewModel: true,
                                                        xtype: 'container',
                                                        // padding: '8 0',
                                                        layout: {
                                                            type: 'hbox',
                                                            align: 'middle',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'ports.served.combo',
                                                                label: 'Port',
                                                                labelAlign: 'left',
                                                                ui: 'classic hovered-border',
                                                                cls: 'a-field-icon icon-port icon-rounded',
                                                                required: true,
                                                                flex: 1,
                                                                placeholder: 'Choose port',
                                                                bind: {
                                                                    value: '{record.port_id}',
                                                                },
                                                                listeners: {
                                                                    painted: function (me) {
                                                                        me.setError(false);
                                                                    },
                                                                    select: function () {
                                                                        if (this.getSelection()) {
                                                                            let record = this.upVM().get('record');
                                                                            record.set(
                                                                                'name',
                                                                                this.getSelection().get('port_name')
                                                                            );
                                                                        }
                                                                    },
                                                                    beforequery: 'filterComboStore',
                                                                },
                                                            },
                                                            {
                                                                xtype: 'button',
                                                                margin: '0 0 0 8',
                                                                arrow: false,
                                                                focusable: false,
                                                                iconCls: 'md-icon-remove-circle-outline',
                                                                ui: 'tool-sm round',
                                                                tooltip: {
                                                                    anchorToTarget: true,
                                                                    html: 'Delete',
                                                                    align: 'bc-tc?',
                                                                    showDelay: 0,
                                                                    hideDelay: 0,
                                                                    dismissDelay: 0,
                                                                    allowOver: false,
                                                                    closeAction: 'destroy',
                                                                },
                                                                handler: function (me) {
                                                                    Ext.Msg.confirm(
                                                                        'Delete',
                                                                        'Are you sure you would like to delete this row?',
                                                                        function (answer) {
                                                                            if (answer != 'yes') return;
                                                                            let viewModel = me.upVM();
                                                                            let record = me.upVM().get('record');

                                                                            // Remove record from main store
                                                                            viewModel
                                                                                .get('object_record')
                                                                                .ports()
                                                                                .remove(record);
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
                                                                                ui: 'decline alt',
                                                                                text: 'Delete',
                                                                            },
                                                                        ]
                                                                    );
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'Port function',
                                            testId: 'portFunctionComboInquiryCreate',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            required: true,
                                            forceSelection: true,
                                            placeholder: 'Function',
                                            queryMode: 'local',
                                            valueField: 'name',
                                            displayField: 'name',
                                            bind: {
                                                value: '{object_record.port_function}',
                                            },
                                            store: {
                                                type: 'berth.function',
                                            },
                                        },
                                        {
                                            xtype: 'selectfield',
                                            testId: 'agencyTypeComboInquiryCreate',
                                            label: 'Agency type',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            placeholder: 'Choose agency type',
                                            autoFocus: false,
                                            valueField: 'id',
                                            displayField: 'name',
                                            valueField: 'id',
                                            disabled: false,
                                            required: true,
                                            store: {
                                                type: 'agency.types',
                                            },
                                            bind: {
                                                value: '{object_record.agency_type_id}',
                                            },
                                            listeners: {
                                                select: function () {
                                                    let selection = this.getSelection(),
                                                        record = this.upVM().get('object_record');
                                                    record.set('agency_type_name', selection.get('name'));
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    // Cargo data
                                    xtype: 'container',
                                    cls: 'a-dialog-form-list',
                                    items: [
                                        {
                                            xtype: 'abraxa.formlist',
                                            scrollable: false,
                                            itemId: 'createCargo',
                                            variableHeights: true,
                                            bind: {
                                                store: {
                                                    bindTo: '{object_record.cargoes}',
                                                    deep: true,
                                                },
                                            },
                                            itemConfig: {
                                                xtype: 'container',
                                                cls: 'a-cargo-item',
                                                viewModel: {
                                                    data: {
                                                        showReceiver: true, // Means false it is reversely mistaken everywhere, true means false for show Receiver and vice versa. Must correct carefully
                                                    },
                                                    formulas: {
                                                        recordIndex: function recordIndex(get) {
                                                            var store = get('object_record.cargoes');
                                                            if (store) {
                                                                return store.indexOf(get('record'));
                                                            }
                                                        },
                                                    },
                                                },
                                                items: [
                                                    {
                                                        xtype: 'container',
                                                        items: [
                                                            {
                                                                xtype: 'container',
                                                                cls: 'a-titlebar',
                                                                items: [
                                                                    {
                                                                        xtype: 'title',
                                                                        cls: 'a-title-md',
                                                                        margin: '0 0 0 -8',
                                                                        bind: {
                                                                            title: "<span class='a-cargo-title'>Cargo {recordIndex + 1}</span>",
                                                                        },
                                                                    },
                                                                    {
                                                                        xtype: 'container',
                                                                        margin: '0 -16 0 0',
                                                                        cls: 'a-tools',
                                                                        items: [
                                                                            {
                                                                                xtype: 'button',
                                                                                iconCls: 'md-icon-close',
                                                                                ui: 'round tool-sm',
                                                                                arrow: false,
                                                                                slug: 'portcallCargoDelete',
                                                                                bind: {
                                                                                    permission: '{userPermissions}',
                                                                                },
                                                                                tooltip: {
                                                                                    showOnTap: true,
                                                                                    html: 'Remove',
                                                                                    align: 'bc-tc?',
                                                                                    showDelay: 0,
                                                                                    hideDelay: 0,
                                                                                    dismissDelay: 0,
                                                                                    allowOver: false,
                                                                                    closeAction: 'destroy',
                                                                                },
                                                                                handler: function handler(me) {
                                                                                    me.up('dialog')
                                                                                        .down('[itemId=createCargo]')
                                                                                        .getStore()
                                                                                        .remove(
                                                                                            this.upVM().get('record')
                                                                                        );
                                                                                },
                                                                            },
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-cargo-form',
                                                        defaults: {
                                                            labelAlign: 'left',
                                                            ui: 'classic hovered-border',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'unit.field',
                                                                decimals: 3,
                                                                placeholder: '0000.00',
                                                                required: true,
                                                                slug: 'portcallCargoGeneral',
                                                                cls: 'a-field-icon icon-short icon-rounded',
                                                                label: 'Quantity',
                                                                bind: {
                                                                    value: '{record.quantity}',
                                                                    valueUnit: '{record.unit}',
                                                                    // permission: '{userPermissions}',
                                                                    options: '{defaultCargoUnits}',
                                                                },
                                                            },
                                                            {
                                                                xtype: 'commodity.combo',
                                                                label: 'Commodity',
                                                                required: true,
                                                                clearable: true,
                                                                valueField: 'id',
                                                                displayField: 'name',
                                                                placeholder: 'Choose commodity',
                                                                cls: 'a-field-icon icon-short icon-rounded',
                                                                slug: 'portcallCargoGeneral',
                                                                floatedPicker: {
                                                                    minWidth: 220,
                                                                },
                                                                triggers: {
                                                                    search: null,
                                                                },
                                                                bind: {
                                                                    value: '{record.commodity_id}',
                                                                    permission: '{userPermissions}',
                                                                },
                                                                listeners: {
                                                                    change: function (combo, value, eOpts) {
                                                                        if (value && value != '') {
                                                                            // All cargoes as cargoes array
                                                                            var allCargoesRecord = combo
                                                                                .upVM()
                                                                                .get('record');
                                                                            var selection = combo.getSelection();
                                                                            if (selection) {
                                                                                var commodity_name =
                                                                                    selection.get('name');
                                                                                allCargoesRecord.set(
                                                                                    'commodity',
                                                                                    commodity_name
                                                                                );
                                                                            }
                                                                        }
                                                                    },
                                                                    painted: function () {
                                                                        let record = this.upVM().get('record');

                                                                        if (record.get('commodity')) {
                                                                            this.setInputValue(record.get('commodity'));
                                                                        }
                                                                    },
                                                                },
                                                            },
                                                            {
                                                                xtype: 'selectfield',
                                                                valueField: 'name',
                                                                displayField: 'name',
                                                                queryMode: 'local',
                                                                placeholder: 'Choose operation',
                                                                required: true,
                                                                cls: 'a-field-icon icon-short icon-rounded non-editable',
                                                                label: 'Operation',
                                                                slug: 'portcallCargoGeneral',
                                                                bind: {
                                                                    value: '{record.function}',
                                                                    // permission: '{userPermissions}'
                                                                },
                                                                options: [
                                                                    'Loading',
                                                                    'Discharging',
                                                                    'Transshipment',
                                                                    'Lightering',
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '8 0 8 32',
                                            text: 'Cargo',
                                            itemId: 'create-add-cargo',
                                            ui: 'normal small',
                                            iconCls: 'md-icon-add',
                                            cls: 'chameleong_create_portcall_add_cargo',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function handler(me) {
                                                mixpanel.track('Add cargo - create portcall');
                                                const createCargo = me.up('dialog').down('[itemId=createCargo]');
                                                const store = createCargo ? createCargo.getStore() : null;
                                                if (store) {
                                                    store.add({});
                                                } else {
                                                    Ext.Msg.warning(
                                                        ' Oops, Something went wrong.',
                                                        'Please refresh the page.'
                                                    );
                                                }
                                            },
                                        },
                                    ], // End cargo data
                                },
                            ],
                        },
                    ],
                }, //Attachments data
                {
                    xtype: 'inquiry.attachment.container',
                },
                //End attachments data
                //Instructions data
                {
                    xtype: 'inquiry.instructions.container',
                    flex: 1,
                },
            ],
            listeners: {
                element: 'element',
                drop: 'onDrop',
                dragleave: 'onDragLeaveListItem',
                dragover: 'onDragOverListItem',
            },
        },
    ],
    bbar: {
        items: [
            {
                xtype: 'notes.notify',
                viewModel: {
                    data: {
                        editMode: true,
                    },
                },
            },
            {
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function () {
                    let combo = this.upVM().get('targetCombo');
                    if (combo) {
                        combo.clearValue();
                        if (combo.getStore().soruce) {
                            combo.getStore().getSource().rejectChanges();
                        } else {
                            combo.getStore().rejectChanges();
                        }
                        combo.focus();
                    }
                    let record = this.upVM().get('object_record');
                    this.up('dialog').destroy();
                },
            },
            {
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                    hidden: '{visibleInstruction ? true:false}',
                },
                testId: 'createSaveEnquiryButton',
                enableToggle: true,
                ui: 'action loading',
                handler: 'onCreate',
            },
        ],
    },
});
