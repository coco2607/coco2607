// dice.js


import { movePlayer } from "../board/move.js";
import { checkRollAvailable } from "./diceFirebase.js";

// DOM
const dice = document.getElementById("dice");
const diceBtn = document.getElementById("diceBtn");
const diceModal = document.getElementById("diceModal");
const diceResult = document.getElementById("diceResult");

let rolling = false;

// 이벤트
diceBtn.addEventListener("click", rollDice);

// 주사위 굴리기
async function rollDice() {

    if (rolling) return;

    try {
        await checkRollAvailable();
    } catch (err) {
        console.error(err);
        alert(err.message);
        return;
    }

    rolling = true;
    diceBtn.disabled = true;
    diceModal.classList.remove("hidden");
    diceResult.textContent = "주사위를 굴리는 중...";

    // 결과 먼저 결정
    //const number = Math.floor(Math.random() * 6) + 1;
    const number = 4;

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
    }, 2500);
}


// 시간 확인해서 버튼 색 정하기
async function checkDiceButton() {

    try {await checkRollAvailable();
        // 주사위 가능
        diceBtn.classList.remove("cooldown");
    } catch(err) {
        // 10시간 제한 중
        diceBtn.classList.add("cooldown");
    }
}

checkDiceButton();