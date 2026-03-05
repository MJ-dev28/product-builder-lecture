// Teachable Machine Model URL - Replace with your own model URL
const URL = "https://teachablemachine.withgoogle.com/models/p-vS89T2j/";

let model, labelContainer, maxPredictions;

const imageInput = document.getElementById('image-input');
const uploadBtn = document.getElementById('upload-btn');
const faceImage = document.getElementById('face-image');
const uploadLabel = document.getElementById('upload-label');
const imageUploadArea = document.getElementById('image-upload-area');
const loadingContainer = document.getElementById('loading-container');
const resultContainer = document.getElementById('result-container');
const resultTitle = document.getElementById('result-title');
const labelContainerElement = document.getElementById('label-container');
const retryBtn = document.getElementById('retry-btn');

// Load the image model and setup the UI
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded successfully");
    } catch (e) {
        console.error("Failed to load model", e);
        alert("모델을 불러오는데 실패했습니다. URL을 확인해주세요.");
    }
}

// Handle image upload and prediction
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        // Show image preview
        faceImage.src = e.target.result;
        faceImage.classList.remove('hidden');
        uploadLabel.classList.add('hidden');
        
        // Show loading state
        loadingContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');

        // Wait for image to load
        faceImage.onload = async function() {
            await predict();
            loadingContainer.classList.add('hidden');
            resultContainer.classList.remove('hidden');
        };
    };
    reader.readAsDataURL(file);
}

// Run the image through the model
async function predict() {
    if (!model) await init();
    
    const prediction = await model.predict(faceImage);
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));

    // Display Top Result
    const topResult = prediction[0].className;
    resultTitle.innerText = `당신은 '${topResult}'상 입니다!`;

    // Display all results with bars
    labelContainerElement.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const resultItem = document.createElement("div");
        resultItem.className = "result-bar-wrapper";
        resultItem.innerHTML = `
            <span class="result-label">${classPrediction} (${probability}%)</span>
            <div class="bar-container">
                <div class="bar" style="width: ${probability}%"></div>
            </div>
        `;
        labelContainerElement.appendChild(resultItem);
    }
}

// Event Listeners
uploadBtn.addEventListener('click', () => imageInput.click());
imageUploadArea.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', handleImageUpload);

retryBtn.addEventListener('click', () => {
    faceImage.src = "";
    faceImage.classList.add('hidden');
    uploadLabel.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    imageInput.value = "";
});

// Drag and drop support
imageUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUploadArea.style.backgroundColor = "#f0f0ff";
});

imageUploadArea.addEventListener('dragleave', () => {
    imageUploadArea.style.backgroundColor = "#fdfdfd";
});

imageUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUploadArea.style.backgroundColor = "#fdfdfd";
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        imageInput.files = files;
        handleImageUpload({ target: imageInput });
    }
});

// Initialize model on load
init();
