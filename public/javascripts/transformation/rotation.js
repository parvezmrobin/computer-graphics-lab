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
let scatterChartData = {
    datasets: [{
        borderColor: window.chartColors.blue,
        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
        label: "Rotated Points",
        data: [{
            x: 1,
            y: 1,
        }, {
            x: -2,
            y: 7,
        }, {
            x: 6,
            y: 6,
        }, {
            x: 5,
            y: 2,
        }, {
            x: 1,
            y: 1,
        }]
    }]
};

window.onload = function () {
    const plane = document.getElementById("plane").getContext('2d');
    window.myScatter = Chart.Line(plane, {
        data: scatterChartData,
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
                        beginAtZero: true
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        beginAtZero: true,
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
                    label: function(tooltipItem, chart) {
                        return `(${tooltipItem.xLabel}, ${tooltipItem.yLabel})`;
                    },
                    title: function(tooltipItem, chart) {
                        return 'Point';
                    },
                }
            }
        }
    });
};