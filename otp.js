const pend = JSON.parse(localStorage.getItem("cmuicapPendingUser") || "null");
if (!pend) location.replace("index.html");
const wrap = document.getElementById("boxes"), msg = document.getElementById("msg");
for (let i = 0; i < 6; i++) {
  const b = document.createElement("input");
  b.maxLength = 1;
  b.inputMode = "numeric";
  b.setAttribute("aria-label", "Digit " + (i + 1));
  wrap.appendChild(b)
}
const ins = [...wrap.children];
ins.forEach((b, i) => {
  b.oninput = () => {
    b.value = b.value.replace(/\D/g, "");
    if (b.value && ins[i + 1]) ins[i + 1].focus()
  };
  b.onkeydown = e => {
    if (e.key === "Backspace" && !b.value && ins[i - 1]) {
      ins[i - 1].focus();
      ins[i - 1].value = ""
    }
    if (e.key === "Enter") verify()
  };
  b.onpaste = e => {
    e.preventDefault();
    const d = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    [...d].forEach((c, k) => ins[k].value = c);
    ins[Math.min(d.length, 5)].focus()
  }
});
ins[0].focus();
function verify() {
  const c = ins.map(x => x.value).join("");
  if (c === "123456") {
    msg.className = "ok";
    msg.textContent = "Verified. Redirecting…";
    localStorage.setItem("cmuicapCurrentUser", JSON.stringify(pend));
    localStorage.removeItem("cmuicapPendingUser");
    setTimeout(() => location.href = pend.role + "-dashboard.html", 700)
  } else {
    msg.className = "err";
    msg.textContent = "Invalid verification code. Please try again."
  }
}
document.getElementById("v").onclick = verify;
let s = 30;
const t = document.getElementById("t"), re = document.getElementById("re");
function tick() {
  t.textContent = s > 0 ? "Resend available in " + s + "s" : "";
  re.disabled = s > 0;
  if (s > 0) {
    s--;
    setTimeout(tick, 1000)
  }
}
tick();
re.onclick = () => {
  s = 30;
  msg.className = "ok";
  msg.textContent = "Prototype: a new code was simulated. Use 123456.";
  tick()
};
