Ext.define('Abraxa.view.portcall.documents.DocumentsDragDropController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.documents.dragDrop.controller',

    // init: function () {
    //     this.registerDragZone();
    //     // this.registerDropZone();
    // },

    registerDragZone: function () {
        var me = this,
            documentsView = me.lookup('documentList'),
            touchEvents = Ext.supports.Touch && Ext.supports.TouchEvents;

        me.dragZone = Ext.create('Ext.plugin.dd.DragZone', {
            element: documentsView.bodyElement,
            handle: '.a-document-row',
            view: documentsView,
            $configStrict: false,
            activateOnLongPress: touchEvents ? true : false,
            proxy: {
                cls: 'x-proxy-drag-el patient-proxy-el',
            },

            getDragText: function (info) {
                var selector = '.x-dataview-item',
                    el = Ext.fly(info.eventTarget).up(selector);

                return el.dom.innerHTML;
            },

            getDragData: function (e) {
                return {
                    patientData: this.view.mapToRecord(e),
                };
            },
        });
    },

    registerDropZone: function () {
        var me = this,
            hospitalView = me.lookup('hospitalView');

        me.dropZone = Ext.create('Ext.plugin.dd.DropZone', {
            element: hospitalView.bodyElement,
            view: hospitalView,
            $configStrict: false,
            prepareNameString: me.prepareNameString,

            onDragMove: function (info) {
                var me = this,
                    ddManager = Ext.dd.Manager,
                    targetEl = ddManager.getTargetEl(info),
                    rowBody = Ext.fly(targetEl),
                    isRowBody = rowBody.hasCls('hospital-target'),
                    hospital,
                    patients,
                    name;

                if (!isRowBody) {
                    rowBody = Ext.fly(targetEl).parent('.x-rowbody');

                    if (rowBody) {
                        isRowBody = rowBody.hasCls('hospital-target');
                    }
                }

                me.toggleDropMarker(info, false);

                if (!isRowBody) {
                    return;
                }

                hospital = rowBody.component.getRecord();
                patients = hospital.get('patients');
                name = info.data.dragData.patientData.get('name');

                if (patients && patients.indexOf(name) !== -1) {
                    return;
                }

                me.ddEl = rowBody;
                me.toggleDropMarker(info, true);
            },

            onDrop: function (info) {
                var me = this,
                    hospital,
                    patients,
                    name,
                    component;

                if (!me.ddEl) {
                    return;
                }

                component = me.ddEl.component;
                hospital = component.getRecord();
                patients = hospital.get('patients');
                name = info.data.dragData.patientData.get('name');

                if (patients && patients.indexOf(name) !== -1) {
                    return;
                }

                if (!patients) {
                    patients = [];
                    hospital.set('patients', patients);
                }

                patients.push(name);
                component.contentElement.update(me.prepareNameString(patients));
                me.toggleDropMarker(info, false);
            },

            toggleDropMarker: function (info, state) {
                var me = this,
                    ddManager;

                if (!me.ddEl) {
                    return;
                }

                ddManager = Ext.dd.Manager;
                ddManager.toggleTargetNodeCls(me.ddEl, 'hospital-target-hover', state);
                ddManager.toggleProxyCls(info, me.validDropCls, state);

                if (!state) {
                    me.ddEl = null;
                }
            },
        });
    },
});
