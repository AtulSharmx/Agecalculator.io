// Age Calculator (vanilla JS)
// I wrote it in a simple way so it's easy to understand as a beginner.

const btn = document.getElementById("btn");
const bdayInput = document.getElementById("birthday");

const yearsEl = document.getElementById("ageYears");
const monthsEl = document.getElementById("ageMonths");
const daysEl = document.getElementById("ageDays");
const hoursEl = document.getElementById("ageHours");
const minutesEl = document.getElementById("ageMinutes");
const secondsEl = document.getElementById("ageSeconds");
const msgEl = document.getElementById("msg");

let tickTimer = null;
let savedBirthday = null; // store Date object after user calculates

// Parse "yyyy-mm-dd" from input into a local Date at midnight.
// (I avoid "new Date('yyyy-mm-dd')" because timezone can make it confusing.)
function parseBirthday(dateStr) {
    const parts = dateStr.split("-");
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);

    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function daysInPrevMonth(year, monthIndex) {
    // monthIndex is 0..11 for "now month"
    // new Date(year, monthIndex, 0) gives last day of previous month
    return new Date(year, monthIndex, 0).getDate();
}

function getAgeParts(birthDate, now) {
    if (!birthDate || now < birthDate) return null;

    // First do years/months/days using normal borrowing logic (like school maths)
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    // borrow days from previous month
    if (days < 0) {
        months -= 1;
        days += daysInPrevMonth(now.getFullYear(), now.getMonth());
    }

    // borrow months from previous year
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // Now calculate hours/minutes/seconds from the "remaining time"
    // Anchor = birthDate + (years, months, days) at midnight
    const anchor = new Date(
        birthDate.getFullYear() + years,
        birthDate.getMonth() + months,
        birthDate.getDate() + days,
        0, 0, 0, 0
    );

    let leftMs = now.getTime() - anchor.getTime();
    if (leftMs < 0) leftMs = 0; // just in case due to weird edge cases

    const hours = Math.floor(leftMs / (1000 * 60 * 60));
    leftMs = leftMs % (1000 * 60 * 60);

    const minutes = Math.floor(leftMs / (1000 * 60));
    leftMs = leftMs % (1000 * 60);

    const seconds = Math.floor(leftMs / 1000);

    return { years, months, days, hours, minutes, seconds };
}

function paint(parts) {
    yearsEl.textContent = parts.years;
    monthsEl.textContent = parts.months;
    daysEl.textContent = parts.days;
    hoursEl.textContent = parts.hours;
    minutesEl.textContent = parts.minutes;
    secondsEl.textContent = parts.seconds;
}

function showMessage(text) {
    msgEl.textContent = text || "";
}

function stopTick() {
    if (tickTimer) {
        clearInterval(tickTimer);
        tickTimer = null;
    }
}

function startTick() {
    stopTick();

    // Update every second so "seconds" keeps changing
    tickTimer = setInterval(() => {
        if (!savedBirthday) return;
        const now = new Date();
        const parts = getAgeParts(savedBirthday, now);
        if (!parts) {
            stopTick();
            showMessage("Please enter a valid past date.");
            return;
        }
        paint(parts);
    }, 1000);
}

function onCalculate() {
    const raw = bdayInput.value;
    if (!raw) {
        showMessage("Please select your date of birth.");
        stopTick();
        return;
    }

    const birthDate = parseBirthday(raw);
    const now = new Date();

    const parts = getAgeParts(birthDate, now);
    if (!parts) {
        showMessage("Please enter a valid past date.");
        stopTick();
        return;
    }

    savedBirthday = birthDate;
    paint(parts);
    showMessage(""); // clear
    startTick();
}

btn.addEventListener("click", onCalculate);
