const generateBtn = document.getElementById('generate-btn');
const numberElements = document.querySelectorAll('.number');
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

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
    const container = document.getElementById('draw-numbers');
    
    const fetchLotto = async (offset = 0) => {
        // 3번 이상 실패하면 포기
        if (offset > 2) {
            container.innerHTML = '<p style="color:#ff7272">데이터 점검 중 (잠시 후 다시 시도)</p>';
            return;
        }

        const firstDate = new Date('2002-12-07T20:45:00');
        const now = new Date();
        const diff = now - firstDate;
        const round = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1 - offset;

        const targetUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

        console.log(`Fetching round ${round} using proxy: ${proxyUrl}, attempt: ${offset + 1}`);

        try {
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                console.error(`Network response not ok for round ${round}, status: ${response.status}`);
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }

            const result = await response.json();
            console.log(`Raw proxy response for round ${round}:`, result);
            const data = JSON.parse(result.contents);
            console.log(`Parsed lottery data for round ${round}:`, data);

            if (data && data.returnValue === "success") {
                document.getElementById('draw-round').innerText = `제 ${data.drwNo}회`;
                document.getElementById('draw-date').innerText = `(${data.drwNoDate})`;

                const nums = [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6];
                container.innerHTML = nums.map(n => `<div class="ball ${getRangeClass(n)}">${n}</div>`).join('');
                container.innerHTML += `<span class="plus-sign">+</span>`;
                container.innerHTML += `<div class="ball ${getRangeClass(data.bnusNo)}">${data.bnusNo}</div>`;
            } else {
                console.warn(`Lottery API returned non-success for round ${round}:`, data);
                // 이번 주 데이터가 아직 없거나 success가 아니면 재시도
                fetchLotto(offset + 1);
            }
        } catch (err) {
            console.error(`Attempt ${offset + 1} failed for round ${round}:`, err);
            fetchLotto(offset + 1);
        }
    };

    fetchLotto(0);
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