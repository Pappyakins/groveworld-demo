/* Groveworld Realties — pitch demo. All data baked in; zero network calls. */
"use strict";

/* ---------- demo data ---------- */
var ESTATES = [
  {
    id: "ixora2", name: "Ixora Park Estate 2", loc: "Ikate Elegushi, Lekki",
    tag: "Now selling", type: "500 sqm residential plots",
    price: 95000000, grad: "linear-gradient(135deg,#2E4429,#5C8A3A)",
    desc: "Serviced plots in a fast-appreciating corridor, minutes from Lekki Phase 1. Perimeter fencing, good roads, instant allocation on full payment.",
    specs: [["Plot size","500 sqm"],["Title","C of O"],["Status","Now selling"],["Allocation","Instant"]]
  },
  {
    id: "springville", name: "Springville Estate", loc: "Ikate Elegushi, Lekki",
    tag: "Now selling", type: "3-bed terraces",
    price: 120000000, grad: "linear-gradient(135deg,#3A5A34,#8FC152)",
    desc: "Contemporary 3-bedroom terraces with fitted kitchens, ample parking and 24/7 security in a serene gated community.",
    specs: [["Unit","3-bed terrace"],["Title","C of O"],["Status","Now selling"],["Delivery","12 months"]]
  },
  {
    id: "bouvardia", name: "Bouvardia Court Estate", loc: "Ikate Elegushi, Lekki",
    tag: "Now selling", type: "4-bed semi-detached duplexes",
    price: 180000000, grad: "linear-gradient(135deg,#1F2E1B,#4A6B3F)",
    desc: "Spacious 4-bedroom semi-detached duplexes with BQ, smart-home wiring and landscaped surroundings for growing families.",
    specs: [["Unit","4-bed semi-detached"],["Title","C of O"],["Status","Now selling"],["Delivery","14 months"]]
  },
  {
    id: "lofty", name: "Lofty Heights Office Complex", loc: "Lekki Phase 1",
    tag: "Commercial", type: "Office spaces",
    price: 250000000, grad: "linear-gradient(135deg,#4A4436,#8a7a4a)",
    desc: "Premium office complex on Admiralty Way — the business address of Lekki Phase 1. Flexible floor plates for corporates.",
    specs: [["Type","Office complex"],["Location","Admiralty Way"],["Status","Leasing / sale"],["Title","C of O"]]
  },
  {
    id: "ocean", name: "Ocean Trail Development", loc: "Iroko Awe, Elegushi",
    tag: "Coming soon", type: "Residential plots",
    price: 60000000, grad: "linear-gradient(135deg,#2A4A5A,#5A9AB5)",
    desc: "Coastal-side residential plots near Elegushi — early-bird pricing for subscribers before public launch.",
    specs: [["Plot size","500 sqm"],["Title","Excision in view"],["Status","Coming soon"],["Launch","Q1 2027"]]
  }
];

var PLANS = [
  { months: 0,  label: "Outright", markup: 0 },
  { months: 6,  label: "6 months", markup: 0.05 },
  { months: 12, label: "12 months", markup: 0.10 },
  { months: 18, label: "18 months", markup: 0.15 },
  { months: 24, label: "24 months", markup: 0.20 }
];

/* demo client account */
var ACCOUNT = {
  client: "Adaeze O.",
  estateId: "ixora2",
  planMonths: 12,
  depositRate: 0.30,
  paidCount: 6,           // deposit + 5 instalments
  startMonth: 3,          // April (0-indexed) 2026
  startYear: 2026
};

/* ---------- helpers ---------- */
function $(s){ return document.querySelector(s); }
function $all(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }
function naira(n){ return "₦" + Math.round(n).toLocaleString("en-NG"); }
function estateById(id){ return ESTATES.filter(function(e){return e.id===id;})[0]; }
function planFor(m){ return PLANS.filter(function(p){return p.months===m;})[0]; }

function planMath(price, months){
  var p = planFor(months);
  var total = Math.round(price * (1 + p.markup));
  if (months === 0) return { total: total, deposit: total, monthly: 0, months: 0 };
  var deposit = Math.round(total * 0.30);
  var monthly = Math.round((total - deposit) / months);
  return { total: total, deposit: deposit, monthly: monthly, months: months };
}

var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function monthLabel(y, m){
  var d = new Date(y, m, 5);
  return MONTHS[d.getMonth()] + " " + d.getFullYear();
}

/* ---------- navigation ---------- */
function go(name){
  $all(".screen").forEach(function(s){ s.classList.remove("active"); });
  var el = document.getElementById("screen-" + name);
  if (el) el.classList.add("active");
  $all(".tab").forEach(function(t){ t.classList.toggle("active", t.getAttribute("data-go")===name); });
  window.scrollTo(0,0);
}
document.addEventListener("click", function(e){
  var g = e.target.closest("[data-go]");
  if (g) go(g.getAttribute("data-go"));
});

/* ---------- home ---------- */
function greeting(){
  var h = new Date().getHours();
  $("#greet-time").textContent = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
function renderFeatured(){
  var row = $("#featured-row");
  row.innerHTML = "";
  ESTATES.slice(0,3).forEach(function(e){
    var d = document.createElement("button");
    d.className = "fcard"; d.setAttribute("data-estate", e.id);
    d.innerHTML = '<div class="fcard-art" style="background:' + e.grad + '">' + e.name + '</div>' +
      '<div class="fcard-body"><div class="loc">' + e.loc + '</div><div class="price">' + naira(e.price) + '</div></div>';
    d.addEventListener("click", function(){ openEstate(e.id); });
    row.appendChild(d);
  });
}

/* ---------- properties ---------- */
function renderEstates(){
  var list = $("#estate-list");
  list.innerHTML = "";
  ESTATES.forEach(function(e){
    var b = document.createElement("button");
    b.className = "ecard";
    b.innerHTML =
      '<div class="ecard-art" style="background:' + e.grad + '"><span class="tag">' + e.tag + '</span><h3>' + e.name + '</h3></div>' +
      '<div class="ecard-body"><div class="loc">' + e.loc + ' · ' + e.type + '</div>' +
      '<div class="ecard-foot"><span class="price">From ' + naira(e.price) + '</span><span class="calc">Plan calculator ›</span></div></div>';
    b.addEventListener("click", function(){ openEstate(e.id); });
    list.appendChild(b);
  });
}

var currentEstate = null, currentPlan = 12;
function openEstate(id){
  currentEstate = estateById(id);
  currentPlan = 12;
  var e = currentEstate;
  var specs = e.specs.map(function(s){
    return '<div class="spec"><span class="lbl">' + s[0] + '</span><strong>' + s[1] + '</strong></div>';
  }).join("");
  $("#estate-detail").innerHTML =
    '<div class="detail-hero"><div class="ecard-art" style="background:' + e.grad + '">' +
    '<span class="tag">' + e.tag + '</span><h3>' + e.name + '</h3></div></div>' +
    '<p class="page-sub">' + e.loc + ' · ' + e.type + '</p>' +
    '<p style="font-size:14px;line-height:1.6;color:#444">' + e.desc + '</p>' +
    '<div class="spec-grid">' + specs + '</div>' +
    '<div class="plan-box"><h3>Payment plan calculator</h3>' +
    '<p class="hint">Outright price: <strong>' + naira(e.price) + '</strong> · instalment plans include a small spread.</p>' +
    '<div class="seg" id="plan-seg">' +
      PLANS.map(function(p){
        return '<button class="chip' + (p.months===12?" sel":"") + '" data-m="' + p.months + '">' + p.label + '</button>';
      }).join("") +
    '</div><div class="plan-out" id="plan-out"></div></div>' +
    '<div class="detail-cta"><button class="btn-ghost" id="ed-contact">Enquire</button>' +
    '<button class="btn-primary" id="ed-inspect">Book inspection</button></div>';
  renderPlan();
  $all("#plan-seg .chip").forEach(function(c){
    c.addEventListener("click", function(){
      currentPlan = parseInt(c.getAttribute("data-m"), 10);
      $all("#plan-seg .chip").forEach(function(x){ x.classList.remove("sel"); });
      c.classList.add("sel");
      renderPlan();
    });
  });
  $("#ed-inspect").addEventListener("click", function(){ startInspection(e.id); });
  $("#ed-contact").addEventListener("click", function(){ go("contact"); });
  go("estate");
}
function renderPlan(){
  var m = planMath(currentEstate.price, currentPlan);
  var html;
  if (currentPlan === 0) {
    html = '<div class="row total"><span class="lbl">Pay now</span><span>' + naira(m.total) + '</span></div>';
  } else {
    html = '<div class="row"><span class="lbl">Initial deposit (30%)</span><span>' + naira(m.deposit) + '</span></div>' +
      '<div class="row"><span class="lbl">Monthly × ' + m.months + '</span><span>' + naira(m.monthly) + '</span></div>' +
      '<div class="row total"><span class="lbl">Total payable</span><span>' + naira(m.total) + '</span></div>';
  }
  $("#plan-out").innerHTML = html;
}

/* ---------- payments ---------- */
function schedule(){
  var e = estateById(ACCOUNT.estateId);
  var m = planMath(e.price, ACCOUNT.planMonths);
  var items = [{ t: "Initial deposit (30%)", amt: m.deposit, idx: -1 }];
  for (var i = 0; i < ACCOUNT.planMonths; i++) {
    var amt = (i === ACCOUNT.planMonths - 1)
      ? m.total - m.deposit - m.monthly * (ACCOUNT.planMonths - 1)  // last one absorbs rounding
      : m.monthly;
    items.push({ t: "Instalment " + (i+1) + " of " + ACCOUNT.planMonths, amt: amt, idx: i });
  }
  return { estate: e, math: m, items: items };
}
function renderPayments(){
  var s = schedule();
  var paid = s.items.slice(0, ACCOUNT.paidCount);
  var paidSum = paid.reduce(function(a,b){ return a + b.amt; }, 0);
  var bal = s.math.total - paidSum;
  var pct = Math.round(paidSum / s.math.total * 100);

  $("#pay-prop").textContent = s.estate.name + " · " + s.estate.type;
  $("#pay-pct").textContent = pct + "%";
  $("#pay-bar").style.width = pct + "%";
  $("#pay-paid").textContent = naira(paidSum);
  $("#pay-bal").textContent = naira(bal);
  var next = s.items[ACCOUNT.paidCount];
  $("#pay-next").textContent = next ? naira(next.amt) + " · " + monthLabel(ACCOUNT.startYear, ACCOUNT.startMonth + ACCOUNT.paidCount) : "—";

  var sl = $("#schedule-list"); sl.innerHTML = "";
  s.items.forEach(function(it, i){
    var cls = i < ACCOUNT.paidCount ? "paid" : (i === ACCOUNT.paidCount ? "due" : "upcoming");
    var st = cls === "paid" ? "PAID" : (cls === "due" ? "DUE" : "UPCOMING");
    var row = document.createElement("div");
    row.className = "srow " + cls;
    row.innerHTML = '<span class="dot"></span><div class="grow"><div class="t">' + it.t + '</div>' +
      '<div class="d">' + monthLabel(ACCOUNT.startYear, ACCOUNT.startMonth + i) + '</div></div>' +
      '<div><div class="amt">' + naira(it.amt) + '</div><span class="st">' + st + '</span></div>';
    sl.appendChild(row);
  });

  var rl = $("#receipt-list"); rl.innerHTML = "";
  paid.forEach(function(it, i){
    var ref = "GW-RCT-" + (2400 + i * 7);
    var b = document.createElement("button");
    b.className = "rrow";
    b.innerHTML = '<span class="r-ico">🧾</span><div class="grow"><div class="t">' + ref + '</div>' +
      '<div class="d">' + it.t + ' · ' + monthLabel(ACCOUNT.startYear, ACCOUNT.startMonth + i) + '</div></div>' +
      '<span class="view">View ›</span>';
    b.addEventListener("click", function(){ showReceipt(ref, it, i); });
    rl.appendChild(b);
  });
}
function showReceipt(ref, it, i){
  var s = schedule();
  $("#modal-body").innerHTML =
    '<div class="rr"><dt>Receipt no</dt><dd>' + ref + '</dd></div>' +
    '<div class="rr"><dt>Client</dt><dd>' + ACCOUNT.client + '</dd></div>' +
    '<div class="rr"><dt>Property</dt><dd>' + s.estate.name + '</dd></div>' +
    '<div class="rr"><dt>Description</dt><dd>' + it.t + '</dd></div>' +
    '<div class="rr"><dt>Amount</dt><dd>' + naira(it.amt) + '</dd></div>' +
    '<div class="rr"><dt>Date</dt><dd>' + monthLabel(ACCOUNT.startYear, ACCOUNT.startMonth + i) + '</dd></div>' +
    '<div class="stamp">PAID · GROVEWORLD REALTIES</div>';
  $("#modal").classList.remove("hidden");
}
$("#modal-close").addEventListener("click", function(){ $("#modal").classList.add("hidden"); });
$("#modal").addEventListener("click", function(e){ if (e.target === $("#modal")) $("#modal").classList.add("hidden"); });

/* ---------- inspection booking ---------- */
var insp = { estate: null, day: null, time: null };
function inspDays(){
  var out = [], d = new Date();
  while (out.length < 10) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue; // closed Sundays
    out.push(new Date(d));
  }
  return out;
}
function startInspection(presetEstate){
  insp = { estate: presetEstate || null, day: null, time: null };
  $("#insp-done").classList.add("hidden");
  $("#insp-flow").classList.remove("hidden");

  var eg = $("#insp-estates"); eg.innerHTML = "";
  ESTATES.forEach(function(e){
    var c = document.createElement("button");
    c.className = "chip" + (insp.estate === e.id ? " sel" : "");
    c.textContent = e.name; c.setAttribute("data-e", e.id);
    c.addEventListener("click", function(){
      insp.estate = e.id;
      $all("#insp-estates .chip").forEach(function(x){ x.classList.remove("sel"); });
      c.classList.add("sel"); validateInsp();
    });
    eg.appendChild(c);
  });

  var dg = $("#insp-days"); dg.innerHTML = "";
  inspDays().forEach(function(d){
    var c = document.createElement("button");
    c.className = "chip";
    var lbl = (d.toDateString() === new Date(Date.now()+864e5).toDateString()) ? "Tmrw" : MONTHS[d.getMonth()] + " " + d.getDate();
    c.innerHTML = lbl + "<small>" + ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()] + "</small>";
    c.setAttribute("data-d", d.toDateString());
    c.addEventListener("click", function(){
      insp.day = d.toDateString();
      $all("#insp-days .chip").forEach(function(x){ x.classList.remove("sel"); });
      c.classList.add("sel"); validateInsp();
    });
    dg.appendChild(c);
  });

  $all("#insp-times .chip").forEach(function(c){
    c.classList.remove("sel");
    c.onclick = function(){
      insp.time = c.getAttribute("data-t");
      $all("#insp-times .chip").forEach(function(x){ x.classList.remove("sel"); });
      c.classList.add("sel"); validateInsp();
    };
  });
  $("#insp-name").value = ""; $("#insp-phone").value = "";
  validateInsp();
  go("inspect");
}
function validateInsp(){
  var ok = insp.estate && insp.day && insp.time &&
    $("#insp-name").value.trim().length > 1 && $("#insp-phone").value.trim().length > 5;
  $("#insp-submit").disabled = !ok;
}
["insp-name","insp-phone"].forEach(function(id){
  document.getElementById(id).addEventListener("input", validateInsp);
});
$("#insp-submit").addEventListener("click", function(){
  var e = estateById(insp.estate);
  var ref = "GW-INSP-" + Math.floor(1000 + Math.random() * 9000);
  var rec = { ref: ref, estate: e.name, day: insp.day, time: insp.time,
              name: $("#insp-name").value.trim(), phone: $("#insp-phone").value.trim(),
              at: new Date().toISOString() };
  try {
    var all = JSON.parse(localStorage.getItem("gw_inspections") || "[]");
    all.push(rec); localStorage.setItem("gw_inspections", JSON.stringify(all));
  } catch (err) {}
  $("#insp-summary").innerHTML = "<strong>" + e.name + "</strong><br>" + insp.day + " · " + insp.time +
    "<br>for " + rec.name + " (" + rec.phone + ")";
  $("#insp-ref").textContent = ref;
  $("#insp-flow").classList.add("hidden");
  $("#insp-done").classList.remove("hidden");
  window.scrollTo(0,0);
});
$("#insp-again").addEventListener("click", function(){ startInspection(null); });

/* ---------- callback form ---------- */
$("#cb-submit").addEventListener("click", function(){
  var n = $("#cb-name").value.trim(), p = $("#cb-phone").value.trim();
  if (n.length < 2 || p.length < 5) {
    $("#cb-submit").textContent = "Please add your name & phone";
    setTimeout(function(){ $("#cb-submit").textContent = "Call me back"; }, 1800);
    return;
  }
  $("#cb-form").classList.add("hidden");
  $("#cb-done").classList.remove("hidden");
});

/* ---------- init ---------- */
greeting();
renderFeatured();
renderEstates();
renderPayments();
startInspectionSilent();
function startInspectionSilent(){
  // pre-render chips without navigating
  var eg = $("#insp-estates"); eg.innerHTML = "";
  ESTATES.forEach(function(e){
    var c = document.createElement("button");
    c.className = "chip"; c.textContent = e.name; c.setAttribute("data-e", e.id);
    c.addEventListener("click", function(){
      insp.estate = e.id;
      $all("#insp-estates .chip").forEach(function(x){ x.classList.remove("sel"); });
      c.classList.add("sel"); validateInsp();
    });
    eg.appendChild(c);
  });
  var dg = $("#insp-days"); dg.innerHTML = "";
  inspDays().forEach(function(d){
    var c = document.createElement("button");
    c.className = "chip";
    c.innerHTML = MONTHS[d.getMonth()] + " " + d.getDate() + "<small>" + ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()] + "</small>";
    c.addEventListener("click", function(){
      insp.day = d.toDateString();
      $all("#insp-days .chip").forEach(function(x){ x.classList.remove("sel"); });
      c.classList.add("sel"); validateInsp();
    });
    dg.appendChild(c);
  });
  $all("#insp-times .chip").forEach(function(c){
    c.onclick = function(){
      insp.time = c.getAttribute("data-t");
      $all("#insp-times .chip").forEach(function(x){ x.classList.remove("sel"); });
      c.classList.add("sel"); validateInsp();
    };
  });
}

/* service worker: progressive enhancement only */
if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("sw.js").catch(function(){});
  });
}
