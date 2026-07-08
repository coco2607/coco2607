// boardFirebase.js

import {
    db,
    ref,
    get
} from "../firebase.js";


// 마지막 위치 가져오기
export async function getLast(nickname) {

    const snapshot =
        await get(ref(db, `users/${nickname}`));

    if (!snapshot.exists()) {
        return 0;
    }

    return snapshot.val().last || 0;

}