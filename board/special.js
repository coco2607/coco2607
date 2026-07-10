//special.js

import { showPopup } from "./popup.js";

let lastNormal = "";
let lastNormalPoint = 0;

let lastspecial = "";
let lastspecialPoint = 0;

export function checkSpecial(position) {

    // 이전 보상 초기화
    lastNormal = "";
    lastNormalPoint = 0;

    lastspecial = "";
    lastspecialPoint = 0;

    switch (position) {

        case 10:
            lastspecial = "무인도";
            lastspecialPoint = -1;
            showPopup(
                [
                    "니가 가라 무인도<br>-1 포인트",
                    "오늘부터 친구는 코코넛뿐!<br>-1 포인트",
                    "으차헬기 올 때까지 대기!<br>-1 포인트",
                    "축! 자연인 체험권 당첨!<br>-1 포인트",
                    "무인도 입국 심사 완료!<br>-1 포인트"
                ][Math.floor(Math.random() * 5)],
                "island.jpg"
            );
            break;

        case 20:
            lastspecial = "호캉스";
            lastspecialPoint = 5;
            showPopup(
                [
                    "모히또에서 몰디브 한 잔!<br>+5 포인트",
                    "으랏차차 호텔은 모든게 셀프<br>+5 포인트",
                    "호캉스고 뭐고 귀찮긴한데<br>+5 포인트",
                    "싸장님. 팁 띱 딥 띠입<br>+5 포인트"
                ][Math.floor(Math.random() * 4)],
                "hotel.jpg"
            );
            break;

        case 30:
            lastspecial = "행운복권";
            lastspecialPoint = 0;
            showPopup(
                "축! 으랏차차 행운복권 당첨!",
                "lottery.jpg",
                "lottery"
            );
            break;

        case 40:
            lastspecial = "은행";
            lastspecialPoint = 2;
            showPopup(
                [                
                "여기까지 온다고 고생함<br>+2 포인트",
                "고생했으니 포인트 받아랏!<br>+2 포인트",
                "으차방 벙신으로 임명함<br>+2 포인트",
                "1바퀴 완주? 큰 숫자만 나왔나베<br>+2 포인트"
                ][Math.floor(Math.random() * 4)],
                "bank.jpg"
            );
            break;

        default:
            if (
                position !== 10 &&
                position !== 20 &&
                position !== 30 &&
                position !== 40
            ) {
                const point = [
                    3,1,1,1,2,1,1,2,1,
                    0,
                    2,3,1,1,2,1,1,2,1,
                    0,
                    2,2,1,2,1,2,1,3,1,
                    0,
                    3,2,2,2,3,2,3,2,3,
                    0
                ][position - 1];
                lastNormal = "일반";
                lastNormalPoint = point;
                showPopup(`+${point} 포인트를 획득했습니다!`);
            }
        break;
    }
}

export function getreward() {

    return {
        normal: lastNormal,
        normalPoint: lastNormalPoint,

        special: lastspecial,
        specialPoint: lastspecialPoint,

        tpoint:
            lastNormalPoint + lastspecialPoint
    };
}