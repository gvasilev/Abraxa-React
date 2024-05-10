Ext.define('Abraxa.view.portcall.documents.DocumentsEditButton', {
    extend: 'Ext.Tool',
    xtype: 'documents.edit.button',
    iconCls: 'md-icon-more-horiz',
    ui: 'tool-md round',
    hidden: true,
    bind: {
        hidden: '{object_record.parent_id ? true : false}',
    },
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
        Ext.create('Abraxa.view.portcall.documents.DocumentsEditMenu', {
            viewModel: {
                parent: vm,
            },
        }).showBy(tool, 'tl-bl?');
    },
});
