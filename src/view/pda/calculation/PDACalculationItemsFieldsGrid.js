Ext.define('Abraxa.view.pda.calculation.PDACalculationItemsFieldsContainer', {
    // ТРЯБВА ДА Е ПАНЕЛ ИНАЧЕ НЕ РАБОТИ ФОКУСА!!!
    extend: 'Ext.form.Panel',
    xtype: 'pda.calculation.items.fields.container',
    layout: 'hbox',
    hidden: true,
    itemId: 'itemsDataFieldsContainer',
    cls: 'a-calculation-items-fields-container',
    padding: '12 24',
    flex: 1,
    items: [
        {
            minWidth: 400,
            flex: 1,
            cls: 'a-calculation-items-fields',
            bind: {
                items: '{itemFields}',
            },
        },
        {
            flex: 2,
        },
    ],
});
