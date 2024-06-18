Ext.define('Abraxa.store.TestTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.testTree',
    storeId: 'treeStore',
    parentIdProperty: 'parentId',
    // lazyFill: true,
    // root: {
    //     text: 'Cargoes',
    //     expanded: true,
    //     loaded: true,
    //     id: 'root',
    // },
    // data: [
    //     {
    //         text: 'Break bulk',
    //         id: 'break_bulk',
    //         parentId: 'root',
    //         expanded: true,
    //     },
    //     {
    //         text: 'Cargo 1',
    //         leaf: true,
    //         parentId: 'break_bulk',
    //     },
    //     {
    //         text: 'Cargo 2',
    //         leaf: true,
    //         parentId: 'break_bulk',
    //     },
    //     {
    //         text: 'Some bulk',
    //         id: 'some_bulk',
    //         parentId: 'root',
    //         expanded: true,
    //     },
    //     {
    //         text: 'Cargo 3',
    //         leaf: true,
    //         parentId: 'some_bulk',
    //     },
    //     {
    //         text: 'Break bulk 3',
    //         id: 'break_bulk3',
    //         parentId: 'root',
    //         expanded: true,
    //         loaded: true,
    //     },
    // ],
});
