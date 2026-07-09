// boardFirebase.js

import {
    db,
    ref,
    get
} from "../firebase.js";


// 유저 정보 가져오기
export async function getUser(nickname) {

    const snapshot =
        await get(ref(db, `users/${nickname}`));

    if (!snapshot.exists()) {
        return {
            last: 0,
            totalP: 0
        };
    }

    return snapshot.val();

}