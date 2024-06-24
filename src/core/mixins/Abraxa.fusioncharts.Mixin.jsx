import FusionCharts from 'fusioncharts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import Gantt from 'fusioncharts/fusioncharts.gantt';
import Charts from 'fusioncharts/fusioncharts.charts';

FusionCharts.options.license({
    key: 'osC4C-9bhC2C5A5A5E6C4F5E3B3H2A2B2lF-11wE1G4xI-7lrgA3B4vbsH3B5D7C2B1F1F1B4E4H4B1C8A6C2A1E2juwB3B7D1F-11D1D3G4rqb1B9D2C6njyD3H4A9bzfE3D4A2I4E1A9B3D7E2B2G2yqsC2B2ZC7egvH4I3B8oD-13B5QD5D3jteD5B5B2E5B4E4D3H2C8B6E4E4D4D1B-8==',
    creditLabel: false,
});

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
