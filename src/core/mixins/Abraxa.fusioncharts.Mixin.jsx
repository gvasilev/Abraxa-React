import FusionCharts from "fusioncharts";

Ext.define('Abraxa.fusioncharts.Mixin', {
    extend: 'Ext.Mixin',

    // twoWayBindable: ['data'],
    defaultBindProperty: 'data',

    config: {
        chart: {},
        type: null,
        fusionChart: null,
        categories: [],
        dataset: [],
    },
    data: null,

    /**
     * @property {Boolean} isFusionChart
     * Identifies this class and its subclasses.
     * @readonly
     */
    isFusionChart: true,

    /**
     * @property {Boolean} isReady
     * Flags whether the Froala editor instance has been initialized. Initialization
     * happens automatically when the component is created, but takes several milliseconds.
     * Upon initialization, the {@link #event-ready} event is fired.
     * @readonly
     */
    isReady: false,

    applyType: function (config) {
        var me = this,
            fusionChart;

        if (config === null) {
            fusionChart = me.getChart();
            fusionChart.destroy();
            // Froala leaves the innerHTML set to the html value. Since
            // we're being destroyed, clean that up too.
            me.getFusionChartDomElement().innerHTML = '';

            return null;
        }
        return me.createFusionChart(config);
    },

    createFusionChart: function (config) {
        var me = this,
            fusionchart = new FusionCharts(me.config),
            chartElement = this.chartElement;

        if (chartElement && chartElement.id) {
            FusionCharts.ready(function () {
                fusionchart.render(chartElement.id);
                fusionchart.isReady = true;
                fusionchart.component = me;
                // fusionchart.resizeTo(chartElement.dom.offsetWidth, chartElement.dom.offsetHeight);
            });
            this.setFusionChart(fusionchart);
        }

        return fusionchart;
    },

    updateChart: function (data) {
        var me = this,
            chartDetails = data,
            fusionChart = this.getFusionChart();

        if (fusionChart && fusionChart.isReady) {
            fusionChart.setChartData({
                chart: chartDetails,
                data: this.getData(),
                categories: this.getCategories(),
                dataset: this.getData(),
            });
        }
    },

    updateData: function (data) {
        var me = this,
            fusionChart = this.getFusionChart();

        if (fusionChart && fusionChart.isReady) {
            fusionChart.setChartData({
                chart: this.getChart(),
                data: data,
            });
        }
    },
    updateCategories: function (data) {
        var me = this,
            fusionChart = this.getFusionChart();

        if (fusionChart && fusionChart.isReady) {
            fusionChart.setChartData({
                chart: this.getChart(),
                data: this.getData(),
                categories: data,
            });
        }
    },
    updateDataset: function (data) {
        var me = this,
            fusionChart = this.getFusionChart();

        if (fusionChart && fusionChart.isReady) {
            fusionChart.setChartData({
                chart: this.getChart(),
                data: this.getData(),
                categories: this.getCategories(),
                dataset: data,
            });
        }
    },
    setChartDataUrl: function (url, type) {
        let fusionChart = this.getFusionChart();
        fusionChart.setChartDataUrl(url, type);
    },
    setDataSource: function (url, type) {
        let fusionChart = this.getFusionChart();
        fusionChart.setChartDataUrl(url, type);
    },
});
