import Vue from "vue";
import Chart from "chart.js";

const charts = [];

const loadChart = function () {
    const chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };

    const color = Chart.helpers.color;

    const options = {
        title: {
            display: true,
            text: 'Polygon Clipping'
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
                label: function (tooltipItem) {
                    return `(${tooltipItem.xLabel}, ${tooltipItem.yLabel})`;
                },
                title: function (tooltipItem, chart) {
                    return chart.datasets[tooltipItem[0].datasetIndex].label;
                },
            }
        }
    };

    let canvas;
    const titles = [
        'Original Polygon', 'Clipped by Bottom Line', 'Clipped by Right Line',
        'Clipped by Top Line', 'Clipping Complete'
    ];

    for (let i = 0; i < 5; i++) {
        canvas = document.getElementById("canvas" + i).getContext('2d');
        options.title.text = titles[i];

        charts[i] = Chart.Line(canvas, {
            data: {
                datasets: [{
                    borderColor: chartColors.red,
                    backgroundColor: 'transparent',
                    label: "Polygon Point",
                    data: []
                }, {
                    borderColor: chartColors.blue,
                    backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
                    label: "Window Points",
                    data: []
                }]
            },
            options: options
        });
    }


};


new Vue({
    el: '#vm',
    data: {
        points: [],
        xMin: undefined,
        xMax: undefined,
        yMin: undefined,
        yMax: undefined,
        numPoints: 4
    },
    methods: {
        changeNumPoints: function () {
            const diff = this.numPoints - this.points.length;

            if (diff > 0) {
                for (let i = 0; i<diff; i++) {
                    this.points.push({x: undefined, y: undefined});
                }
            } else {
                for (let i = 0; i<-diff; i++) {
                    this.points.pop();
                }
            }
        },
        clipBy: function (p, pNext, a, b) {
            console.log(`    Clipping (${p.x}, ${p.y}) and (${pNext.x}, ${pNext.y})`);
            const c = this.isLeftOf(p, a, b);
            const cNext = this.isLeftOf(pNext, a, b);

            if (c) {
                if (cNext) {
                    return [pNext];
                } else {
                    return [this.getIntersectionOf(p, pNext, a, b)];
                }
            } else {
                if (cNext) {
                    return [this.getIntersectionOf(p, pNext, a, b), pNext];
                } else {
                    return [];
                }
            }
        },
        isLeftOf: function (p, a, b) {
            const c = ((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x));
            return c >= 0;
        },
        getIntersectionOf: function (a, b, c, d) {
            let a1 = b.y - a.y;
            let b1 = a.x - b.x;
            let c1 = a1 * (a.x) + b1 * (a.y);

            // Line CD represented as a2x + b2y = c2
            let a2 = d.y - c.y;
            let b2 = c.x - d.x;
            let c2 = a2 * (c.x) + b2 * (c.y);

            let determinant = a1 * b2 - a2 * b1;

            if (determinant === 0) {
                // The lines are parallel. This is simplified
                // by returning a pair of FLT_MAX
                return {x: undefined, y: undefined};
            }

            const x = (b2 * c1 - b1 * c2) / determinant;
            const y = (a1 * c2 - a2 * c1) / determinant;

            console.log(`        Clipped at (${x}, ${y})`);

            return {x: Math.round(x * 1000)/1000, y: Math.round(y * 1000)/1000};
        },

        clip: function () {
            let i;
            let polygonPoints = [].concat(this.points);
            let windowPoints = this.getWindowPointsArray();
            let clippedPoints;
            let newPoints;

            for (i = 0; i < 4; i++) {
                this.draw(i, polygonPoints, windowPoints);
                clippedPoints = [];

                console.log(`with respect to (${windowPoints[i].x}, ${windowPoints[i].y}) ` +
                    `and (${windowPoints[(i + 1) % 4].x}, ${windowPoints[(i + 1) % 4].y})`);
                for (let j = 0; j < polygonPoints.length; j++) {
                    newPoints = this.clipBy(
                        polygonPoints[j],
                        polygonPoints[(j + 1) % polygonPoints.length],
                        windowPoints[i],
                        windowPoints[(i + 1) % 4]
                    );

                    if (newPoints.length) {
                        let info = '    Adding ';
                        for (let p of newPoints) {
                            info += `(${p.x}, ${p.y}) `;
                        }

                        console.info(info);
                    }
                    clippedPoints = clippedPoints.concat(newPoints);
                }
                polygonPoints = clippedPoints;
            }

            polygonPoints = clippedPoints;
            this.draw(i, polygonPoints, windowPoints);
        },
        getWindowPointsArray: function () {
            const windowPoints = [];

            windowPoints.push({
                x: this.xMin,
                y: this.yMin
            });
            windowPoints.push({
                x: this.xMax,
                y: this.yMin
            });
            windowPoints.push({
                x: this.xMax,
                y: this.yMax
            });
            windowPoints.push({
                x: this.xMin,
                y: this.yMax
            });

            return windowPoints;
        },
        draw: function (chartNo, polygon, windowPoints) {
            if (chartNo instanceof Event) {
                chartNo = 0;
                polygon = [].concat(this.points);
                windowPoints = this.getWindowPointsArray();
            }

            polygon.push(polygon[0]);
            windowPoints = windowPoints.concat([windowPoints[0]]);

            console.warn('Drawing in chart' + chartNo + ' with data: ', polygon);

            const chart = charts[chartNo];
            chart.data.datasets[0].data = polygon;
            chart.data.datasets[1].data = windowPoints;
            chart.update();
        }
    },
    mounted() {
        loadChart();

        // this.points = [{x:1, y:1}, {x:6, y:1}, {x:6, y: 6}, {x: 1, y:6}];
        // this.xMin = this.yMin = 2;
        // this.xMax = this.yMax = 7;
        for (let i = 0; i < this.numPoints; i++) {
            this.points.push({x: undefined, y: undefined});
        }
    }
});