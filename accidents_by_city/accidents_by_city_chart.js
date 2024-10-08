$(document).ready(function() {
    Papa.parse('https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/accidents_by_city/table_124_NHTSA.csv', {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;

            // desc order
            data.sort(function(a, b) {
                return b.auto_deaths_2020 - a.auto_deaths_2020;
            });

            var cities = data.map(function(row) { return row.city; });
            var auto_deaths_2020 = data.map(function(row) { return row.auto_deaths_2020; });
            var ped_deaths_2020 = data.map(function(row) { return row.ped_deaths_2020; });

            var barHeight = 10;
            var barGap = 20;
            var chartHeight = (barHeight + barGap) * cities.length;

            var canvas = document.getElementById('chart');
            canvas.style.height = chartHeight + 'px';

            var ctx = canvas.getContext('2d');

            // new var to store chart
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: cities,
                    datasets: [{
                        label: '2020 vehicle accident deaths',
                        data: auto_deaths_2020,
                        backgroundColor: '#e19073',
                        borderWidth: 0,
                        barThickness: barHeight
                    }, {
                        label: '2020 pedestrian deaths',
                        data: ped_deaths_2020,
                        backgroundColor: '#e1b673',
                        borderWidth: 0,
                        barThickness: barHeight
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true,
                            position: 'top', // x axis on top
                        },
                        y: {
                            ticks: {
                                autoSkip: false,
                                maxRotation: 0
                            }
                        }
                    }
                }
            });
        }
    });
});