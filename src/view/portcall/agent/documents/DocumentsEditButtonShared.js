Ext.define('Abraxa.view.portcall.documents.DocumentsEditButtonShared', {
    extend: 'Ext.Tool',
    xtype: 'documents.edit.button.shared',
    iconCls: 'md-icon-more-horiz',
    ui: 'tool-md round',
    hidden: true,
    // bind: {
    //     hidden: '{nonEditable ? false : true}'
    // },
    tooltip: {
        anchorToTarget: true,
        html: 'More',
        align: 'bc-tc?',
        showDelay: 0,
        hideDelay: 0,
        dismissDelay: 0,
    },
    handler: function (owner, tool) {
        let vm = this.upVM();
        Ext.create('Abraxa.view.portcall.documents.DocumentsEditMenuShared', {
            viewModel: {
                parent: vm,
            },
        }).showBy(tool, 'tl-bl?');
    },
});
