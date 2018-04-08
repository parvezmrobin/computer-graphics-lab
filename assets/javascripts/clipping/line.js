import Chart from "chart.js";
import Vue from "vue";

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

const color = Chart.helpers.color;
let line = {
    borderColor: window.chartColors.red,
    backgroundColor: 'transparent',
    label: "Line Point",
    data: []
};

let windowPoints = {
    borderColor: window.chartColors.blue,
    backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
    label: "Window Points",
    data: []
};
let data = {
    datasets: [line, windowPoints]
};

const loadChart = function () {
    const plane = document.getElementById("canvas").getContext('2d');
    window.chart = Chart.Line(plane, {
        data: data,
        options: {
            title: {
                display: true,
                text: 'Cohen-Sutherland Clipping'
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        labelString: 'X axis',
                        display: true,
                    },
                    ticks: {
                        suggestedMin: -10,
                        suggestedMax: 10
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        suggestedMin: -10,
                        suggestedMax: 10
                    },
                    scaleLabel: {
                        labelString: 'Y axis',
                        display: true
                    }
                }]
            },
            elements: {
                point: {
                    radius: 5,
                    hoverRadius: 10
                },
                line: {
                    tension: 0
                }
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, chart) {
                        return `(${tooltipItem.xLabel}, ${tooltipItem.yLabel})`;
                    },
                    title: function (tooltipItem, chart) {
                        return chart.datasets[tooltipItem[0].datasetIndex].label;
                    },
                }
            }
        }
    });
};


new Vue({
    el: '#vm',
    data: {
        x0: undefined,
        x1: undefined,
        y0: undefined,
        y1: undefined,
        xMin: undefined,
        xMax: undefined,
        yMin: undefined,
        yMax: undefined,
        output: ''
    },
    methods: {
        check: function () {
            this.draw();

            const bitsA = [];
            const bitsB = [];

            bitsA[0] = this.sign(this.y0 - this.yMax);
            bitsA[1] = this.sign(this.yMin - this.y0);
            bitsA[2] = this.sign(this.x0 - this.xMax);
            bitsA[3] = this.sign(this.xMin - this.x0);

            bitsB[0] = this.sign(this.y1 - this.yMax);
            bitsB[1] = this.sign(this.yMin - this.y1);
            bitsB[2] = this.sign(this.x1 - this.xMax);
            bitsB[3] = this.sign(this.xMin - this.x1);

            const ands = [], ors = [];

            for (let i = 0; i < bitsA.length; i++) {
                const bitA = bitsA[i];
                const bitB = bitsB[i];

                ands[i] = bitA && bitB;
                ors[i] = bitA || bitB;
            }

            let and = ands[0], or = ors[0];
            for (let i = 1; i < or.length; i++) {
                and = (and || ands[i]);
                or = (or || ors[i]);
            }

            if (and) this.output = 'Non Visible';
            else if(or) this.output = 'Clipping Candidate';
            else this.output = 'Visible';
        },
        sign: function (val) {
            return val > 0;
        },
        draw: function () {
            let windowPoints = [];
            windowPoints.push({
                x: this.xMin,
                y: this.yMin
            });
            windowPoints.push({
                x: this.xMin,
                y: this.yMax
            });
            windowPoints.push({
                x: this.xMax,
                y: this.yMax
            });
            windowPoints.push({
                x: this.xMax,
                y: this.yMin
            });
            windowPoints.push({
                x: this.xMin,
                y: this.yMin
            });

            chart.data.datasets[1].data = windowPoints;

            let line = [];
            line.push({
                x: this.x0,
                y: this.y0
            });
            line.push({
                x: this.x1,
                y: this.y1
            });

            chart.data.datasets[0].data = line;

            chart.update();
        }
    },
    mounted() {
        loadChart();
    }
});