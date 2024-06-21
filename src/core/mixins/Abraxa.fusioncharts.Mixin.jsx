import FusionCharts from 'fusioncharts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import Gantt from 'fusioncharts/fusioncharts.gantt';
import Charts from "fusioncharts/fusioncharts.charts";

FusionTheme(FusionCharts);
Gantt(FusionCharts);
Widgets(FusionCharts);
Charts(FusionCharts);

Ext.define('Abraxa.fusioncharts.Mixin', {
    extend: 'Ext.Mixin',

    defaultBindProperty: 'data',

    config: {
        chart: {},
        type: null,
        fusionChart: null,
        categories: [],
        dataset: [],
    },
    data: null,

    isFusionChart: true,
    isReady: false,

    applyType(config) {
        if (config === null) {
            const fusionChart = this.getChart();
            if (fusionChart) {
                fusionChart.destroy();
                this.getFusionChartDomElement().innerHTML = '';
            }
            return null;
        }
        return this.createFusionChart(config);
    },

    createFusionChart(config) {
        const fusionChart = new FusionCharts(this.config);
        const chartElement = this.chartElement;

        if (chartElement && chartElement.id) {
            FusionCharts.ready(() => {
                fusionChart.render(chartElement.id);
                fusionChart.isReady = true;
                fusionChart.component = this;
            });
            this.setFusionChart(fusionChart);
        }

        return fusionChart;
    },

    updateChart(data) {
        const fusionChart = this.getFusionChart();

        if (fusionChart && fusionChart.isReady) {
            fusionChart.setChartData({
                chart: data,
                data: this.getData(),
                categories: this.getCategories(),
                dataset: this.getDataset(),
            });
        }
    },

    updateData(data) {
        const fusionChart = this.getFusionChart();

        if (fusionChart && fusionChart.isReady) {
            fusionChart.setChartData({
                chart: this.getChart(),
                data: data,
            });
        }
    },

    updateCategories(data) {
        const fusionChart = this.getFusionChart();

        if (fusionChart && fusionChart.isReady) {
            fusionChart.setChartData({
                chart: this.getChart(),
                data: this.getData(),
                categories: data,
            });
        }
    },

    updateDataset(data) {
        const fusionChart = this.getFusionChart();

        if (fusionChart && fusionChart.isReady) {
            fusionChart.setChartData({
                chart: this.getChart(),
                data: this.getData(),
                categories: this.getCategories(),
                dataset: data,
            });
        }
    },

    setChartDataUrl(url, type) {
        const fusionChart = this.getFusionChart();
        if (fusionChart) {
            fusionChart.setChartDataUrl(url, type);
        }
    },

    setDataSource(url, type) {
        const fusionChart = this.getFusionChart();
        if (fusionChart) {
            fusionChart.setChartDataUrl(url, type);
        }
    },
});