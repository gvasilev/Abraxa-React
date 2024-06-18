/*
This combo must be used in grid fields, because OrganizationCombo doesn't work with grid fields
properly. Some unknown bug in ExtJS. DEV-1982
*/

Ext.define('Abraxa.core.components.combo.OrganizationNoFilters', {
    extend: 'Ext.field.ComboBox',
    xtype: 'organization.combo.noFilters',
    forceSelection: true,
    valueField: 'org_id',
    displayField: 'org_name',
    matchFieldWidth: false,
    triggerAction: 'all',
    clearable: true,
    autoFocus: false,
    minChars: 3,
    // queryDelay: 500,
    itemTpl: Ext.create(
        'Ext.XTemplate',
        '<div class="hbox"><div class="party-item a-verification a-{[this.compliant(values.compliance)]} mr-16">' +
            '<a href="javascript:void(0);" class="sm-company fw-b"><span class="text-truncate">{org_name}</span><i class="md-icon-outlined a-verification-icon a-{[this.compliantIcon(values.compliance)]} "></i></a><div class="sm-type">{org_email}</div>' +
            '</div>{[this.cargoData(values.types)]}</div>',
        {
            cargoData: function (tags) {
                if (tags.length) {
                    if (tags.length > 1) {
                        return (
                            '<span class="a-status-badge rounded status-' +
                            tags[0].type.org_t_name.toLowerCase() +
                            '">' +
                            tags[0].type.org_t_name +
                            ' <em class="a-count-badge pedence">+' +
                            (tags.length - 1) +
                            '</em></span>'
                        );
                    }
                    return (
                        '<span class="a-status-badge rounded status-' +
                        tags[0].type.org_t_name.toLowerCase() +
                        '">' +
                        tags[0].type.org_t_name +
                        '</span>'
                    );
                }

                return '';
            },
            compliant: function (compliance) {
                if (compliance && compliance.status) return compliance.status;

                return '';
            },
            compliantIcon: function (compliance) {
                if (!compliance || compliance.status != 'verified') return 'md-icon-outlined';

                return;
            },
        }
    ),
    floatedPicker: {
        cls: 'a-organization-combo',
        minWidth: 320,
        minHeight: 440,
        weighted: true,
        requires: ['Ext.dataview.plugin.ListPaging'],
        plugins: {
            listpaging: {
                // loadMoreCmp: {
                //     xtype: 'component',
                //     cls: Ext.baseCSSPrefix + 'listpaging',
                //     scrollDock: 'end',
                //     hidden: true,
                //     inheritUi: true,
                //     text: '<a class="fw-b">Load more...</a>'
                // },
                noMoreRecordsText: "<span class='sm-title'></span>",
                loadMoreText: '<a class="fw-b">Load more...</a>',
            },
        },
    },

    store: {
        type: 'organizations.remote',
    },

    realignFloatedPicker: function (picker) {
        picker = picker || this.getConfig('picker', false, true);

        if (picker && picker.isVisible()) {
            // If we have dropped to no items and the store is not loading, collapse field.
            if (!picker.getItemCount() && !picker.getStore().hasPendingLoad()) {
                return;
            }

// this.callParent([picker]);
        }
    },
});
