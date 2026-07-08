// diceFirebase.js

import {
    db,
    ref,
    get,
    push,
    set,
    update
} from "../firebase.js";

import {
    getCurrentDate,
    getCurrentTime
} from "../utils.js";


const ROLL_LIMIT = 10 * 60 * 60 * 1000;// 주사위제한시간
const HISTORY = "history";

// 주사위 결과 저장
export async function saveDiceResult(data) {

    const historyRef =
        push(ref(db, HISTORY));

    await set(historyRef, {
        date: data.date,
        time: data.time,
        nickname: data.nickname,
        joinDate: data.joinDate,

        dice: data.dice,
        start: data.start,
        end: data.end,

        normal: data.normal, //일반보상
        normalPoint: data.normalPoint,

        special: data.special, //특별이벤트
        specialPoint: data.specialPoint, 

        tpoint: data.tpoint,

        event:"",
        eventPoint:0,

        redeem:"",
        redeemPoint:0,

        timestamp: Date.now()
    });

    // 현재 totalP 읽기
    const userRef = ref(db, `users/${data.nickname}`);
    const snapshot = await get(userRef);

    let currentTotal = 0;

    if (snapshot.exists()) {
        currentTotal = snapshot.val().totalP || 0;
    }

    // 새로운 totalP 계산
    const newTotal = currentTotal + data.tpoint;

    // 현재 상태 저장
    await update(userRef, {
        lastRoll: Date.now(),
        joinDate: data.joinDate,
        last: data.end,
        totalP: newTotal
    });

}


// 주사위 사용 가능 확인
export async function checkRollAvailable() {

    const nickname = sessionStorage.getItem("nickname");
    const snapshot = await get(ref(db, `users/${nickname}`));

    if (!snapshot.exists()) return;

    const user = snapshot.val();
    const lastRoll = user.lastRoll || 0;

    if (lastRoll > 0) {

        const diff = Date.now() - lastRoll;

        if (diff < ROLL_LIMIT) {

            const remain = ROLL_LIMIT - diff;
            const hour = Math.floor(remain / 3600000);
            const minute = Math.floor((remain % 3600000) / 60000);

            throw new Error(
                `${hour}시간 ${minute}분 후 다시 주사위를 굴릴 수 있습니다.`
            );
        }
    }
}