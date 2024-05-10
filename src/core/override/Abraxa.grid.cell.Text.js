Ext.define('Abraxa.grid.cell.Text', {
    override: 'Ext.grid.cell.Text',

    getTemplate: function () {
        var template = this.callParent();
        delete template[0]['data-qoverflow'];
        return template;
    },
});
