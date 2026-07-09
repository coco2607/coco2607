// board.js

import "../dice/dice.js";
import { updateMarker } from "./move.js";
import { getUser } from "./boardFirebase.js";
import { checkSpecial } from "./special.js";

// 요소 가져오기
const nickname = document.getElementById("nickname");
const joinDate = document.getElementById("joinDate");
const totalPoint = document.getElementById("totalPoint");

// 초기 실행
loadPlayer();

// 플레이어 정보 불러오기
async function loadPlayer() {

    const playerName = sessionStorage.getItem("nickname");
    const playerJoinDate = sessionStorage.getItem("joinDate");

    nickname.textContent = `${playerName || "닉네임"}님`;

    if (playerJoinDate) {
        const date = new Date(playerJoinDate);

        joinDate.textContent =
            `${date.getMonth() + 1}월 ${date.getDate()}일`;
    } else {
        joinDate.textContent = "";
    }

    // Firebase에서 마지막 도착 위치 가져오기
    const user = await getUser(playerName);
    const playerPosition = user.last || 0;

    // 가져온 위치 저장
    sessionStorage.setItem(
        "position",
        playerPosition
    );

    // 말 이동 표시
    updateMarker(Number(playerPosition) || 0);
    totalPoint.textContent = `${user.totalP || 0}P`;
}


// 테스트용 강제 이동
window.testMove = function(position){

    const pos = Number(position);

    if(pos < 1 || pos > 40){
        alert("1~40 사이 숫자를 입력하세요.");
        return;
    }

    sessionStorage.setItem(
        "position",
        pos
    );

    updateMarker(pos);

    checkSpecial(pos);

    console.log(
        `${pos}번 칸 이벤트 테스트`
    );

};