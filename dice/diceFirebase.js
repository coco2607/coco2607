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


const HISTORY = "history";


// 주사위 제한시간 가져오기
async function getDiceCooldown() {

    const snapshot = await get(ref(db, "access/diceCooldown"));

    if (!snapshot.exists()) {
        return 10 * 60 * 60 * 1000; // 기본값 10시간
    }

    return Number(snapshot.val());
}


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

    // 새로운 totalP 계산 최대 40점까지
    const newTotal = Math.min(currentTotal + data.tpoint, 40);

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

    // 사용자 정보와 쿨타임을 동시에 읽기
    const [userSnapshot, rollLimit] = await Promise.all([
        get(ref(db, `users/${nickname}`)),
        getDiceCooldown()
    ]);

    if (!userSnapshot.exists()) return;

    const user = userSnapshot.val();
    const lastRoll = user.lastRoll || 0;

    if (lastRoll > 0) {

        const diff = Date.now() - lastRoll;

        if (diff < rollLimit) {

            const remain = rollLimit - diff;
            const hour = Math.floor(remain / 3600000);
            const minute = Math.floor((remain % 3600000) / 60000);

            throw new Error(
                //`주사위는 벙참 당일에 1번만 가능합니다.\n(하루에 기회 1번! 중복으로 굴릴 수 없음)`
                `${hour}시간 ${minute}분 후 다시 주사위를 굴릴 수 있습니다.`
            );
        }
    }
}