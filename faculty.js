const U = JSON.parse(localStorage.getItem("cmuicapCurrentUser") || "null");
const ROLE = "faculty";
if (!U) location.replace("index.html");
else if (U.role !== ROLE) location.replace(U.role + "-dashboard.html");
const $ = s => document.querySelector(s);
const titleCase = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
const NAV = [["Dashboard", "faculty-dashboard", "home"], ["Similarity", "faculty-similarity", "fileSearch"], ["Upload New Capstone", "faculty-upload", "uploadCloud"], ["My Uploaded Capstones", "faculty-uploads", "folder"], ["Repository Verification", "faculty-verification", "check"], ["Repository", "faculty-repository", "db"], ["Profile", "faculty-profile", "user"]];
const NOTES = [["Similarity check completed", "faculty-similarity"], ["A capstone record is awaiting verification", "faculty-verification"], ["New capstone added to the repository", "faculty-repository"]];
const PROFILE_LINK = `<a href="faculty-profile.html"><i data-i="user"></i>Profile</a>`;
function initials(n) {
  return n.split(/[ ,]+/).filter(Boolean).slice(0, 2).map(x => x[0]).join("").toUpperCase();

}
function route(q) {
  const s = q.toLowerCase();
  location.href = "faculty-repository.html?q=" + encodeURIComponent(q);

}
document.addEventListener("DOMContentLoaded", () => {
  let cur = location.pathname.split("/").pop().replace(".html", "");
  $("#side").innerHTML = `<a class="logo brand" href="${ROLE}-dashboard.html"><img src="cmuicap-logo.png" alt="CMUiCAP logo"><span>CMUiCAP</span></a>
<nav>${NAV.map(n => `<a href="${n[1]}.html" class="${n[1] === cur ? "active" : ""}"><i data-i="${n[2]}"></i>${n[0]}</a>`).join("")}</nav>
<button class="out" id="out"><i data-i="logout"></i>Log Out</button>`;
  $("#side").insertAdjacentHTML("afterbegin", `<button class="drawer-close" id="drawerClose" type="button" aria-label="Close navigation"><i data-i="close"></i></button>`);
  $("#tb").insertAdjacentHTML("afterbegin", `<button class="nav-toggle" id="navToggle" type="button" aria-label="Open navigation" aria-expanded="false"><i data-i="menu"></i></button>`);
  const overlay = document.createElement("div");
  overlay.className = "drawer-overlay";
  overlay.id = "drawerOverlay";
  document.body.appendChild(overlay);
  const openDrawer = () => {
    $("#side").classList.add("open");
    overlay.classList.add("open");
    $("#navToggle").setAttribute("aria-expanded", "true");
    $("#navToggle").setAttribute("aria-label", "Close navigation");
  };
  const closeDrawer = () => {
    $("#side").classList.remove("open");
    overlay.classList.remove("open");
    $("#navToggle").setAttribute("aria-expanded", "false");
    $("#navToggle").setAttribute("aria-label", "Open navigation");
  };
  $("#navToggle").onclick = openDrawer;
  $("#drawerClose").onclick = closeDrawer;
  overlay.onclick = closeDrawer;
  $("#side").querySelectorAll("nav a").forEach(a => a.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 900) closeDrawer(); });
  const logout = () => {
    localStorage.removeItem("cmuicapCurrentUser");
    location.href = "index.html";

  };
  $("#out").onclick = logout;
  const d = new Date();
  $("#tb").innerHTML = `<label class="sbox"><i data-i="search"></i><input id="gs" type="search" placeholder="Search capstones, students, or keywords..." aria-label="Search"></label><span class="sp"></span>
<div class="dd-wrap" id="bw"><button class="bell" aria-label="Notifications"><i data-i="bell"></i><b id="dot"></b></button><div class="dd nt">${NOTES.map(n => `<a href="${n[1]}.html">${n[0]}</a>`).join("")}</div></div>
<div class="dd-wrap" id="ww"><button class="who"><span class="av">${initials(U.name)}</span><span><b>${titleCase(U.name)}</b><small>Faculty</small></span><i data-i="chevron"></i></button><div class="dd">${PROFILE_LINK}<button id="lo2"><i data-i="logout"></i>Log out</button></div></div>`;
  $("#lo2").onclick = logout;
  $("#gs").onkeydown = e => {
    if (e.key === "Enter" && e.target.value.trim()) route(e.target.value.trim());

  };
  ["bw", "ww"].forEach(id => {
    $("#" + id).firstElementChild.onclick = e => {
      e.stopPropagation();
      const open = $("#" + id).classList.contains("open");
      document.querySelectorAll(".dd-wrap").forEach(x => x.classList.remove("open"));
      if (!open) $("#" + id).classList.add("open");
      if (id === "bw") $("#dot").style.display = "none";

    };

  });
  document.addEventListener("click", () => document.querySelectorAll(".dd-wrap").forEach(x => x.classList.remove("open")));
  $("main").insertAdjacentHTML("afterbegin", `<div class="hdate"><b>${d.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"})}</b>${d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</div>`);
  if (window.init) init();
  if (new URLSearchParams(location.search).get("add")) {
    const b = document.querySelector("#add,#a1");
    if (b) b.click();

  }

});
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
function toast(m) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    document.body.appendChild(t)
  }
  t.textContent = m;
  t.className = "show";
  clearTimeout(t._h);
  t._h = setTimeout(() => t.className = "", 2800)
}
function modal(title, body, onSave, lab) {
  let m = $("#mdl");
  if (!m) {
    m = document.createElement("div");
    m.id = "mdl";
    m.className = "modal";
    document.body.appendChild(m)
  }
  m.innerHTML = `<div class="box"><h2>${title}</h2><div>${body}</div><div class="row"><button class="btn ghost" id="mc">${onSave?"Cancel":"Close"}</button>${onSave?`<button class="btn" id="ms">${lab||"Save changes"}</button>`:""}</div></div>`;
  m.classList.add("open");
  $("#mc").onclick = () => m.classList.remove("open");
  m.onclick = e => {
    if (e.target === m) m.classList.remove("open")
  };
  if (onSave) $("#ms").onclick = () => {
    if (onSave() !== false) m.classList.remove("open")
  }

}
const bd = s => `<span class="pill ${/^(Active|Verified|Approved|Success|Completed|Current|Submitted|Yes|Done|Enabled)$/.test(s)?"":/^(Inactive|Failed|Revision Requested|No|Rejected)$/.test(s)?"r":"w"}">${s}</span>`;
const fld = (l, id, v = "", t = "text") => `<label>${l}<input id="${id}" type="${t}" value="${esc(v)}"></label>`;
const sel = (l, id, o, v) => `<label>${l}<select id="${id}">${o.map(x=>`<option${x==v?" selected":""}>${x}</option>`).join("")}</select></label>`;
const sw = (on = true) => `<label class="sw"><input type="checkbox"${on?" checked":""}><i></i></label>`;
const fill = (el, arr) => {
  const e = $(el);
  if (e) e.innerHTML += arr.map(v => `<option>${v}</option>`).join("")
};
function csv(name, head, rows) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([head + "\n" + rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(",")).join("\n")], {type: "text/csv"}));
  a.download = name;
  a.click()
}
function stats(el, arr) {
  $(el).innerHTML = arr.map(x => `<div class="card stat ${x[3]}"><span class="ic">${x[2]}</span><div><small>${x[0]}</small><b>${x[1]}</b></div></div>`).join("")
}
function dt(c) {
  const el = $(c.el);
  const qp = new URLSearchParams(location.search).get("q");
  if (c.q && qp && $(c.q)) $(c.q).value = qp;
  const rows = () => {
    const q = (c.q && $(c.q) ? $(c.q).value : "").toLowerCase();
    return c.data().filter(r => (!q || JSON.stringify(Object.values(r)).toLowerCase().includes(q)) && Object.entries(c.f || {}).every(([s, k]) => !$(s).value || String(r[k]) === $(s).value) && (!c.pre || c.pre(r)))
  };
  function draw() {
    const R = rows();
    el.innerHTML = `<div class="tw"><table><thead><tr>${c.cols.map(x=>`<th>${x[0]}</th>`).join("")}${c.act?"<th>Actions</th>":""}</tr></thead><tbody>${R.length?R.map(r=>`<tr>${c.cols.map(x=>`<td>${x[1](r)}</td>`).join("")}${c.act?`<td>${c.act.map(a=>`<button class="mini" data-a="${a[0]}" data-id="${r.id}">${typeof a[1]==="function"?a[1](r):a[1]}</button>`).join("")}</td>`:""}</tr>`).join(""):`<tr><td colspan="12" class="empty">No records match. Clear the search or filters.</td></tr>`}</tbody></table></div>`;
    if (c.count && $(c.count)) $(c.count).textContent = "Showing " + R.length + " of " + c.data().length + " records"
  }
  el.onclick = e => {
    const b = e.target.closest("button[data-a]");
    if (b) {
      c.on[b.dataset.a](c.data().find(r => String(r.id) === b.dataset.id));
      draw()
    }

  };
  [c.q, ...Object.keys(c.f || {}), ...(c.ev || [])].forEach(s => s && $(s) && $(s).addEventListener("input", draw));
  draw();
  return {draw}
}
function pd(id) {
  const p = PROJECTS.find(x => x.id === id);
  modal(esc(p.title), projectDetailsHTML(p))
}
