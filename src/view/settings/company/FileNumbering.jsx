Ext.define('Abraxa.view.settings.company.customFileNumbering', {
    extend: 'Ext.Container',
    xtype: 'settings.company.systems.file.numbering',
    scrollable: true,
    cls: 'a-settings-main w-50',
    hidden: true,
    controller: 'company.controller',
    bind: {
        hidden: '{mainCompanyTabbar.activeTabIndex == 4 ? false: true}',
    },
    layout: 'vbox',
    flex: 1,
    items: [
        {
            cls: 'a-container-premium errorHandler',
            maxWidth: 540,
            bind: {
                hidden: '{currentUserPlan == "starter" ? false:true}',
            },
            items: [
                {
                    xtype: 'div',
                    padding: '16 48',
                    cls: 'text-center',
                    html: '<div class="h1">Premium feature</div><p class="a-txt">The ultimate all-in-one package for companies that need to handle port calls with confidence.</p>',
                },
                {
                    xtype: 'div',
                    margin: '16 0 24 -12',
                    cls: 'text-center',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" width="416" height="248" viewBox="0 0 416 248"><g transform="translate(-533 -328)"><rect width="242" height="158" rx="8" transform="translate(533 328)" fill="#fbe3c9" opacity="0.4"/><rect width="400" height="232" rx="8" transform="translate(549 344)" fill="#fff"/><rect width="64" height="8" rx="4" transform="translate(741 384)" fill="#f3c46b"/><rect width="64" height="8" rx="4" transform="translate(741 528)" fill="#ecf0f1"/><rect width="64" height="8" rx="4" transform="translate(637 384)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(637 528)" fill="#b0bec5" opacity="0.24"/><rect width="168" height="8" rx="4" transform="translate(637 432)" fill="#b0bec5" opacity="0.24"/><rect width="168" height="8" rx="4" transform="translate(637 480)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 384)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 528)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 432)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 480)" fill="#b0bec5" opacity="0.24"/><g transform="translate(333 85)"><rect width="40" height="40" rx="8" transform="translate(240 283)" fill="#ffb74d"/><g transform="translate(248 291)"><path d="M0,0H24V24H0Z" fill="none"/><path d="M20,6H17.82A2.993,2.993,0,0,0,12.5,3.35l-.5.67-.5-.68A2.994,2.994,0,0,0,6.18,6H4A1.985,1.985,0,0,0,2.01,8L2,19a1.993,1.993,0,0,0,2,2H20a1.993,1.993,0,0,0,2-2V8A1.993,1.993,0,0,0,20,6ZM15,4a1,1,0,1,1-1,1A1,1,0,0,1,15,4ZM9,4A1,1,0,1,1,8,5,1,1,0,0,1,9,4ZM20,19H4V17H20Zm0-5H4V8H9.08L7,10.83,8.62,12,11,8.76,12,7.4l1,1.36L15.38,12,17,10.83,14.92,8H20Z" fill="#fff"/></g></g></g></svg>',
                },
                {
                    xtype: 'button',
                    margin: '16 0',
                    ui: 'premium large',
                    text: 'Upgrade to Premium',
                    handler: function () {
                        window.open('https://www.abraxa.com/pricing/');
                    },
                },
            ],
        },
        {
            xtype: 'container',
            bind: {
                hidden: '{currentUserPlan == "starter" ? true:false}',
            },
            hidden: true,
            items: [
                {
                    xtype: 'div',
                    html: '<h1 class="fw-n">File numbering</h1>',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">Configure your custom file reference in line with organizational requirements and standards. Alternatively, file reference can be manually specified per appointment.</p>',
                },
                {
                    xtype: 'div',
                    padding: '16 0 0 0',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        // align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            flex: 1,
                            bind: {
                                html: '<h3>Enable automatic file numbering</h3>',
                            },
                        },
                        {
                            xtype: 'togglefield',
                            right: 0,
                            top: 10,
                            reference: 'customFileNumberingEnabled',
                            publishes: ['value'],
                            bind: {
                                value: '{currentCompany.custom_file_number}',
                            },
                            listeners: {
                                change: function (el, value) {
                                    let record = this.upVM().get('currentCompany');
                                    record.set('custom_file_number', value);
                                    if (record.dirty) {
                                        record.save({
                                            success: function () {
                                                Ext.Toast('Settings updated');
                                            },
                                        });
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'formpanel',
                    cls: 'a-general-form',
                    padding: 0,
                    flex: 1,
                    margin: '24 0 8',
                    layout: {
                        type: 'hbox',
                    },
                    defaults: {
                        clearable: false,
                        labelAlign: 'top',
                        ui: 'field-xl hovered-border classic',
                        disabled: true,
                        bind: {
                            disabled: '{customFileNumberingEnabled.value ? false : true}',
                        },
                        listeners: {
                            // blur: 'onEmailSave',
                            painted: function () {
                                if (this._required) this.setError(null);
                            },
                            disabledchange: function () {
                                if (this._required) this.setError(null);
                            },
                        },
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            placeholder: 'PRX-',
                            // label: 'Prefix',
                            name: 'prefix',
                            width: 120,
                            // cls: 'a-field-icon icon-rounded icon-person',
                            bind: {
                                value: '{customFileNumber.prefix}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            // label: 'Sequence',
                            placeholder: '000000',
                            inputType: 'number',
                            name: 'sequence',
                            required: true,
                            // cls: 'a-field-icon icon-rounded icon-lock',
                            maxWidth: 140,
                            bind: {
                                value: '{customFileNumber.sequence}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            // label: 'Suffix',
                            placeholder: '-SFX',
                            name: 'suffix',
                            width: 120,
                            // cls: 'a-field-icon icon-rounded icon-lock',
                            bind: {
                                value: '{customFileNumber.suffix}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 1,
                    margin: '24 0 0 0',
                    padding: 0,
                    required: false,
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'hbox',
                            // margin: '0 0 0 31',
                            bind: {
                                html: '<span class="c-black">Preview:</span>&nbsp;<strong>{customFileNumber.prefix}{customFileNumber.sequence}{customFileNumber.suffix}</strong>',
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'Save',
                            ui: 'solid action',
                            handler: 'onFileNumberSave',
                            bind: {
                                disabled: '{customFileNumberingEnabled.value ? false : true}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
