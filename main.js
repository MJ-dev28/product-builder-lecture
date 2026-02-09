const generateBtn = document.getElementById('generate-btn');
const numberElements = document.querySelectorAll('.number');
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.getElementById('app-html');

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

function toggleTheme() {
    if (htmlElement.classList.contains('dark-mode')) {
        htmlElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
}

// Set initial theme based on localStorage or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark-mode');
    }
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // If no saved theme, check system preference
    htmlElement.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
} else {
    localStorage.setItem('theme', 'light');
}

generateBtn.addEventListener('click', displayNumbers);
themeToggleBtn.addEventListener('click', toggleTheme);

// Initial generation
displayNumbers();
