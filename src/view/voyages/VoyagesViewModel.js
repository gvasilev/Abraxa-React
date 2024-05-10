Ext.define('Abraxa.view.voyages.VoyagesViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.voyages-viewmodel',
    data: {
        voyagesStatusFilters: [],
        voyagesStatusFiltersIds: [],
        voyagesPortFilters: [],
        voyagesPortFiltersIds: [],
        voyagesInquiryType: [],
        voyagesInquiryTypeIds: [],

        //
        voyagesClosedStatusFilters: [],
        voyagesClosedStatusFiltersIds: [],
        voyagesClosedPortFilters: [],
        voyagesClosedPortFiltersIds: [],
        voyagesClosedInquiryType: [],
        voyagesClosedInquiryTypeIds: [],
    },
    stores: {
        inquiryStatus: {
            type: 'inquiry.status',
            autoLoad: true,
        },
        inquiryStatusActive: {
            source: '{inquiryStatus}',
            filters: [
                {
                    property: 'is_archive',
                    operator: '=',
                    value: 0,
                    exactMatch: true,
                },
            ],
        },
        inquiryStatusArchive: {
            source: '{inquiryStatus}',
            filters: [
                {
                    property: 'is_archive',
                    operator: '=',
                    value: 1,
                    exactMatch: true,
                },
            ],
        },
        voyages: {
            type: 'voyages',
            autoLoad: true,
            grouper: {
                groupFn: function groupFn(record) {
                    if (record.getInquiry()) {
                        return record.getInquiry().get('status_data').name;
                    }
                },
            },
            sorters: [
                {
                    sorterFn: function (record1, record2) {
                        let inquiryRecord1 = record1.getInquiry(),
                            inquiryRecord2 = record2.getInquiry(),
                            customId1 = 0,
                            customId2 = 0;
                        if (inquiryRecord1 && inquiryRecord1.get('custom_company_id')) {
                            customId1 = inquiryRecord1.get('custom_company_id').custom_inquiry_id;
                        }
                        if (inquiryRecord2 && inquiryRecord2.get('custom_company_id')) {
                            customId2 = inquiryRecord2.get('custom_company_id').custom_inquiry_id;
                        }
                        return customId1 < customId2 ? 1 : customId1 > customId2 ? -1 : 0;
                    },
                },
            ],
        },
        inquiryArchived: {
            type: 'inquiry-archived',
            filters: [
                {
                    property: 'is_archived',
                    operator: '=',
                    value: 1,
                    exactMatch: true,
                },
            ],
        },
    },
});
