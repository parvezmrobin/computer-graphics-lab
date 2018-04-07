import Vue from "vue";
import Chart from "chart.js";

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
let center = {
    borderColor: window.chartColors.red,
    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
    label: "Center Point",
    data: [{
        x: 0,
        y: 0
    }]
};

let rotationPoints = {
    borderColor: window.chartColors.blue,
    backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
    label: "Rotation Points",
    data: []
};
let data = {
    datasets: [center, rotationPoints]
};

loadChart = function () {
    const plane = document.getElementById("plane").getContext('2d');
    window.chart = Chart.Line(plane, {
        data: data,
        options: {
            title: {
                display: true,
                text: 'Rotation'
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

/*
* Vue JS part
*/

const vm = new Vue({
    el: '#vm',
    data: {
        x0: undefined, y0: undefined, x1: undefined, y1: undefined,
        x2: undefined, y2: undefined, x3: undefined, y3: undefined,
        h: undefined,
        k: undefined,
        deg: undefined
    },
    methods: {
        focused: function () {

        },
        blurred: function () {

        },
        toXyArray: function () {
            const data = [];
            data[0] = {x: this.x0, y: this.y0};
            data[1] = {x: this.x1, y: this.y1};
            data[2] = {x: this.x2, y: this.y2};
            data[3] = {x: this.x3, y: this.y3};
            data[4] = {x: this.x0, y: this.y0};

            return data;
        },
        draw: function (points) {
            if (points instanceof Array) {
                chart.data.datasets[1].data = points
            } else {
                chart.data.datasets[1].data = this.toXyArray();
            }

            chart.update();
        },
        rotate: function () {
            const cos = Math.cos((Math.PI / 180) * this.deg);
            const sin = Math.sin((Math.PI / 180) * this.deg);

            const xy = this.toXyArray();
            const points = [];
            for (let i = 0; i < xy.length; i++) {
                let p = xy[i];

                let x = p.x - this.h;
                let y = p.y - this.k;
                p.x = (cos * x - sin * y + this.h);
                p.y = (sin * x + cos * y + this.k);
                points.push(p);
            }

            chart.data.datasets[0].data[0] = {x: this.h, y: this.k};

            this.draw(points);
        }
    },
    mounted() {
        rotationPoints.data = this.toXyArray();
        loadChart();
    }
});
