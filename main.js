const URL = "https://teachablemachine.withgoogle.com/models/nuaRlSR6k/";

let model, webcam, labelContainer, maxPredictions;
let sentence = "";
let isRunning = false;
let isPaused = false;

let confidenceThreshold = 0.75;
let WINDOW_SIZE = 8;
let predictionWindow = [];
let lastAddedChar = "";
let cooldownFrames = 20;
let cooldownCounter = 0;

function updateThreshold(val) {
    confidenceThreshold = val / 100;
    document.getElementById("threshold-value").textContent = val + "%";
}

function updateHoldTime(val) {
    WINDOW_SIZE = parseInt(val);
    document.getElementById("hold-time-value").textContent = val + " frames";
}

async function init() {
    if (isRunning) return;

    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
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

    document.querySelectorAll("button").forEach(b => b.disabled = false);
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

    let bestClass = "";
    let bestProb = 0;

    prediction.forEach((p, i) => {
        labelContainer.childNodes[i].innerHTML =
            `${p.className}: ${(p.probability * 100).toFixed(1)}%`;

        if (p.probability > bestProb) {
            bestProb = p.probability;
            bestClass = p.className;
        }
    });

    if (bestProb < confidenceThreshold || isPaused) {
        predictionWindow = [];
        return;
    }

    document.getElementById("current-detection").textContent = bestClass;

    if (cooldownCounter > 0) {
        cooldownCounter--;
        return;
    }

    predictionWindow.push(bestClass);
    if (predictionWindow.length > WINDOW_SIZE) {
        predictionWindow.shift();
    }

    const counts = {};
    predictionWindow.forEach(c => counts[c] = (counts[c] || 0) + 1);

    const [winner, freq] =
        Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

    if (freq >= WINDOW_SIZE * 0.75 && winner !== lastAddedChar) {
        sentence += winner;
        document.getElementById("sentence-display").textContent = sentence;

        lastAddedChar = winner;
        predictionWindow = [];
        cooldownCounter = cooldownFrames;
    }
}

function togglePause() {
    isPaused = !isPaused;
    const indicator = document.getElementById("mode-indicator");
    indicator.textContent = isPaused ? "Paused" : "Auto-Adding";
    indicator.className = "mode-indicator " +
        (isPaused ? "mode-paused" : "mode-active");
}

function addSpace() {
    sentence += " ";
    document.getElementById("sentence-display").textContent = sentence;
}

function clearSentence() {
    sentence = "";
    lastAddedChar = "";
    document.getElementById("sentence-display").textContent = "";
}

function speakSentence() {
    if (!sentence.trim()) return;
    speechSynthesis.speak(new SpeechSynthesisUtterance(sentence));
}
