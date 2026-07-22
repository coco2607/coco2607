//loginFirebase.js

import {
    db,
    ref,
    get,
    set,
    onDisconnect,
    runTransaction,
    serverTimestamp
} from "../firebase.js";
import { trim } from "../utils.js";

const PLAYER = "player";


// 로그인확인
export async function login(nickname, password) {

    nickname = trim(nickname);
    password = trim(password);

    if (nickname === "") {
        throw new Error("닉네임 2자를 입력하세요.");
    }

    if (password === "") {
        throw new Error("비밀번호를 입력해주세요.");
    }

    const access = await checkAccess(password);

    if (!access) {
        throw new Error("비밀번호가 올바르지 않습니다.");
    }

    return true;
}


// 일반회원비밀번호확인
async function checkAccess(password) {

    const snapshot = await get(ref(db, "access/password"));
    if (!snapshot.exists()) {
        return false;
    }
    return snapshot.val() === password;
}


// 닉네임 중복 확인 및 접속 등록
export async function joinUser(nickname) {

    const playerRef = ref(db, `player/${nickname}`);

    const result = await runTransaction(
        playerRef,
        current => {
            if (current === null) {

                return {
                    joinTime: Date.now()
                };
            }
            return;
        }
    );

    if (!result.committed) {
        throw new Error("이미 접속중 입니다.");
    }

    await onDisconnect(playerRef).remove();

}