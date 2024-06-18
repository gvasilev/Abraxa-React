Ext.define('Abraxa.view.settings.company.VerifyCompany', {
    extend: 'Ext.Dialog',
    xtype: 'settings.verify.company',
    cls: 'a-dialog-create a-dialog-create-portcall a-dialog-has-icon',
    manageBorders: false,
    minWidth: 640,
    maxWidth: 640,
    maxHeight: 860,
    height: '90%',
    showAnimation: 'pop',
    padding: 0,
    layout: 'vbox',
    controller: 'settings.verifycontroller',
    tools: {
        close: {
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    },
    title: '<i class="material-icons c-grey" style="margin: 8px 16px 8px 0;">verified_user</i><span>Company verification</span>',
    draggable: false,
    maximizable: false,
    maximized: false,
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
            id: 'dropped-container-create',
            cls: 'a-drop-container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            scrollable: 'y',
                            flex: 1,
                            cls: 'general_data_container a-dialog-wrap',
                            items: [
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            margin: '8 0 8 40',
                                            ui: 'field-xl no-border classic',
                                            label: false,
                                            clearable: false,
                                            placeholder: 'Company name',
                                            bind: {
                                                value: '{record.company_name}',
                                            },
                                            disabled: true,
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-dialog-form a-general-form',
                                            defaults: {
                                                clearable: false,
                                                labelAlign: 'left',
                                                ui: 'classic hovered-border',
                                                required: true,
                                            },
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    label: 'Registered name',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    placeholder: 'Enter register name',
                                                    bind: {
                                                        value: '{record.registered_name}',
                                                    },
                                                },
                                                {
                                                    xtype: 'abraxa.emailfield',
                                                    label: 'Company e-mail',
                                                    placeholder: 'Company email address',
                                                    cls: 'a-field-icon icon-rounded icon-email',
                                                    disabled: true,
                                                    bind: {
                                                        value: '{record.company_email}',
                                                    },
                                                },
                                                {
                                                    xtype: 'country.combo',
                                                    label: 'Country',
                                                    placeholder: 'Choose country',
                                                    cls: 'a-field-icon icon-rounded icon-public',
                                                    bind: {
                                                        value: '{record.country}',
                                                    },
                                                    triggers: {
                                                        search: false,
                                                    },
                                                    listeners: {
                                                        change: function (el, countryId, oldValue) {
                                                            let cityStore = Ext.getStore('cityStore');
                                                            if (countryId) {
                                                                cityStore
                                                                    .getProxy()
                                                                    .setUrl(
                                                                        Env.ApiEndpoint +
                                                                            'countries/' +
                                                                            countryId +
                                                                            '/cities'
                                                                    );
                                                                cityStore.load();
                                                            } else {
                                                                el.upVM().get('record').set('city', null);
                                                                el.upVM().get('record').set('city_name', null);
                                                            }
                                                        },
                                                        select: function (el, selection) {
                                                            this.upVM()
                                                                .get('record')
                                                                .set('country_name', selection.get('country_name'));
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'city.combo',
                                                    label: 'City',
                                                    placeholder: 'Enter city',
                                                    // required: false,
                                                    disabled: false,
                                                    cls: 'a-field-icon icon-rounded icon-location_city',
                                                    triggers: {
                                                        search: false,
                                                    },
                                                    bind: {
                                                        value: '{record.city}',
                                                    },
                                                    listeners: {
                                                        select: function (el, selection) {
                                                            this.upVM()
                                                                .get('record')
                                                                .set('city_name', selection.get('city_name'));
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'Full registered address',
                                                    cls: 'a-field-icon icon-rounded icon-location',
                                                    placeholder: 'Enter register address',
                                                    bind: {
                                                        value: '{record.full_registered_address}',
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'VAT number  ',
                                                    cls: 'a-field-icon icon-rounded icon-money',
                                                    placeholder: 'Enter VAT number',
                                                    bind: {
                                                        value: '{record.vat_number}',
                                                    },
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
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-titlebar',
                                                    items: [
                                                        {
                                                            xtype: 'div',
                                                            id: 'trigger_contact',
                                                            cls: 'a-collapsible-title a-collapsible-trigger',
                                                            html: '<span>Contact person</span>',
                                                            listeners: {
                                                                click: {
                                                                    element: 'element',
                                                                    fn: function fn() {
                                                                        Ext.getCmp('collapsible_contact').toggleCls(
                                                                            'is-collapsed'
                                                                        );
                                                                        Ext.getCmp('trigger_contact').toggleCls(
                                                                            'is-collapsed'
                                                                        );
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    id: 'collapsible_contact',
                                                    cls: 'a-collapsible-container a-dialog-form a-general-form',
                                                    defaults: {
                                                        clearable: false,
                                                        labelAlign: 'left',
                                                        ui: 'classic hovered-border',
                                                        required: true,
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'First name',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            placeholder: 'Enter first name',
                                                            bind: {
                                                                value: '{record.contact_first_name}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Last name',
                                                            placeholder: 'Enter last name',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            bind: {
                                                                value: '{record.contact_last_name}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Position held',
                                                            placeholder: 'Position held',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            bind: {
                                                                value: '{record.contact_position}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'abraxa.emailfield',
                                                            label: 'Email',
                                                            placeholder: 'Enter email address',
                                                            cls: 'a-field-icon icon-rounded icon-email',
                                                            bind: {
                                                                value: '{record.contact_email}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'abraxa.phonefield',
                                                            label: 'Phone',
                                                            placeholder: 'Enter phone number',
                                                            cls: 'a-field-icon icon-rounded icon-phone',
                                                            bind: {
                                                                value: '{record.contact_phone}',
                                                            },
                                                        },
                                                    ],
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
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-titlebar',
                                                    items: [
                                                        {
                                                            xtype: 'div',
                                                            id: 'trigger_file',
                                                            cls: 'a-collapsible-title a-collapsible-trigger',
                                                            html: '<span>Attach file (document)</span>',
                                                            listeners: {
                                                                click: {
                                                                    element: 'element',
                                                                    fn: function fn() {
                                                                        Ext.getCmp('collapsible_file').toggleCls(
                                                                            'is-collapsed'
                                                                        );
                                                                        Ext.getCmp('trigger_file').toggleCls(
                                                                            'is-collapsed'
                                                                        );
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    id: 'collapsible_file',
                                                    cls: 'a-collapsible-container a-dialog-form a-general-form',
                                                    items: [
                                                        {
                                                            xtype: 'div',
                                                            html: '<p class="text-info">Please attach a document verifying your registered name & address.</p>',
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            cls: 'a-attachments-wrap',
                                                            style: 'padding: 16px 0 0',
                                                            bind: {
                                                                hidden: '{file ? false:true}',
                                                                data: '{file}',
                                                            },
                                                            tpl: '<div class="a-attachment-item" style="margin:0; padding: 8px; max-width:50%;"><div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{ext}"></div><div><a class="file_name" href="javascript:void(0);">{firstName} </a><span class="sm-title">{size}</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div></div>',
                                                            listeners: {
                                                                click: {
                                                                    element: 'element',
                                                                    delegate: 'i.remove_attachment',
                                                                    fn: function (cmp, a) {
                                                                        this.component.upVM().set('file', null);
                                                                        this.component.upVM().set('uploadedFile', null);
                                                                        this.component
                                                                            .up('dialog')
                                                                            .down('filebutton')
                                                                            .setValue(null);
                                                                    },
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'filebutton',
                                                            ui: 'default outlined',
                                                            text: 'Browse',
                                                            bind: {
                                                                hidden: '{file ? true:false}',
                                                            },
                                                            accept: '.pdf,.doc,.docs,.xls,.xlsx,.txt,.zip,.jpeg,.pjpeg,.jpeg,.pjpeg,.png,.gif',
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
                                                                            totalSize = 0;

                                                                        for (var i = 0; i < len; i++) {
                                                                            totalSize += files.item(i).size;
                                                                            ext = files.item(i).name.split('.').pop();
                                                                            let record = {
                                                                                ext: ext,
                                                                                firstName: files
                                                                                    .item(i)
                                                                                    .name.split('.')
                                                                                    .shift(),
                                                                                file: files.item(i),
                                                                                size:
                                                                                    (totalSize / 1024 / 1024).toFixed(
                                                                                        2
                                                                                    ) + 'MB',
                                                                            };
                                                                            me.upVM().set('file', record);
                                                                            me.upVM().set(
                                                                                'uploadedFile',
                                                                                files.item(i)
                                                                            );
                                                                        }
                                                                        if (totalSize > 10 * 1024 * 1024) {
                                                                            Ext.Msg.warning(
                                                                                'Upload Cancelled',
                                                                                'Your file(s) payload size (' +
                                                                                    (totalSize / 1024 / 1024).toFixed(
                                                                                        2
                                                                                    ) +
                                                                                    ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                                                                                    '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />'
                                                                            );
                                                                            return;
                                                                        }
                                                                    } else {
                                                                        fileField = document.getElementById(me.getId());
                                                                        // get the file upload parent element
                                                                        parentNod = fileField.parentNode;
                                                                        // create new element
                                                                        tmpForm = document.createElement('form');
                                                                        parentNod.replaceChild(tmpForm, fileField);
                                                                        tmpForm.appendChild(fileField);
                                                                        tmpForm.reset();
                                                                        parentNod.replaceChild(fileField, tmpForm);
                                                                    }
                                                                },
                                                            },
                                                        },
                                                    ],
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
                                            margin: '24 0 24 40',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            items: [
                                                {
                                                    xtype: 'checkboxfield',
                                                    boxLabel: "I'm authorized to validate the above company",
                                                    ui: 'large',
                                                    name: 'user_authorize',
                                                    value: true,
                                                    bind: {
                                                        checked: '{record.authorize}',
                                                    },
                                                    required: true,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
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
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function (me) {
                    me.up('dialog').destroy();
                },
            },
            {
                enableToggle: true,
                ui: 'action loading',
                text: 'Submit',
                handler: 'verify',
            },
        ],
    },
});
