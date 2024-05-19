Ext.define('Abraxa.view.directory.ports.HolidaysTab.HolidaysMain', {
    extend: 'Ext.Container',
    xtype: 'HolidaysMain',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch', // this is needed to stretch grid
    },
    items: [
        {
            xtype: 'grid',
            flex: 1,
            ui: 'bordered',
            hideHeaders: true,
            cls: 'abraxa-grid a-offset-grid',
            store: [],
            bind: {
                store: '{holidays}',
            },
            scrollable: 'y',
            emptyText: {
                xtype: 'container',
                zIndex: 9,
                layout: {
                    type: 'vbox',
                },
                centered: true,
                items: [
                    {
                        xtype: 'div',
                        html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"> <g id="Group_20500" data-name="Group 20500" transform="translate(-1244 -493)"> <g id="Group_20499" data-name="Group 20499" transform="translate(410 148)" opacity="0.6"> <circle id="Ellipse_776" data-name="Ellipse 776" cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/> </g> <path id="Path_8557" data-name="Path 8557" d="M42.5,5.5H40.25V1h-4.5V5.5H13.25V1H8.75V5.5H6.5A4.513,4.513,0,0,0,2,10V46a4.513,4.513,0,0,0,4.5,4.5h36A4.513,4.513,0,0,0,47,46V10A4.513,4.513,0,0,0,42.5,5.5Zm0,40.5H6.5V21.25h36Zm0-29.25H6.5V10h36Z" transform="translate(1281.5 529.25)" fill="#c8d4e6"/> </g> </svg><div class="a-no-content-txt">No holidays available</div></div>',
                    },
                ],
            },
            emptyTextDefaults: {
                xtype: 'emptytext',
                cls: 'a-empty-text',
            },
            itemConfig: {
                padding: '4px 0',
            },
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    cls: 'a-grid-top-bar',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'fs-16 fw-b',
                            html: 'Official holidays',
                        },
                    ],
                },
            ],
            columns: [
                {
                    text: 'Date',
                    dataIndex: 'date',
                    formatter: 'date("j F")',
                    flex: 1,
                    cls: 'a-column-offset-x0',
                    cell: {
                        cls: 'fw-b a-cell-offset-x0',
                        encodeHtml: false,
                    },
                },
                {
                    text: 'Description',
                    flex: 2,
                    dataIndex: 'description',
                    cell: {
                        cls: 'c-blue-grey',
                        encodeHtml: false,
                    },
                    renderer: function (val) {
                        if (val) {
                            return Ext.String.capitalize(val);
                        }
                        return '<span class="a-cell-placeholder">---</span>';
                    },
                },
            ],
        },
    ],
});
