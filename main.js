const generateBtn = document.getElementById('generate-btn');
const numberElements = document.querySelectorAll('.number');

function generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers);
}

function displayNumbers() {
    const generatedNumbers = generateNumbers();
    numberElements.forEach((element, index) => {
        element.textContent = generatedNumbers[index];
    });
}

generateBtn.addEventListener('click', displayNumbers);

// Initial generation
displayNumbers();
