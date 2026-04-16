// ===========================
//  glōw — App Logic
// ===========================

let cart = [];
let compareList = [];
let currentFilter = 'all';
let skinFilter = 'all';
let currentSort = '';
let currentRating = 0;
let reviews = [
  { name: 'Ananya K.', skin: 'Oily', product: 'Minimalist 10% Niacinamide Serum', rating: 5, text: 'This is genuinely life-changing for my oily skin. Pores are visibly smaller after 3 weeks!', date: '2 days ago' },
  { name: 'Riya S.', skin: 'Dry', product: 'The Ordinary Hyaluronic Acid 2% + B5 Serum', rating: 4, text: 'Lovely serum, very hydrating. Layering it under moisturiser gives me that glass-skin look.', date: '5 days ago' },
  { name: 'Preethi M.', skin: 'Sensitive', product: 'Dot & Key Barrier Repair Cream', rating: 5, text: "Finally a moisturiser that doesn't break me out. My sensitive skin absolutely loves this.", date: '1 week ago' },
];

// ── PAGE NAVIGATION ──
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  if (page === 'compare') renderCompare();
  if (page === 'cart') renderCart();
  if (page === 'feedback') renderReviews();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── PRODUCT RENDERING ──
function renderProducts() {
  let filtered = PRODUCTS.filter(p => {
    const catMatch = currentFilter === 'all' || p.cat === currentFilter;
    const skinMatch = skinFilter === 'all' || p.skin.some(s => s.includes(skinFilter) || s === 'all types');
    return catMatch && skinMatch;
  });

  if (currentSort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (currentSort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  document.getElementById('product-count').textContent = filtered.length + ' products';

  const grid = document.getElementById('product-grid');
  grid.innerHTML = filtered.map(p => {
    const inCompare = compareList.includes(p.id);
    const discount = Math.round((1 - p.price / p.origPrice) * 100);
    return `<div class="product-card${inCompare ? ' selected' : ''}" onclick="openDetail(${p.id})">
      <div class="product-img">
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
        <div class="product-compare-check ${inCompare ? 'checked' : ''}" onclick="event.stopPropagation();toggleCompare(${p.id})">${inCompare ? '✓' : '+'}</div>
        ${p.img}
      </div>
      <div class="product-body">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-meta">
          <span class="product-size">${p.size}</span>
          <span class="product-skin">${p.skin[0]}</span>
          ${discount > 0 ? `<span class="tag-green">${discount}% off</span>` : ''}
        </div>
        <div class="product-stars">
          <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
          <span class="rating-count">${p.rating} (${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-footer">
          <div class="product-price">₹${p.price} <span>₹${p.origPrice}</span></div>
          <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})">+ Add</button>
        </div>
      </div>
    </div>`;
  }).join('');

  const notice = document.getElementById('compare-notice');
  const cnt = compareList.length;
  if (cnt > 0) {
    notice.style.display = 'flex';
    document.getElementById('compare-count-text').textContent = cnt;
  } else {
    notice.style.display = 'none';
  }
}

function filterCat(el, cat) {
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  currentFilter = cat;
  renderProducts();
}

function filterSkin(el, skin) {
  document.querySelectorAll('.skin-chip').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  skinFilter = skin;
  renderProducts();
}

function applySortFilter(val) { currentSort = val; renderProducts(); }

// ── COMPARE ──
function toggleCompare(id) {
  const idx = compareList.indexOf(id);
  if (idx > -1) {
    compareList.splice(idx, 1);
  } else {
    if (compareList.length >= 4) { showToast('Max 4 products for comparison'); return; }
    compareList.push(id);
  }
  renderProducts();
}

function clearCompare() { compareList = []; renderProducts(); renderCompare(); }

function renderCompare() {
  const el = document.getElementById('compare-content');
  if (compareList.length === 0) {
    el.innerHTML = `<div class="empty-compare">
      <div style="font-size:48px;margin-bottom:1rem;">⇄</div>
      <div style="font-size:20px;font-family:var(--font-display);font-weight:400;margin-bottom:8px;">No products selected</div>
      <p style="font-size:14px;color:var(--text-muted);">Go to Explore and tap + on products to compare</p>
      <br><button class="btn btn-primary" onclick="showPage('home')">Browse Products</button>
    </div>`;
    return;
  }

  const prods = compareList.map(id => PRODUCTS.find(p => p.id === id));
  const gridStyle = `grid-template-columns:160px ${prods.map(() => '1fr').join(' ')}`;
  const bestRating = Math.max(...prods.map(p => p.rating));
  const cheapest = Math.min(...prods.map(p => p.price));

  const rows = [
    { label: 'Price', render: p => `<div style="font-weight:600;font-size:16px;color:${p.price === cheapest ? 'var(--success)' : 'var(--text)'};">₹${p.price}${p.price === cheapest ? '<span class="tag-green" style="margin-left:6px;">Lowest</span>' : ''}</div><div style="font-size:12px;color:var(--text-light);text-decoration:line-through;">₹${p.origPrice}</div>` },
    { label: 'Rating', render: p => `<div style="display:flex;align-items:center;gap:6px;"><span class="stars" style="font-size:14px;">${'★'.repeat(Math.floor(p.rating))}</span><strong>${p.rating}</strong></div><div class="rating-bar" style="margin-top:6px;"><div class="rating-fill" style="width:${(p.rating / 5 * 100).toFixed(0)}%"></div></div><div style="font-size:11px;color:var(--text-light);margin-top:4px;">${p.reviews.toLocaleString()} reviews</div>` },
    { label: 'Size', render: p => p.size },
    { label: 'Category', render: p => `<span style="text-transform:capitalize;">${p.cat}</span>` },
    { label: 'Best For', render: p => p.skin.map(s => `<span class="detail-tag" style="display:inline-block;margin:2px;font-size:11px;padding:3px 10px;">${s}</span>`).join('') },
    { label: 'Discount', render: p => `<span class="tag-green">${Math.round((1 - p.price / p.origPrice) * 100)}% off</span>` },
  ];

  el.innerHTML = `<div class="compare-table">
    <div class="compare-row" style="display:grid;${gridStyle};background:var(--cream);">
      <div class="compare-cell compare-label">Product</div>
      ${prods.map(p => `<div class="compare-img-cell">
        <div class="compare-prod-img">${p.img}</div>
        <div class="compare-prod-name">${p.name}</div>
        <div class="compare-prod-brand">${p.brand}</div>
        ${p.rating === bestRating ? '<div class="winner-badge">★ Best Rated</div>' : ''}
      </div>`).join('')}
    </div>
    ${rows.map(row => `<div class="compare-row" style="display:grid;${gridStyle};">
      <div class="compare-cell compare-label">${row.label}</div>
      ${prods.map(p => `<div class="compare-cell compare-val">${row.render(p)}</div>`).join('')}
    </div>`).join('')}
    <div class="compare-row" style="display:grid;${gridStyle};">
      <div class="compare-cell compare-label">Action</div>
      ${prods.map(p => `<div class="compare-cell"><button class="btn btn-primary btn-sm" onclick="addToCart(${p.id});showPage('cart')">Add to Cart</button></div>`).join('')}
    </div>
  </div>`;
}

// ── CART ──
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const ci = cart.find(x => x.id === id);
  if (ci) ci.qty++;
  else cart.push({ ...p, qty: 1 });
  document.getElementById('cart-count').textContent = cart.reduce((a, c) => a + c.qty, 0);
  showToast(`${p.name} added to cart 🛍️`);
}

function renderCart() {
  const el = document.getElementById('cart-content');
  if (cart.length === 0) {
    el.innerHTML = `<div class="empty-state">
      <div class="empty-icon">🛍️</div>
      <div class="empty-title">Your cart is empty</div>
      <p class="empty-sub">Explore products and add your favourites</p>
      <br><button class="btn btn-primary" onclick="showPage('home')">Start Shopping</button>
    </div>`;
    return;
  }

  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const shipping = subtotal > 599 ? 0 : 79;
  const total = subtotal + shipping;

  el.innerHTML = `<div class="cart-layout">
    <div>${cart.map(c => `<div class="cart-item">
      <div class="cart-img">${c.img}</div>
      <div class="cart-info">
        <div class="cart-brand">${c.brand}</div>
        <div class="cart-name">${c.name}</div>
        <div class="cart-size">${c.size}</div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="updateQty(${c.id},-1)">−</button>
          <span class="qty-val">${c.qty}</span>
          <button class="qty-btn" onclick="updateQty(${c.id},1)">+</button>
        </div>
      </div>
      <div style="display:flex;align-items:center;">
        <span class="cart-price">₹${(c.price * c.qty).toLocaleString()}</span>
        <button class="cart-remove" onclick="removeFromCart(${c.id})">✕</button>
      </div>
    </div>`).join('')}</div>
    <div class="cart-summary">
      <h3 style="font-family:var(--font-display);font-size:22px;font-weight:400;margin-bottom:1.2rem;">Order Summary</h3>
      <div class="summary-row"><span>Subtotal (${cart.reduce((a, c) => a + c.qty, 0)} items)</span><span>₹${subtotal.toLocaleString()}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span class="tag-green">Free</span>' : '₹' + shipping}</span></div>
      ${subtotal < 599 ? `<div style="background:var(--rose-light);border-radius:10px;padding:8px 12px;font-size:12px;color:var(--rose-dark);margin-bottom:8px;">Add ₹${599 - subtotal} more for free delivery</div>` : ''}
      <div class="summary-row total"><span>Total</span><span>₹${total.toLocaleString()}</span></div>
      <button class="btn btn-primary" style="width:100%;margin-top:1rem;padding:14px;" onclick="placeOrder()">Place Order →</button>
      <div style="text-align:center;margin-top:12px;font-size:12px;color:var(--text-light);">🔒 Secure checkout · EMI available</div>
    </div>
  </div>`;
}

function updateQty(id, delta) {
  const ci = cart.find(x => x.id === id);
  if (ci) { ci.qty += delta; if (ci.qty <= 0) removeFromCart(id); }
  document.getElementById('cart-count').textContent = cart.reduce((a, c) => a + c.qty, 0);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  document.getElementById('cart-count').textContent = cart.reduce((a, c) => a + c.qty, 0);
  renderCart();
}

function placeOrder() {
  cart = [];
  document.getElementById('cart-count').textContent = '0';
  showToast('🎉 Order placed successfully!');
  renderCart();
}

// ── PRODUCT DETAIL ──
function openDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const discount = Math.round((1 - p.price / p.origPrice) * 100);
  document.getElementById('detail-content').innerHTML = `
    <div class="detail-layout">
      <div class="detail-img">${p.img}</div>
      <div>
        <div class="detail-brand">${p.brand}</div>
        <h1 class="detail-name">${p.name}</h1>
        <div class="detail-rating">
          <span class="stars" style="font-size:16px;">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
          <span style="font-size:14px;color:var(--text-muted);">${p.rating} · ${p.reviews.toLocaleString()} reviews</span>
        </div>
        <div class="detail-price">₹${p.price} <span class="detail-price-orig">₹${p.origPrice}</span> <span class="tag-green">${discount}% off</span></div>
        <div class="divider"></div>
        <div class="detail-tags">
          <span class="detail-tag">📦 ${p.size}</span>
          ${p.skin.map(s => `<span class="detail-tag">🌿 ${s} skin</span>`).join('')}
          <span class="detail-tag">${p.cat}</span>
        </div>
        <p class="detail-desc">${p.desc}</p>
        <div class="detail-actions">
          <button class="btn btn-primary" onclick="addToCart(${p.id});showPage('cart')">Add to Cart 🛍️</button>
          <button class="btn btn-outline" onclick="toggleCompare(${p.id});showPage('compare')">Compare ⇄</button>
        </div>
        <div class="divider"></div>
        <div style="font-size:13px;color:var(--text-muted);display:flex;gap:1.5rem;flex-wrap:wrap;">
          <span>✈️ Free delivery above ₹599</span>
          <span>↩️ 15-day returns</span>
          <span>💎 100% genuine</span>
        </div>
      </div>
    </div>
    <div class="reviews-section">
      <h3 style="font-family:var(--font-display);font-size:24px;font-weight:400;margin-bottom:1rem;">Customer Reviews</h3>
      <div style="display:flex;gap:2rem;margin-bottom:1.5rem;align-items:center;flex-wrap:wrap;">
        <div style="text-align:center;">
          <div style="font-size:48px;font-weight:600;font-family:var(--font-display);">${p.rating}</div>
          <div class="stars" style="font-size:18px;">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</div>
          <div style="font-size:12px;color:var(--text-light);margin-top:4px;">${p.reviews.toLocaleString()} reviews</div>
        </div>
        <div style="flex:1;min-width:200px;">
          ${[5, 4, 3, 2, 1].map(star => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="font-size:12px;color:var(--text-muted);min-width:12px;">${star}</span>
            <span style="font-size:12px;color:var(--warning);">★</span>
            <div class="progress-bar"><div class="progress-fill" style="width:${star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : 2}%"></div></div>
            <span style="font-size:12px;color:var(--text-light);min-width:30px;">${star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : 2}%</span>
          </div>`).join('')}
        </div>
      </div>
      ${reviews.slice(0, 2).map(r => `<div class="review-card">
        <div class="review-header">
          <div>
            <div class="reviewer">${r.name}</div>
            <div style="font-size:11px;color:var(--text-light);">${r.skin} skin · ${r.date}</div>
          </div>
          <div class="stars" style="font-size:14px;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        </div>
        <p class="review-text">${r.text}</p>
      </div>`).join('')}
    </div>`;
  showPage('detail');
}

// ── COPILOT ──
let chatHistory = [
  { role: 'assistant', text: "Hi! 👋 I'm your personal Skin Copilot. Tell me your skin type and concerns, and I'll recommend the best products for you. You can also ask me to compare brands or build a routine!" }
];

function renderChat() {
  const el = document.getElementById('chat-msgs');
  el.innerHTML = chatHistory.map(m => `<div class="msg msg-${m.role}">
    <div class="msg-bubble">${m.text}</div>
  </div>`).join('');
  el.scrollTop = el.scrollHeight;
}

function sendSuggestion(el) {
  document.getElementById('chat-input').value = el.textContent;
  sendChat();
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  chatHistory.push({ role: 'user', text });
  input.value = '';
  renderChat();
  setTimeout(() => {
    const resp = generateAIResponse(text.toLowerCase());
    chatHistory.push({ role: 'assistant', text: resp });
    renderChat();
  }, 800);
}

function generateAIResponse(msg) {
  if (msg.includes('oily') && msg.includes('acne'))
    return 'For oily, acne-prone skin I recommend:<br>1. <strong>Minimalist 10% Niacinamide Serum</strong> (₹599) — controls sebum, minimises pores<br>2. <strong>Plum Green Tea Toner</strong> (₹399) — BHA exfoliates and unclogs pores<br>3. <strong>Re\'equil Oily Skin Moisturizer</strong> (₹499) — oil-free, non-comedogenic<br><br>Morning routine: Cleanser → Toner → Serum → Moisturiser → SPF 50 🌞';
  if (msg.includes('dry'))
    return 'For dry skin, focus on hydration layers:<br>1. <strong>The Ordinary HA 2% + B5 Serum</strong> (₹999) — deep hydration<br>2. <strong>Neutrogena Hydro Boost Gel</strong> (₹699) — hyaluronic acid lock-in<br>3. <strong>Dot & Key Barrier Repair Cream</strong> (₹849) — ceramides for barrier repair<br><br>Apply serum on damp skin for maximum absorption! 💧';
  if (msg.includes('sensitive'))
    return 'Sensitive skin needs gentle, fragrance-free products:<br>1. <strong>Dot & Key Barrier Repair Cream</strong> (₹849) — ceramide-based, gentle<br>2. <strong>Simple Kind to Skin Toner</strong> (₹449) — alcohol-free, pro-vitamin B5<br>3. <strong>Neutrogena Hydro Boost</strong> (₹699) — non-comedogenic, hypoallergenic<br><br>Always patch test new products for 24 hours! 🌸';
  if (msg.includes('compare') || msg.includes('minimalist') || msg.includes('ordinary'))
    return 'Both are great science-backed brands! <strong>Minimalist</strong> is more affordable and India-made; ideal for beginners. <strong>The Ordinary</strong> has a wider range of actives and is great for experienced users.<br><br><button class="btn btn-outline btn-sm" style="margin-top:8px;" onclick="compareList=[1,6];showPage(\'compare\')">Compare Now →</button>';
  if (msg.includes('budget') || msg.includes('affordable'))
    return 'Best budget-friendly picks under ₹500:<br>🌿 <strong>Biotique Papaya Cleanser</strong> — ₹199<br>🍵 <strong>Plum Green Tea Toner</strong> — ₹399<br>☀️ <strong>Lakme Sun Expert SPF 50</strong> — ₹349<br>✨ <strong>Minimalist Niacinamide</strong> — ₹599<br><br>Great skincare doesn\'t have to be expensive!';
  if (msg.includes('routine'))
    return 'A simple 4-step routine:<br>🌅 <strong>Morning:</strong> Cleanser → Toner → Moisturiser → SPF<br>🌙 <strong>Night:</strong> Cleanser → Active Serum → Moisturiser<br><br>Start with basics, introduce actives one at a time. What\'s your skin type? I\'ll personalise this!';
  if (msg.includes('sunscreen') || msg.includes('spf'))
    return 'SPF is non-negotiable! ☀️<br>Best sunscreens on glōw:<br>1. <strong>Lakme Sun Expert SPF 50</strong> (₹349) — lightweight, daily use<br>2. Apply 15 mins before sun exposure<br>3. Reapply every 2 hours outdoors<br><br>PA+++ rating = better UVA protection for Indian summers!';
  return "I'd love to help! Could you share more about your skin type (oily/dry/combination/sensitive) or your specific concern? I can recommend products, build a routine, or compare brands for you. ✨";
}

// ── FEEDBACK ──
function renderReviews() {
  document.getElementById('reviews-list').innerHTML = reviews.map(r => `<div class="review-card">
    <div class="review-header">
      <div>
        <div class="reviewer">${r.name}</div>
        <div style="font-size:11px;color:var(--text-light);">${r.skin} skin · ${r.date}</div>
      </div>
      <span class="stars" style="font-size:14px;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
    </div>
    <div style="font-size:11px;margin-bottom:6px;"><span class="detail-tag" style="font-size:11px;padding:2px 8px;">${r.product}</span></div>
    <p class="review-text">${r.text}</p>
  </div>`).join('');
}

function setRating(val) {
  currentRating = val;
  document.querySelectorAll('#star-rate span').forEach((s, i) => {
    s.textContent = i < val ? '★' : '☆';
    s.classList.toggle('lit', i < val);
  });
}

function submitFeedback() {
  const product = document.getElementById('fb-product').value;
  const skin = document.getElementById('fb-skin').value;
  const review = document.getElementById('fb-review').value;
  const name = document.getElementById('fb-name').value;
  if (!product || !skin || !review || !name || !currentRating) { showToast('Please fill all fields'); return; }
  reviews.unshift({ name, skin, product, rating: currentRating, text: review, date: 'Just now' });
  document.getElementById('fb-product').value = '';
  document.getElementById('fb-skin').value = '';
  document.getElementById('fb-review').value = '';
  document.getElementById('fb-name').value = '';
  currentRating = 0;
  setRating(0);
  renderReviews();
  showToast('✨ Review submitted! Thank you');
}

// ── UTILITIES ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── INIT ──
renderProducts();
renderChat();
