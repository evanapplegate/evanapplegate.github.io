fetch('https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/FL_nursing_homes/FL_US_pop.csv')
    .then(response => response.text())
    .then(csvData => {
        const rows = csvData.split('\n');
        const labels = [];
        const flShares = [];
        const usShares = [];
        const flCounts = [];
        const usCounts = [];

        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');
            labels.push(columns[0]);
            flShares.push(parseFloat(columns[3]));
            usShares.push(parseFloat(columns[4]));
            flCounts.push(parseInt(columns[1]));
            usCounts.push(parseInt(columns[2]));
        }

        const barHeight = 15;
        const barGap = 30;
        const chartHeight = (barHeight + barGap) * 9;

        const chartCanvas = document.getElementById('chart');
        chartCanvas.style.height = chartHeight + 'px';

        const ctx = chartCanvas.getContext('2d');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Florida',
                        backgroundColor: '#a0dbe0', // Update FL Share color
                        data: flShares,
                        borderWidth: 0,
                        barThickness: barHeight
                    },
                    {
                        label: 'U.S.',
                        backgroundColor: '#f7bdbd', // Update US Share color
                        data: usShares,
                        borderWidth: 0,
                        barThickness: barHeight
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false, // Allow chart to resize without growing infinitely
                plugins: {
                    legend: {
                        position: 'top' // Show legend at the top
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const index = context.dataIndex;
                                const datasetIndex = context.datasetIndex;
                                const count = datasetIndex === 0 ? flCounts[index] : usCounts[index];
                                let label = '';
                                if (datasetIndex === 0) {
                                    label += 'Florida: ' + flShares[index].toFixed(1) + '%\n' + 'of population';
                                } else {
                                    label += 'U.S.: ' + usShares[index].toFixed(1) + '%\n' + 'of population' ;
                                }
                                label += ', ' + count.toLocaleString() + ' people';
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 14, // Set the X-axis maximum to 14
                        ticks: {
                            callback: function (value) {
                                return value + '%'; // Add "%" to the X-axis labels
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        minBarLength: barHeight, // Set the minimum bar height to the desired barHeight
                        barPercentage: 0.8 // Adjust the bar thickness (default is 0.9)
                    }
                },
                layout: {
                    padding: {
                        left: 50 // Adjust the left padding to accommodate labels
                    }
                },
                elements: {
                    bar: {
                        borderWidth: 1,
                    }
                },
            }
        });
    });
