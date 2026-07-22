// login.js

import { login } from "./loginFirebase.js";
import { trim, pad } from "../utils.js";
import {
    db,
    ref,
    get
} from "../firebase.js";

// 요소 가져오기
const nickname = document.getElementById("nickname");
const enterBtn = document.getElementById("enterBtn");
const memberModal = document.getElementById("memberModal");
const memberPassword = document.getElementById("memberPassword");
const memberOkBtn = document.getElementById("memberOkBtn");
const memberCancelBtn = document.getElementById("memberCancelBtn");
const loginMessage = document.getElementById("loginMessage");
const dateModal = document.getElementById("dateModal");
const todayBtn = document.getElementById("todayBtn");
const yesterdayBtn = document.getElementById("yesterdayBtn");
const warningModal = document.getElementById("warningModal");
const warningText = document.getElementById("warningText");
const warningOk = document.getElementById("warningOk");

// 초기 실행
setDateButton();


// 이벤트
enterBtn.addEventListener("click", openLoginModal);
memberCancelBtn.addEventListener("click", closeLoginModal);
memberOkBtn.addEventListener("click", checkPassword);
todayBtn.addEventListener("click", selectToday);
yesterdayBtn.addEventListener("click", selectYesterday);

memberPassword.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        checkPassword();
    }
});

// 날짜 선택 모달 바깥 클릭 시 닫기
dateModal.addEventListener("click", (e) => {
    if (e.target === dateModal) {
        dateModal.classList.add("hidden");
    }
});

// 입장하기
function openLoginModal() {

    const name = trim(nickname.value);

    if (name === "") {
        showWarning("닉네임을 입력하세요.");
        nickname.focus();
        return;
    }

    // 한글 2자만 허용
    if (!/^[가-힣]{2}$/.test(name)) {
        showWarning("닉네임 2자를 입력하세요.");
        nickname.focus();
        nickname.select();
        return;
    }

    loginMessage.textContent = "";
    memberPassword.value = "";
    memberModal.classList.remove("hidden");
    memberPassword.focus();
}


// 로그인 모달 닫기
function closeLoginModal() {
    memberModal.classList.add("hidden");
}


// 비밀번호 확인
async function checkPassword() {

    const password = trim(memberPassword.value);

    if (password === "") {
        loginMessage.textContent = "비밀번호를 입력해주세요.";
        memberPassword.focus();
        return;
    }

    try {
        await login(nickname.value.trim(), password);

        memberModal.classList.add("hidden");
        dateModal.classList.remove("hidden");

    } catch (error) {
        loginMessage.textContent = error.message;
        memberPassword.select();
    }
}


// 오늘 선택
async function selectToday() {
    await checkJoinDate(getToday());
}


// 어제 선택
async function selectYesterday() {

    const date = new Date();
    date.setDate(date.getDate() - 1);

    await checkJoinDate(formatDate(date));
}

// joinDate 확인
async function checkJoinDate(joinDate) {

    const name = nickname.value.trim();

    const snapshot = await get(ref(db, `users/${name}`));

    if (!snapshot.exists()) {
        showWarning("회원 정보를 찾을 수 없습니다.");
        return;
    }

    const user = snapshot.val();

    // 이미 해당 날짜로 주사위를 굴림
    if (user.joinDate === joinDate) {
        showWarning("보드게임은 하루에 1번 참여할 수 있습니다.");
        return;
    }

    // 마지막 벙참 날짜보다 이전 날짜는 선택 불가
    if (user.joinDate && joinDate < user.joinDate) {
        showWarning("보드게임에 참여할 수 없는 날짜 입니다.");
        return;
    }

    enterGame(joinDate);
}


// 게임 입장
async function enterGame(joinDate) {

    const playerName = nickname.value.trim();

    console.log("저장할 닉네임 :", playerName);

    sessionStorage.setItem("nickname", playerName);
    sessionStorage.setItem("joinDate", joinDate);
    sessionStorage.setItem("point", 0);
    sessionStorage.setItem("position", 0);

    location.href = "../board/board.html";
}


// 날짜 버튼 표시
function setDateButton() {

    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);
    todayBtn.textContent = formatButtonDate(today, week);
    yesterdayBtn.textContent = formatButtonDate(yesterday, week);
}


// 버튼 날짜 형식
function formatButtonDate(date, week) {

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = week[date.getDay()];

    return `${month}월 ${day}일 ${weekday}요일`;
}


// 오늘 날짜
function getToday() {
    return formatDate(new Date());
}


// 날짜 형식
function formatDate(date) {

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${year}-${month}-${day}`;
}

// 경고 모달
function showWarning(message){
    warningText.textContent = message;
    warningModal.classList.remove("hidden");
}

warningOk.addEventListener("click", () => {
    warningModal.classList.add("hidden");
});