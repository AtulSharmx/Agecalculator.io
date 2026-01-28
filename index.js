// Simple Age Calculator (Years / Months / Days)

const btn = document.getElementById("btn");
const bdayInput = document.getElementById("birthday");
const resultEl = document.getElementById("result");

// NOTE: using local Date(y, m, d) avoids timezone issues
function parseBirthday(dateStr) {
  const parts = dateStr.split("-");
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);

  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function daysInPrevMonth(year, monthIndex) {
  // monthIndex: 0..11 (current month)
  return new Date(year, monthIndex, 0).getDate();
}

function calcAgeYMD(birthDate, now) {
  if (!birthDate || now < birthDate) return null;

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

  return { years, months, days };
}

function showAge() {
  const raw = bdayInput.value;

  if (!raw) {
    resultEl.textContent = "Please select your date of birth.";
    return;
  }

  const birthDate = parseBirthday(raw);
  const now = new Date();

  const age = calcAgeYMD(birthDate, now);
  if (!age) {
    resultEl.textContent = "Please enter a valid past date.";
    return;
  }

  resultEl.textContent =
    "Your age is " + age.years + " years, " + age.months + " months, " + age.days + " days.";
}

btn.addEventListener("click", showAge);

// Press Enter to calculate
bdayInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") showAge();
});