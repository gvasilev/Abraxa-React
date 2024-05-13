Ext.define('Abraxa.utils.AbraxaConstants', {
    alternateClassName: ['AbraxaConstants'],
    singleton: true,
    /**
     * Define constants of labels and repeated string to avoid mistakes
     * usage: AbraxaConstants.constant
     */
    files: {
        maxFileSize: 10 * 1024 * 1024,
    },
    labels: {
        vessel: 'vessel',
        voyageNumber: 'voyage_number',
        leadAgent: 'lead_agent',
        subAgent: 'sub_agent',
        appointingParty: 'appointing_party',
        nominatingParty: 'nominating_party',
        organization: 'organization',
        type: 'type',
        defaultExpenseItems: 'default_expense_items',
        cargoQuantity: 'cargo_quantity',
        latestEvent: 'latest_event',
        createdByUser: 'created_by_user',
    },
    titles: {
        delete: 'Delete',
    },
    messages: {
        deleteSharedRecord: 'Are you sure you want to delete a record that is not your own?',
        deleteRecord: 'Record deleted',
        deleteItem: 'Are you sure you want to delete this item?',
        updateRecord: 'Record updated',
        dateFormatError: ' date cannot be formatted.',
        createRecord: 'Record created',
        anErrorOccured: {
            title: 'An error occurred',
            message:
                'We are sorry, but we are unable to process your request right now. </br>Please contact your system support.',
        },
    },
    formatters: {
        date: {
            dayMonHyphenTime24: 'd M - H:i',
            dayMonYearShortHyphenTime24: 'd M Y - H:i',
            dayMonYearTime24: 'DD MMM YY HH:mm',
            dayMonthYearTime24Slash: 'd/m/Y H:i',
            dayMonYearHyphenTime24: 'DD MMM YY - HH:mm',
            dayMonthYearSlash: 'DD/MM/YYYY',
            dayMonthYearSlashShort: 'dd/mm/yyyy',
            dayMonthYearSlashNoLeading: 'd/m/Y',
            dayAbbrMonYear: 'D MMM YY',
            dayMonHyphenTime12: 'j M - H:i',
            dayAbbrMonYearHyphenTime24: 'D MMM YY - HH:mm',
            yearMonthDayHyphen: 'Y-m-d',
        },
    },
    placeholders: {
        emptySpan: '<span class="a-placeholder">---</span>',
        emptyValue: '---',
        emptyCellSpan: '<span class="a-cell-placeholder">---</span>',
        emptyStatusDiv: '<div class="a-status-badge a-status-md">---</div>',
    },
    urls: {
        staticAbraxa: 'https://static.abraxa.com/',
    },
    buttons: {
        text: {
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            ok: 'Ok',
            yes: 'Yes',
            no: 'No',
            pendingApproval: 'Pending approval',
            draft: 'Draft',
            submited: 'Submited',
            approved: 'Approved',
            completed: 'Completed',
            settled: 'Settled',
            rejected: 'Rejected',
        },
    },
});
