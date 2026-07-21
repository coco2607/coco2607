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
import { trim, createId } from "../utils.js";

const USERS = "users";
const myConnectionId = createId();
let myNickname = "";


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
    myNickname = nickname;

    const nicknameRef = ref(db, `nicknames/${nickname}`);

    const result = await runTransaction(
        nicknameRef,
        current => {

            if (current === null) {
                return myConnectionId;
            }

            return;

        }
    );

    if (!result.committed) {
        throw new Error("이미 사용 중인 닉네임입니다.");
    }

    const userRef = ref(db, `${USERS}/${myConnectionId}`);

    await set(userRef, {
        nickname,
        joinTime: serverTimestamp()
    });

    onDisconnect(userRef).remove();
    onDisconnect(nicknameRef).remove();

}