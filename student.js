const U = JSON.parse(localStorage.getItem("cmuicapCurrentUser") || "null");
if (!U) location.replace("index.html");
else if (U.role !== "student") location.replace(U.role + "-dashboard.html");
const $ = s => document.querySelector(s);
const LS = (k, d) => JSON.parse(localStorage.getItem(k) || d);
const NAV = [["Home", "student-dashboard", "home"], ["Archive", "archive", "folder"], ["My Activity", "my-activity", "clock"], ["Profile", "student-profile", "user"]];
const titleCase = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
function displayName(n) {
  const p = n.split(",");
  return titleCase(p.length > 1 ? p[1].trim() + " " + p[0].trim() : n);
}
function shell() {
  const cur = location.pathname.split("/").pop().replace(".html", "");
  $("#top").innerHTML = `<a class="logo" href="student-dashboard.html"><img src="cmuicap-logo.png" alt="CMUiCAP logo"><span class="brand">CMUiCAP</span></a>
<button class="nav-toggle" id="navToggle" type="button" aria-label="Open navigation" aria-expanded="false"><i data-i="menu"></i></button>
<nav id="mainNav">${NAV.map(n => `<a href="${n[1]}.html" class="${n[1] === cur ? "active" : ""}"><i data-i="${n[2]}"></i>${n[0]}</a>`).join("")}</nav>
<div class="dd-wrap" id="uw"><button class="uchip" id="uc"><span class="uav"><i data-i="user"></i></span><span><b>${displayName(U.name)}</b><small>Student</small></span><i data-i="chevron"></i></button>
<div class="dd"><a href="student-profile.html"><i data-i="user"></i>Profile</a><button id="out"><i data-i="logout"></i>Log out</button></div></div>`;
  $("#out").onclick = () => {
    localStorage.removeItem("cmuicapCurrentUser");
    location.href = "index.html";
  };
  const navToggle = $("#navToggle");
  const mainNav = $("#mainNav");
  const closeNav = () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    const icon = navToggle.querySelector("[data-i]");
    if (icon) { icon.dataset.i = "menu"; icon.innerHTML = ""; }

  };
  navToggle.onclick = e => {
    e.stopPropagation();
    const open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    const icon = navToggle.querySelector("[data-i]");
    if (icon) { icon.dataset.i = open ? "close" : "menu"; icon.innerHTML = ""; }
    if (window.hydrateIcons) hydrateIcons(document);
  };
  mainNav.addEventListener("click", closeNav);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeNav(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 760) closeNav(); });
  $("#uc").onclick = e => {
    e.stopPropagation();
    $("#uw").classList.toggle("open");
  };
  document.addEventListener("click", () => $("#uw").classList.remove("open"));
}
function log(activity, topic, status = "Done") {
  const a = LS("cmuicapActivity", "[]");
  const d = new Date();
  a.unshift({date: d.toLocaleDateString(), time: d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}), activity, topic, status});
  localStorage.setItem("cmuicapActivity", JSON.stringify(a.slice(0, 100)));
}
const saved = () => LS("cmuicapArchive", "[]");
function toggleSave(id) {
  let s = saved();
  const p = PROJECTS.find(x => x.id === id);
  if (s.includes(id)) {
    s = s.filter(x => x !== id);
  } else {
    s.push(id);
    log("Saved Project", p.title);
  }
  localStorage.setItem("cmuicapArchive", JSON.stringify(s));
}
function showDetails(id) {
  const p = PROJECTS.find(x => x.id === id);
  log("Viewed Project", p.title);
  $("#modal").innerHTML = `<div class="box"><h2 style="color:var(--navy)">${p.title}</h2>${projectDetailsHTML(p)}<div class="row"><button class="btn" onclick="$('#modal').classList.remove('open')">Close</button></div></div>`;
  $("#modal").classList.add("open");
}
function cards(el, list, mode) {
  const s = saved();
  $(el).innerHTML = list.length ? list.map(p => `<article class="card proj"><span class="badge">${p.category}</span>
<h3>${p.title}</h3><p>${p.authors}</p><p>${p.year} · ${p.program}</p><p>${p.technologies.join(", ")}</p>
<span class="badge ${p.verificationStatus === "Verified" ? "ok" : "warn"}">${p.verificationStatus}</span> <span class="badge">${p.status}</span>
<div class="row"><button class="btn ghost" onclick="showDetails(${p.id})">View Details</button>
<button class="btn" onclick="toggleSave(${p.id});window.refresh()">${mode === "archive" ? "Remove from Archive" : s.includes(p.id) ? "Saved ✓" : "Save to Archive"}</button></div></article>`).join("") : "<p class='sub'>No projects match. Adjust your search or filters.</p>";
}
function filters(prefix, list) {
  const f = k => [...new Set(list.map(p => k === "technologies" ? p.technologies : p[k]).flat())].sort();
  for (const[id, k]of [["year", "year"], ["program", "program"], ["category", "category"], ["tech", "technologies"], ["status", "status"]]) {
    const e = $("#f-" + id);
    if (e) e.innerHTML += f(k).map(v => `<option>${v}</option>`).join("");
  }
}
function applyFilters(list) {
  const q = ($("#q") ? $("#q").value : "").toLowerCase();
  const g = id => $("#f-" + id) ? $("#f-" + id).value : "";
  return list.filter(p => (!q || (p.title + p.authors + p.keywords.join(" ") + p.technologies.join(" ")).toLowerCase().includes(q)) && (!g("year") || p.year == g("year")) && (!g("program") || p.program === g("program")) && (!g("category") || p.category === g("category")) && (!g("tech") || p.technologies.includes(g("tech"))) && (!g("status") || p.status === g("status")));
}
function toast(m) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    document.body.appendChild(t);
  }
  t.textContent = m;
  t.className = "show";
  clearTimeout(t._h);
  t._h = setTimeout(() => t.className = "", 2800);
}
function smodal(title, html, onOk, lab) {
  const m = $("#modal");
  m.innerHTML = `<div class="box"><h2 style="color:var(--navy);margin-bottom:10px">${title}</h2>${html}<div class="row"><button class="btn ghost" id="mc">${onOk ? "Cancel" : "Close"}</button>${onOk ? `<button class="btn" id="mo">${lab || "Save"}</button>` : ""}</div></div>`;
  m.classList.add("open");
  $("#mc").onclick = () => m.classList.remove("open");
  if (onOk) $("#mo").onclick = () => {
    if (onOk() !== false) m.classList.remove("open");
  };
}
document.addEventListener("DOMContentLoaded", () => {
  shell();
  const m = $("#modal");
  if (m) m.addEventListener("click", e => {
    if (e.target.id === "modal") e.target.classList.remove("open");
  });
});
