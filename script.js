let studdedTires = [];
let nonStuddedTires = [];
let barChart;
let radarChart;

async function fetchData() {
    const studdedResponse = await fetch('studded.csv');
    const nonStuddedResponse = await fetch('non-studded.csv');

    const studdedText = await studdedResponse.text();
    const nonStuddedText = await nonStuddedResponse.text();

    studdedTires = Papa.parse(studdedText, { header: true }).data;
    nonStuddedTires = Papa.parse(nonStuddedText, { header: true }).data;

    createTireSelector();
    createBarChart('Final Score');
    createRadarChart();
}

function createTireSelector() {
    const selectorDiv = document.getElementById('tireSelector');
    const allTires = [...studdedTires, ...nonStuddedTires];

    allTires.forEach((tire, index) => {
        const checkbox = document.createElement('div');
        checkbox.className = 'tire-checkbox';
        checkbox.innerHTML = `
            <input type="checkbox" id="tire${index}" value="${tire.Tyre}" ${index < 2 ? 'checked' : ''}>
            <label for="tire${index}">${tire.Tyre}</label>
        `;
        selectorDiv.appendChild(checkbox);
    });

    selectorDiv.addEventListener('change', createRadarChart);
}

function createBarChart(dataType) {
    const ctx = document.getElementById('tireChart').getContext('2d');
    const studdedLabels = studdedTires.map(tire => tire.Tyre);
    const nonStuddedLabels = nonStuddedTires.map(tire => tire.Tyre);
    const studdedData = studdedTires.map(tire => parseFloat(tire[dataType]));
    const nonStuddedData = nonStuddedTires.map(tire => parseFloat(tire[dataType]));

    if (barChart) {
        barChart.destroy();
    }

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [...studdedLabels, ...nonStuddedLabels],
            datasets: [
                {
                    label: 'Studded Tires',
                    data: [...studdedData, ...Array(nonStuddedLabels.length).fill(null)],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Non-Studded Tires',
                    data: [...Array(studdedLabels.length).fill(null), ...nonStuddedData],
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Tire Comparison - ${dataType}`
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createRadarChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const attributes = ['Ice', 'Snow', 'Wet', 'Dry', 'Comfort', 'Stability', 'Fuel Efficiency'];
    const allTires = [...studdedTires, ...nonStuddedTires];

    const selectedTires = Array.from(document.querySelectorAll('#tireSelector input:checked'))
        .map(checkbox => checkbox.value);

    const datasets = allTires
        .filter(tire => selectedTires.includes(tire.Tyre))
        .map(tire => ({
            label: tire.Tyre,
            data: attributes.map(attr => parseFloat(tire[attr])),
            fill: true,
            backgroundColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.2)`,
            borderColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1)`,
            pointBackgroundColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1)`,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1)`
        }));

    if (radarChart) {
        radarChart.destroy();
    }

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: attributes,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Tire Comparison - Multiple Attributes'
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    suggestedMin: 0,
                    suggestedMax: 20
                }
            }
        }
    });
}

document.getElementById('chartType').addEventListener('change', (e) => {
    createBarChart(e.target.value);
});

fetchData();