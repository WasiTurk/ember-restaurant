(() => {
  // name, description, price, spice (1-3), veg?, image file (in /images; add your own photos with these names)
  const MENU = {
    Starters: [
      ["Seekh Kebab", "Hand-minced lamb, green chilli, charcoal-grilled.", 9.5, 2, false],
      ["Dahi Bhalla", "Soft lentil dumplings, yoghurt, tamarind, mint.", 6.5, 1, true],
      ["Chicken Tikka", "Overnight yoghurt marinade, clay-oven finish.", 10.5, 2, false],
      ["Samosa Chaat", "Crushed samosa, chickpeas, chutneys, sev.", 8.5, 1, false]
    ],
    Mains: [
      ["Chicken Karahi", "Tomato, ginger and green chilli, cooked in the wok to order.", 16, 3, false],
      ["Lamb Nihari", "Eight-hour slow braise, bone marrow, fresh ginger.", 18.5, 2, false],
      ["Butter Chicken", "Charred tikka in a silky tomato-butter sauce.", 15, 1, false],
      ["Daal Makhani", "Black lentils simmered overnight, finished with cream.", 12, 1, true],
      ["Palak Paneer", "Spinach, fresh paneer, toasted cumin.", 12.5, 1, true]
    ],
    Breads: [
      ["Garlic Naan", "Blistered in the tandoor, brushed with garlic butter.", 3.5, 1, true],
      ["Tandoori Roti", "Whole wheat, crisp edge, soft middle.", 2, 1, true],
      ["Peshawari Naan", "Stuffed with coconut, almonds and raisins.", 4.5, 1, true]
    ],
    Rice: [
      ["Saffron Pulao", "Basmati, whole spices, saffron, fried onion.", 7, 1, true],
      ["Lamb Biryani", "Layered and sealed, steamed in its own juices.", 17, 2, false]
    ],
    Sweets: [
      ["Gulab Jamun", "Warm milk dumplings in cardamom syrup.", 5.5, 1, true],
      ["Kheer", "Rice pudding with pistachio and rose.", 5, 1, true],
      ["Mango Lassi", "Sweet mango, yoghurt, a pinch of salt.", 4.5, 1, true]
    ]
  };
  const SPECIAL = "Chicken Tikka";
  const HOURS = [["Sunday",23],["Monday",23],["Tuesday",23],["Wednesday",23],["Thursday",24],["Friday",24],["Saturday",24]];
  const FREE_OVER = 40, FEE = 3.5;
  const $ = (s) => document.querySelector(s);
  const money = (n) => "$" + n.toFixed(2);
  const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const FLAME = '<svg class="flame" viewBox="0 0 48 64" aria-hidden="true"><path d="M24 62c-6 0-10-4-10-10 0-6 5-9 7-14 1 4 3 5 4 5 2-3 3-6 3-9 4 4 6 9 6 17 0 6-4 11-10 11Z" fill="currentColor"/></svg>';
  const KEY = "ember-cart";
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  const cart = new Map(saved);
  const ids = Object.keys(MENU), fromHash = ids.find(k => k.toLowerCase() === location.hash.slice(1));
  let tab = fromHash || ids[0];
  const PICKS = ["Chicken Karahi", "Lamb Biryani", "Garlic Naan", "Gulab Jamun"];

  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // Menu
  function renderTabs() {
    $("#tabs").innerHTML = Object.keys(MENU).map(k =>
      `<button class="tab" role="tab" aria-selected="${k === tab}" data-tab="${k}">${k}</button>`).join("");
  }
  const card = ([name, desc, price, heat, veg]) => `
      <li class="item">
        <div class="photo">${FLAME}<img src="images/${slug(name)}.jpg" alt="${name}" loading="lazy" onerror="this.remove()">
          ${name === SPECIAL ? `<span class="badge">${FLAME}Today’s fire</span>` : ""}</div>
        <div class="body"><h3>${name}</h3>
        <p>${desc} <span class="heat" role="img" aria-label="Spice ${heat} of 3">${"●".repeat(heat)}</span>${veg ? '<span class="veg">🌿 Veg</span>' : ""}</p>
        <div class="foot"><span class="price">${money(price)}</span>
        <button class="add" data-name="${name}" data-price="${price}" aria-label="Add ${name}">+</button></div></div>
      </li>`;
  const renderItems = () => { $("#items").innerHTML = MENU[tab].map(card).join(""); };
  $("#tabs") && $("#tabs").addEventListener("click", e => {
    const b = e.target.closest("[data-tab]"); if (!b) return;
    tab = b.dataset.tab; history.replaceState(null, "", "#" + tab.toLowerCase()); renderTabs(); renderItems();
  });
  document.addEventListener("click", e => {
    const b = e.target.closest(".add"); if (!b) return;
    const { name, price } = b.dataset;
    const cur = cart.get(name) || { price: +price, qty: 0 };
    cur.qty++; cart.set(name, cur); renderCart(); toast(name + " added");
  });

  // Cart
  function renderCart() {
    const list = $("#cartList");
    if (!cart.size) list.innerHTML = '<li class="empty">Nothing yet. Add something hot.</li>';
    else list.innerHTML = [...cart].map(([n, { price, qty }]) => `
      <li><span>${n}</span><span class="qty">
        <button data-act="-" data-n="${n}" aria-label="Remove one ${n}">−</button>${qty}
        <button data-act="+" data-n="${n}" aria-label="Add one ${n}">+</button></span>
        <span>${money(price * qty)}</span></li>`).join("");
    const sub = [...cart.values()].reduce((s, i) => s + i.price * i.qty, 0);
    const fee = !sub || sub >= FREE_OVER ? 0 : FEE;
    $("#sub").textContent = money(sub); $("#fee").textContent = fee ? money(fee) : "Free";
    $("#total").textContent = money(sub + fee);
    try { localStorage.setItem(KEY, JSON.stringify([...cart])); } catch (e) {}
    $("#cartCount").textContent = [...cart.values()].reduce((s, i) => s + i.qty, 0);
    $("#hint").textContent = sub >= FREE_OVER ? "You’ve unlocked free delivery." :
      `Add ${money(FREE_OVER - sub)} more for free delivery.`;
  }
  $("#cartList").addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const it = cart.get(b.dataset.n); it.qty += b.dataset.act === "+" ? 1 : -1;
    if (it.qty <= 0) cart.delete(b.dataset.n);
    renderCart();
  });
  const drawer = open => { $("#cart").classList.toggle("open", open); $("#scrim").classList.toggle("show", open); };
  $("#openCart").onclick = () => drawer(true);
  $("#closeCart").onclick = $("#scrim").onclick = () => drawer(false);
  document.addEventListener("keydown", e => e.key === "Escape" && drawer(false));
  $("#checkout").onclick = () => {
    if (!cart.size) return toast("Add an item first");
    if ($("#addr").value.trim().length < 6) { $("#addr").focus(); return toast("Enter your delivery address"); }
    cart.clear(); renderCart(); drawer(false);
    toast("Order placed. Arriving in about 35 minutes.");
  };

  // Hours & status
  function renderHours() {
    const d = new Date().getDay(), fmt = h => (h % 24 === 0 ? "12 am" : h > 12 ? h - 12 + " pm" : h + " pm");
    if ($("#hours")) $("#hours").innerHTML = HOURS.map(([n, c], i) =>
      `<tr class="${i === d ? "today" : ""}"><td>${n}</td><td>12 pm to ${fmt(c)}</td></tr>`).join("");
    const now = new Date(), h = now.getHours() + now.getMinutes() / 60, c = HOURS[d][1];
    const open = h >= 12 && h < c, s = $("#status"); if (!s) return;
    s.className = "status " + (open ? "open" : "closed");
    s.textContent = open ? `Open now until ${fmt(c)}` : "Closed. Opens today at 12 pm";
  }

  // Reservations
  function setupForm() {
    const f = $("#resForm"), t = f.time, today = new Date().toISOString().slice(0, 10);
    for (let h = 12; h <= 22; h++) for (const m of ["00", "30"]) {
      const lab = `${h > 12 ? h - 12 : h}:${m} ${h >= 12 ? "pm" : "am"}`;
      t.add(new Option(lab, lab));
    }
    f.date.min = today; f.date.value = today;
    f.addEventListener("submit", e => {
      e.preventDefault();
      const err = $("#resErr"), v = Object.fromEntries(new FormData(f));
      if (v.name.trim().length < 2) err.textContent = "Please enter your name.";
      else if (!/^[+\d][\d\s-]{6,}$/.test(v.phone.trim())) err.textContent = "Enter a phone number we can call, like +92 300 1234567.";
      else if (!v.date || v.date < today) err.textContent = "Pick today or a future date.";
      else {
        err.textContent = "";
        const out = $("#resOk");
        out.hidden = false;
        out.textContent = `Table for ${v.guests} confirmed, ${v.name.trim()}. ${new Date(v.date + "T00:00").toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })} at ${v.time}. We’ll call ${v.phone.trim()} if anything changes.`;
        f.reset(); f.date.value = today; out.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  $("#yr").textContent = new Date().getFullYear();
  const nav = $("#nav"), mb = $("#menuBtn");
  mb.onclick = () => { const o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o); };
  if ($("#tabs")) { renderTabs(); renderItems(); }
  if ($("#picks")) $("#picks").innerHTML = PICKS.map(n => card(Object.values(MENU).flat().find(i => i[0] === n))).join("");
  if ($("#special")) $("#special").textContent = SPECIAL;
  renderCart();
  if ($("#hours") || $("#status")) renderHours();
  if ($("#resForm")) setupForm();
})();
