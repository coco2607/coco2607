// move.js

import { boardData } from "./boardData.js";
import {
    checkSpecial,
    getreward
} from "./special.js";
import { saveDiceResult } from "../dice/diceFirebase.js";


const playerPin = document.getElementById("playerPin");
const positionText = document.getElementById("position");

let needRefreshPoint = false;

let reward = {
    normal:"",
    normalPoint:0,
    special:"",
    specialPoint:0,
    tpoint:0
};

// 말 이동
export async function movePlayer(step) {
    let passedBank = false;
    let position =
        Number(sessionStorage.getItem("position")) || 0;

    const startPosition = position;

    for (let i = 0; i < step; i++) {
        position++;

        if (position > 40) {
            position = 1;
            passedBank = true;
        }

        sessionStorage.setItem("position", position);
        updateMarker(position);
        await wait(300);
    }

    // 먼저 도착한 칸 이벤트
    checkSpecial(position);
    let reward = getreward();

    // 40번을 지나갔다면 은행 이벤트
    if (passedBank) {

        await wait(1500);
        checkSpecial(40);
        const bankResult = getreward();

        reward.special = bankResult.special;
        reward.specialPoint = bankResult.specialPoint;
        reward.tpoint += bankResult.specialPoint;
    }

    
    // 이동 기록 저장
    await saveDiceResult({

        date: new Date().toISOString().slice(0,10),
        time: new Date().toLocaleTimeString(),
        nickname: sessionStorage.getItem("nickname"),
        joinDate: sessionStorage.getItem("joinDate"),

        // 이동 정보
        start: startPosition,
        dice: step,
        end: position,

        // 일반칸 보상
        normal: reward.normal,
        normalPoint: reward.normalPoint,

        // 특별 이벤트
        special: reward.special,
        specialPoint: reward.specialPoint,

        // 총 획득 포인트
        tpoint: reward.tpoint

    });

    needRefreshPoint = true;

}

// 말 위치
export function updateMarker(position) {

    if (position === 0) {
        positionText.textContent = "0번";
        return;
    }

    const tile = boardData[position];

    if (!tile) return;

    playerPin.style.left = tile.x + "%";
    playerPin.style.top = tile.y + "%";
    positionText.textContent = `${position}번`;
}

// 대기
function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}