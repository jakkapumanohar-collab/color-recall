let gameSeq = [];
let userSeq = [];

let started = false;
let level = 0;
let highScore = 0;

let h2 = document.querySelector("h2");
let btns = ["pink", "cream", "blue", "green"];

// ✅ Play sound using Web Audio API (no files needed)
function playSound(color) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    let freq = 0;
    if (color === "pink") freq = 261;   // C4
    if (color === "cream") freq = 329;  // E4
    if (color === "blue") freq = 392;   // G4
    if (color === "green") freq = 523;  // C5
    if (color === "wrong") freq = 150;  // Low buzz

    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.2, ctx.currentTime); // volume
    osc.start();
    osc.stop(ctx.currentTime + 0.3); // play 0.3 sec
}

// Start game with keypress
document.addEventListener("keypress", function () {
    if (started == false) {
        console.log("Game started!");
        started = true;
        levelUp();
    }
});

// Start game with restart button
document.getElementById("restart").addEventListener("click", function () {
    if (!started) {
        started = true;
        levelUp();
    }
});

function gameFlash(btn) {
    btn.classList.add("flash");
    playSound(btn.id); // ✅ play tone on flash
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    playSound(btn.id); // ✅ play tone on user click
    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 250);
}

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;

    let randInd = Math.floor(Math.random() * 4);
    let randColor = btns[randInd];
    let randBtn = document.querySelector(`.${randColor}`);

    gameSeq.push(randColor);
    console.log(gameSeq);

    gameFlash(randBtn);
}

function checkAns(inx) {
    if (userSeq[inx] == gameSeq[inx]) {
        if (userSeq.length == gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        // Update high score
        if (level > highScore) {
            highScore = level;
        }

        h2.innerHTML = `Game Over! Your score is <b>${level}</b> <br> High Score: ${highScore} <br> Press any key or click Restart to play again.`;

        playSound("wrong"); // ✅ buzz on wrong answer

        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "black";
        }, 250);
        reset();
    }
}

function btnPress() {
    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}