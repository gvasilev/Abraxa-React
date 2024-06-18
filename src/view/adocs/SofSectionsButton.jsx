Ext.define('Abraxa.view.adocs.SofSectionsButton', {
    extend: 'Ext.SplitButton',
    xtype: 'sof-sections',
    text: 'SOF Sections',
    ui: 'dark',
    height: 32,
    bind: {
        disabled: '{isLocked ? true : false}',
    },
    menu: {
        defaults: {
            xtype: 'menucheckitem',
            cls: 'checklist-sections',
            checked: true,
            bind: {
                disabled: '{isLocked ? true : false}',
            },
            listeners: {
                checkchange: function (me, newValue) {
                    let section = me.section,
                        pages = this.upVM().get('pages'),
                        page = pages.getAt(0),
                        sectionEl = Ext.fly(section);

                    if (newValue) {
                        sectionEl.setStyle('display', 'table');
                        sectionEl.dom.setAttribute('show-footer', 'true');
                    } else {
                        sectionEl.setStyle('display', 'none');
                        sectionEl.dom.setAttribute('show-footer', 'false');
                    }

                    page.set('html', sectionEl.up('.document_page').dom.innerHTML);
                    page.save();
                },
                painted: function (me) {
                    let section = me.section;

                    var x = document.getElementById(section);
                    if (window.getComputedStyle(x).display === 'none') {
                        this.setChecked(false);
                    }
                },
            },
        },
        items: [
            {
                text: 'General Events',
                section: 'sof_blank_general_events',
            },
            {
                text: 'Working details',
                section: 'sof_blank_daily_working',
            },
            {
                text: 'Bunkers & Drafts',
                section: 'sof_blank_bunkers',
            },
            {
                text: 'Remarks',
                section: 'sof_blank_remarks',
            },
            {
                text: 'Footer',
                section: 'sof_blank_footer',
            },
        ],
    },
});
