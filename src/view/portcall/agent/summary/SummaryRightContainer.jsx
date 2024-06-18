import './SummaryBerthCard';
import '../../../chatter/ChatterMain';

Ext.define('Abraxa.view.portcall.summary.SummaryRightontainer', {
    extend: 'Ext.Container',
    xtype: 'portcall.summary.right.container',
    cls: 'a-summary-right-container',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'portcall.summary.berth.card',
        },
        {
            xtype: 'chatter',
        },
        // {
        //     xtype: 'container',
        //     flex: 1,
        //     layout: 'vbox',
        //     cls: 'a-summary-documents bordered',
        //     items: [{
        //             xtype: 'container',
        //             cls: 'a-titlebar',
        //             items: [{
        //                 xtype: 'title',
        //                 bind: {
        //                     title: 'Latest documents <span class="c-grey">({sortedFiles.files.length})</span>'
        //                 }
        //             }]
        //         },
        //         {
        //             xtype: 'container',
        //             cls: 'a-documents-progress',
        //             bind: {
        //                 html: '<div class="sm-title"><span>{sortedFiles.approvedCount}/{sortedFiles.totalApproval} Approved</span><span>{sortedFiles.percentage}%</span></div>' +
        //                     '<div class="a-progress">' +
        //                     '<div class="a-progress-bar" style="width:{sortedFiles.percentage}%;"></div>' +
        //                     '</div>',
        //                 hidden: '{sortedFiles.totalApproval ? false : true}'
        //             }
        //         },
        //         {
        //             xtype: 'list',
        //             cls: 'a-documents-list',
        //             itemTpl: '<div class="a-document-row">' +
        //                 '<div class="a-document-name"><span class="file-icon-new file-icon-sm-new" data-type="{extension}"></span><a class="a-file-name" href="javascript:void(0)">{name}</a></div>' +
        //                 '<div class="a-document-status"><div class="a-status-badge status-{status}>{status}</div></div>' +
        //                 '</div>',

        //             bind: {
        //                 data: '{sortedFiles.files}'
        //             },
        //             emptyText: {
        //                 xtype: 'container',
        //                 zIndex: 999,
        //                 layout: {
        //                     type: 'vbox'
        //                 },
        //                 bind: {
        //                     hidden: '{nonEditable && selectedSection.selection.is_shared ? true : false}'
        //                 },
        //                 centered: true,
        //                 items: [{
        //                     xtype: 'div',
        //                     html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9717 -19083)"><g transform="translate(8883 18738)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9005.988 19065.16)"><path d="M776.7,44.84h-19.84a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5h-14.36a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M775.662,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M761.083,83.667h15.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-15.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,83.667Z" fill="#c8d4e6"></path><path d="M761.083,91.187h5.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-5.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,91.187Z" fill="#c8d4e6"></path><path d="M761.083,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652H761.083a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,76.147Z" fill="#c8d4e6"></path><path d="M805.134,97.521a9.366,9.366,0,0,0-17.5-2.5,7.5,7.5,0,0,0,.813,14.95H804.7a6.232,6.232,0,0,0,.437-12.45Zm-6.687,3.7v5h-5v-5H789.7l6.25-6.25,6.25,6.25Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No documents available.</div></div>'
        //                 }, ]
        //             },
        //             itemConfig: {
        //                 viewModel: {},
        //                 listeners: {
        //                     click: {
        //                         element: 'element',
        //                         delegate: 'a.a-file-name',
        //                         fn: function () {
        //                             let record = this.component.upVM().get('record'),
        //                                 object_meta_id = record.get('object_meta_id');

        //                             var data = {
        //                                 object_id: 3,
        //                                 object_meta_id: object_meta_id,
        //                                 file_id: record.get('documents_id'),
        //                             };

        //                             Abraxa.getApplication().getController('AbraxaController').previewFile(record, data);
        //                         }
        //                     }
        //                 }
        //             }
        //         },
        //         // {
        //         //     xtype: 'container',
        //         //     margin: '12 4',
        //         //     bind: {
        //         //         hidden: '{sortedFiles.files.length > 0 ? false:true}'
        //         //     },
        //         //     items: [{
        //         //         xtype: 'button',
        //         //         ui: 'normal small',
        //         //         text: 'view all documents'
        //         //     }]
        //         // }
        //     ]
        // }
    ],
});
