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

        const ctx = document.getElementById('chart').getContext('2d');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'FL Share',
                        backgroundColor: '#a0dbe0', // Update FL Share color
                        data: flShares
                    },
                    {
                        label: 'US Share',
                        backgroundColor: '#f7bdbd', // Update US Share color
                        data: usShares
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
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
                                    label += 'FL Share: ' + flShares[index].toFixed(1) + '%\n';
                                } else {
                                    label += 'US Share: ' + usShares[index].toFixed(1) + '%\n';
                                }
                                label += 'Count: ' + count.toLocaleString();
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
                        beginAtZero: true
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
