const btn = document.getElementById("btn");
const bdayInput = document.getElementById("birthday");
const resBox = document.getElementById("result");

function calcAgeFunc() {
    const bdayVal = bdayInput.value;
    if (!bdayVal) {
        alert("Please enter your birthday");
        return;
    }

    const finalAge = figureOutAge(bdayVal);
    let label = "year";
    if (finalAge > 1) label = "years";

    resBox.innerText = "O Fuck Your age is " + finalAge + " " + label + " old";
}

function figureOutAge(bVal) {
    const now = new Date();
    const b = new Date(bVal);
    let a = now.getFullYear() - b.getFullYear();

    const mDiff = now.getMonth() - b.getMonth();
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < b.getDate())) {
        a = a - 1;
    }

    return a;
}

btn.addEventListener("click", calcAgeFunc);
