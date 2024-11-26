// document.getElementById('surveyForm').addEventListener('submit', async function (event) {
//     event.preventDefault();
//     console.log('Submit button is pressed')
//     // Collect form data
//     const formData = new FormData(event.target);
//     const data = {};
//     formData.forEach((value, key) => {
//         data[key] = value;
//     });

//     // Submit responses to the backend
//     const response = await fetch('/submit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//     });

//     const groupScores = await response.json();

//     // Generate the chart
//     const ctx = document.getElementById('resultsChart').getContext('2d');
//     new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: Object.keys(groupScores),
//             datasets: [{
//                 label: 'Group Scores (Normalized to 100)',
//                 data: Object.values(groupScores),
//                 backgroundColor: 'rgba(75, 192, 192, 0.6)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             scales: {
//                 y: { beginAtZero: true, max: 100 }
//             }
//         }
//     });
// });
