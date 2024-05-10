var stepper =
    '<nav class="stepper" id="progress-navigation">' +
    '  <ul>' +
    '    <li class="step done">' +
    '      <a href="javascript:void(0)">' +
    '        <span class="step-icon"><i class="material-icons md-18 white" style="color: #fff; padding: 3px;">done</i></span>' +
    '        <p class="step-label">General</p>' +
    '      </a>' +
    '    </li>' +
    '    <li class="indicator-line done"></li>' +
    '    <li class="step active">' +
    '      <a href="javascript:void(0)">' +
    '        <span class="step-icon">2</span>' +
    '        <p class="step-label">Agent information</p>' +
    '      </a>' +
    '    </li>' +
    '  </ul>' +
    '</nav>';

var stepper2 =
    '<nav class="stepper" id="progress-navigation">' +
    '  <ul>' +
    '    <li class="step active">' +
    '      <a href="javascript:void(0)">' +
    '        <span class="step-icon">1</span>' +
    '        <p class="step-label">General</p>' +
    '      </a>' +
    '    </li>' +
    '    <li class="indicator-line"></li>' +
    '    <li class="step">' +
    '      <a href="javascript:void(0)">' +
    '        <span class="step-icon">2</span>' +
    '        <p class="step-label">Agent information</p>' +
    '      </a>' +
    '    </li>' +
    '  </ul>' +
    '</nav>';

Ext.define('Abraxa.view.voyages.create.VoyagesCreateDialog', {
    extend: 'Ext.Dialog',
    xtype: 'voyages.create.agent',
    title: 'Create Inquiry',
    controller: 'voyages-create-controller',
    manageBorders: false,
    maxWidth: '65%',
    minWidth: '1160',
    minHeight: '64%',
    scrollable: true,
    tools: {
        close: {
            handler: function () {
                let object_id = this.upVM().get('object_id');
                let object_meta_id = this.upVM().get('object_meta_id');
                let editMode = this.upVM().get('editMode');
                let object_record = this.upVM().get('object_record');
                let dialog = this.up('dialog');
                if (parseInt(object_id) && parseInt(object_meta_id) && !editMode) {
                    let msgbox = Ext.create('Ext.MessageBox', {
                        title: 'Close',
                        message: 'Are you sure you want to discard the changes?',
                        zIndex: 999,
                        bbar: {
                            items: [
                                '->',
                                {
                                    xtype: 'button',
                                    text: 'Yes',
                                    handler: function () {
                                        let params = {
                                            object_id: object_id,
                                            object_meta_id: object_meta_id,
                                        };
                                        Ext.Ajax.request({
                                            url: Env.ApiEndpoint + 'object_meta',
                                            method: 'DELETE',
                                            params: params,
                                            success: function (response, opts) {
                                                msgbox.destroy();
                                                dialog.destroy();
                                            },
                                            failure: function (response, opts) {
                                                Ext.Msg.alert('Something went wrong', 'Could not complete operation.');
                                            },
                                        });
                                    },
                                },
                                {
                                    xtype: 'button',
                                    text: 'No',
                                    handler: function () {
                                        msgbox.destroy();
                                    },
                                },
                            ],
                        },
                    }).show();
                } else {
                    if (object_record) {
                        object_record.reject();
                    }
                    dialog.destroy();
                }
            },
        },
    },
    draggable: false,
    maximizable: true,
    modal: true,
    padding: 0,
    margin: 0,
    flex: 1,
    layout: 'fit',
    maximized: false,
    maximizeAnimation: null,
    restoreAnimation: null,
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            showAnimation: 'fadeIn',
            docked: 'top',
        },
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-bgr-50',
            viewModel: {
                formulas: {
                    activeStepper: {
                        bind: {
                            bindTo: '{indicator.activeIndex}',
                            deep: true,
                        },
                        get: function (index) {
                            let step;
                            switch (index) {
                                case 0:
                                    step = stepper2;
                                    break;
                                case 1:
                                    step = stepper;
                                    break;
                            }

                            return step;
                        },
                    },
                },
            },
            layout: {
                type: 'hbox',
                pack: 'center',
            },
            items: [
                {
                    width: '50%',
                    padding: '0 60',
                    bind: {
                        html: '{activeStepper}',
                    },
                },
            ],
        },
        {
            xtype: 'panel',
            cls: 'inquiry_create_card a-bgr-200',
            flex: 1,
            minHeight: '360',
            padding: 0,
            style: 'margin: 0 auto',
            reference: 'voyages_create_card',
            layout: {
                type: 'card',
                indicator: {
                    reference: 'indicator',
                    centered: true,
                    style: 'pointer-events: none;',
                    publishes: ['activeIndex', 'count'],
                },
                animation: 'slide',
            },
            items: [
                {
                    xtype: 'container',
                    scrollable: true,
                    flex: 1,
                    layout: {
                        type: 'vbox',
                    },
                    items: [
                        {
                            xtype: 'voyages.create.general',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    scrollable: true,
                    flex: 1,
                    layout: {
                        type: 'vbox',
                    },
                    items: [
                        {
                            xtype: 'voyages.agent.information',
                        },
                    ],
                },
            ],
        },
    ],
    bbar: {
        reference: 'voyagesCreateBbar',
        cls: 'a-bt-100',
        items: [
            '->',
            {
                // ui: 'solid-default',
                text: 'Prev',
                handler: 'onPrevious',
                bind: {
                    disabled: '{!indicator.activeIndex}',
                },
                margin: '0 8 0 0',
            },
            {
                text: 'Next',
                iconAlign: 'right',
                ui: 'solid-normal',
                cls: 'nextbutton',
                handler: 'onNext',
                bind: {
                    hidden: '{indicator.activeIndex == indicator.count - 1}',
                },
            },
            {
                ui: 'outline-normal',
                style: 'position: absolute; left: 16px;',
                handler: 'onSaveAndClose',
                text: 'Save & Close',
                hidden: true,
                bind: {
                    hidden: '{(indicator.activeIndex < indicator.count - 1 && editMode) ? false : true}',
                },
            },
            {
                ui: 'solid-normal',
                handler: 'onCreate',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                    hidden: '{(indicator.activeIndex == indicator.count - 1) ? false : true}',
                },
            },
        ],
    },
});
