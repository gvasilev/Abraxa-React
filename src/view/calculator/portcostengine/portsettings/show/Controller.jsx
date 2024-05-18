Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portcostengine.portsettings.show.controller',

    control: {
        'list[cls~=a-menu-list]': {
            select: 'onListSelect',
        },
    },

    onListSelect: function (list, selection) {
        let lists = Ext.ComponentQuery.query('list[listId!=' + list.listId + '][cls~=calculator_list]');

        Ext.each(lists, function (list) {
            list.deselectAll();
        });
        this.getView().upVM().set('calculatorCardIndex', list.calculatorCardIndex);
    },
});
