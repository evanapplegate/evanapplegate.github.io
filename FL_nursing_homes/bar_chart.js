        // Fetch the CSV data
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

                const chartCanvas = document.getElementById('chart');
                const ctx = chartCanvas.getContext('2d');

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'FL Share',
                                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                data: flShares,
                                tooltips: {
                                    callbacks: {
                                        title: function (tooltipItems) {
                                            return labels[tooltipItems[0].index];
                                        },
                                        label: function (tooltipItem) {
                                            return 'FL Count: ' + flCounts[tooltipItem.index];
                                        }
                                    }
                                }
                            },
                            {
                                label: 'US Share',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                data: usShares,
                                tooltips: {
                                    callbacks: {
                                        title: function (tooltipItems) {
                                            return labels[tooltipItems[0].index];
                                        },
                                        label: function (tooltipItem) {
                                            return 'US Count: ' + usCounts[tooltipItem.index];
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'right',
                            }
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                max: 100 // Adjust the maximum value if needed
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