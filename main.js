const URL = "https://teachablemachine.withgoogle.com/models/nuaRlSR6k/";
let model, webcam, labelContainer, maxPredictions;

let sentence = "";
let isRunning = false;
let isPaused = false;

let confidenceThreshold = 0.70;
let holdTimeFrames = 15;
let stableDetection = "";
let stableCount = 0;

function updateThreshold(value) {
    confidenceThreshold = value / 100;
    document.getElementById("threshold-value").textContent = value + "%";
}

function updateHoldTime(value) {
    holdTimeFrames = parseInt(value);
    document.getElementById("hold-time-value").textContent =
        (value / 10).toFixed(1) + "s";
}

async function init() {
    if (isRunning) return;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(400, 400, true);
    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    document.getElementById("pause-btn").disabled = false;
    document.getElementById("add-space-btn").disabled = false;
    document.getElementById("clear-btn").disabled = false;
    document.getElementById("speak-btn").disabled = false;
    document.getElementById("start-btn").disabled = true;
    document.getElementById("mode-indicator").style.display = "inline-block";

    isRunning = true;
    window.requestAnimationFrame(loop);
}

async function loop() {
    if (!isRunning) return;
    webcam.update();
    await predict();
    requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let maxProb = 0;
    let detected = "";

    prediction.forEach((p, i) => {
        labelContainer.childNodes[i].innerHTML =
            `${p.className}: ${(p.probability * 100).toFixed(1)}%`;
        if (p.probability > maxProb) {
            maxProb = p.probability;
            detected = p.className;
        }
    });

    if (maxProb > confidenceThreshold && !isPaused) {
        if (detected === stableDetection) {
            stableCount++;
            if (stableCount === holdTimeFrames) {
                sentence += detected;
                document.getElementById("sentence-display").textContent = sentence;
                stableDetection = "";
                stableCount = 0;
            }
        } else {
            stableDetection = detected;
            stableCount = 1;
        }
        document.getElementById("current-detection").textContent = detected;
    }
}

function togglePause() {
    isPaused = !isPaused;
}

function addSpace() {
    sentence += " ";
    document.getElementById("sentence-display").textContent = sentence;
}

function clearSentence() {
    sentence = "";
    document.getElementById("sentence-display").textContent = "";
}

function speakSentence() {
    if (!sentence.trim()) return;
    const utterance = new SpeechSynthesisUtterance(sentence);
    speechSynthesis.speak(utterance);
}
