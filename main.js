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

async function initLatestLotto() {
    // 1. 최신 회차 계산 (1회: 2002-12-07 20:45)
    const getLatestRound = () => {
        const firstDate = new Date('2002-12-07T20:45:00');
        const now = new Date();
        const diff = now - firstDate;
        return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
    };

    const round = getLatestRound();
    const container = document.getElementById('draw-numbers');

    try {
        // 2. CORS 우회를 위한 프록시 API 사용
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=' + round)}`);
        const result = await response.json();
        const data = JSON.parse(result.contents);

        if (data.returnValue === "success") {
            // 헤더 정보 업데이트
            document.getElementById('draw-round').innerText = `제 ${data.drwNo}회`;
            document.getElementById('draw-date').innerText = data.drwNoDate;

            // 번호 배열 생성
            const nums = [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6];
            
            // 공 렌더링
            container.innerHTML = nums.map(n => `<div class="ball ${getRangeClass(n)}">${n}</div>`).join('');
            container.innerHTML += `<span class="plus-sign">+</span>`;
            container.innerHTML += `<div class="ball ${getRangeClass(data.bnusNo)}">${data.bnusNo}</div>`;
        }
    } catch (err) {
        container.innerHTML = '<p style="color:#ff7272">데이터를 불러올 수 없습니다.</p>';
    }
}

function getRangeClass(n) {
    if (n <= 10) return 'range-1';
    if (n <= 20) return 'range-11';
    if (n <= 30) return 'range-21';
    if (n <= 40) return 'range-31';
    return 'range-41';
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', initLatestLotto);