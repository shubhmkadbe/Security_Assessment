

function toggleFlip(groupName) {
    const flipContainer = document.getElementById(`flip-${groupName}`);
    flipContainer.classList.toggle('flipped');
}

let currentlyFlipped = null; // Track the currently flipped tile

function toggleFlip(groupName) {
    const flipContainer = document.getElementById(`flip-${groupName}`);

    // Close previously flipped tile if it exists and is not the same as the clicked tile
    if (currentlyFlipped && currentlyFlipped !== flipContainer) {
        currentlyFlipped.classList.remove('flipped');
    }

    // Toggle the current tile
    flipContainer.classList.toggle('flipped');

    // Update the currently flipped tile
    currentlyFlipped = flipContainer.classList.contains('flipped') ? flipContainer : null;
}

function getRandomColor() {
// Predefined list of 10 colors
const colors = [
"#e6e2d3",
"#dac292",
"#c4b7a6",
"#b9936c",
];

// Randomly pick a color from the array
return colors[Math.floor(Math.random() * colors.length)];
}
function applyRandomColors() {
const tiles = document.querySelectorAll('.flip-container'); // Select each tile
tiles.forEach(tile => {
const front = tile.querySelector('.front');
const back = tile.querySelector('.back');
const randomColor = getRandomColor();

// Apply the same random color to both front and back
front.style.backgroundColor = randomColor;
back.style.backgroundColor = randomColor;
});
}

// Apply colors when the page loads
document.addEventListener('DOMContentLoaded', applyRandomColors);
document.getElementById('surveyForm').addEventListener('submit', async function (event) {

    event.preventDefault();
    // 
    console.log('Submit button is pressed');

    // Collect form data
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    //     // Submit responses to the backend
    const response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    document.getElementById('downloadBtn').style.display = 'block'; 

    const groupScores = await response.json();
    console.log(groupScores);

    //     // Generate the chart
    const ctx = document.getElementById('resultsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(groupScores),
            datasets: [{
                label: 'Group Scores (Normalized to 100)',
                data: Object.values(groupScores),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });

    // Enable download button
    document.getElementById('downloadBtn').disabled = false;
});

// Toggle visibility of questions when a group is clicked
function toggleQuestions(groupName) {
    const questionsDiv = document.getElementById(groupName);
    const isVisible = questionsDiv.style.display === 'block';
    questionsDiv.style.display = isVisible ? 'none' : 'block';
}

document.getElementById('downloadBtn').addEventListener('click', async function () {
    // Use html2canvas to capture the canvas element
    const canvasElement = document.getElementById('resultsChart');
    const canvasDataURL = canvasElement.toDataURL('image/png'); // Get the canvas as an image

    // Create a new PDF document using jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Set PDF dimensions based on the canvas size
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvasElement.height * pdfWidth) / canvasElement.width;

    // Add the image to the PDF
    pdf.addImage(canvasDataURL, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Download the PDF
    pdf.save('ResultChart.pdf');
});
