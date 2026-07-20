// dice.js


import { movePlayer } from "../board/move.js";
import { checkRollAvailable } from "./diceFirebase.js";

// DOM
const dice = document.getElementById("dice");
const diceBtn = document.getElementById("diceBtn");
const diceModal = document.getElementById("diceModal");
const diceResult = document.getElementById("diceResult");
const alertModal = document.getElementById("alertModal");
const alertMessage = document.getElementById("alertMessage");
const alertCloseBtn = document.getElementById("alertCloseBtn");

let rolling = false;

function showAlert(message) {
    alertMessage.textContent = message;
    alertModal.classList.remove("hidden");
}

function hideAlert() {
    alertModal.classList.add("hidden");
}


// 이벤트
diceBtn.addEventListener("click", rollDice);
alertCloseBtn.addEventListener("click", hideAlert);


// 주사위 굴리기
async function rollDice() {

    if (rolling) return;

    try {
        await checkRollAvailable();
    } catch (err) {
        console.error(err);

        showAlert(err.message);

        return;
    }
    
    rolling = true;
    diceBtn.disabled = true;
    diceModal.classList.remove("hidden");
    diceResult.textContent = "주사위를 굴리는 중...";

    // 결과 먼저 결정
    const number = Math.floor(Math.random() * 6) + 1;

    // ZIP 원본 회전값
    const faceRotation = {
        1: { x:   0, y:   0 },
        2: { x:  90, y:   0 },
        3: { x:   0, y: -90 },
        4: { x:   0, y:  90 },
        5: { x: -90, y:   0 },
        6: { x:   0, y: 180 }
    };

    const spinX = 1080 + faceRotation[number].x;
    const spinY = 1080 + faceRotation[number].y;

    dice.style.transition="none";
    dice.style.transform="rotateX(0deg) rotateY(0deg)";

    setTimeout(() => {
        dice.style.transition = "transform .9s cubic-bezier(.2,.8,.2,1)";
        dice.style.transform = `rotateX(${spinX}deg) rotateY(${spinY}deg)`;
    }, 50);

    sessionStorage.setItem("dice", number);


    setTimeout(() => {
        diceResult.textContent =
            `${number}이(가) 나왔습니다!`;
    }, 900);

    
    setTimeout(async () => {
        diceModal.classList.add("hidden");
        await movePlayer(number);
        rolling = false;
        diceBtn.disabled = false;
        diceBtn.classList.add("cooldown");
    }, 3000);
}


// 시간 확인해서 버튼 색 정하기
async function checkDiceButton() {

    try {await checkRollAvailable();
        // 주사위 가능
        diceBtn.classList.remove("cooldown");
    } catch(err) {
        // 주사위 사용 불가
        diceBtn.classList.add("cooldown");
    }
}

checkDiceButton();