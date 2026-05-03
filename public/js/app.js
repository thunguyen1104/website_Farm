/* ================================================================
   NAFARM – app.js (Backend Integration)
   Tích hợp với Node.js/Express API: JWT, OAuth, Products, Cart, Orders
   ================================================================ */

'use strict';

/* ── Helper ─────────────────────────────────────────────── */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const vnd = n => n.toLocaleString('vi-VN') + 'đ';

function toast(msg, type = '') {
  const tray = $('.toast-tray');
  if (!tray) return;
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = msg;
  tray.appendChild(el);
  setTimeout(() => el.style.opacity = '0', 2900);
  setTimeout(() => el.remove(), 3300);
}

// Lấy user từ cookie thông qua API
async function fetchCurrentUser() {
  try {
    const res = await fetch('/auth/me');
    const data = await res.json();
    return data.user;
  } catch (e) {
    return null;
  }
}

// Cập nhật UI dựa trên user
function updateUserUI(user) {
  const guestEl = $('#nav-guest');
  const userEl = $('#nav-user');
  const nameEl = $('.user-drop-name');
  const emailEl = $('.user-drop-email');
  if (user) {
    if (guestEl) guestEl.style.display = 'none';
    if (userEl) userEl.style.display = 'flex';
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
  } else {
    if (guestEl) guestEl.style.display = 'flex';
    if (userEl) userEl.style.display = 'none';
  }
}

/* ── Products (từ API) ──────────────────────────────────── */
let currentProducts = [];
let currentCat = 'all';
let currentSort = 'popular';
let currentSearch = '';

async function loadProducts() {
  try {
    let url = `/api/products?cat=${currentCat}&sort=${currentSort}`;
    if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;
    const res = await fetch(url);
    const data = await res.json();
    const products = Array.isArray(data) ? data : [];
    currentProducts = products;
    renderProductGrid(products);
  } catch (err) {
    toast('Lỗi tải sản phẩm', 'error');
  }
}

function renderProductGrid(products) {
  const grid = $('#prods-grid');
  const count = $('.prods-count');
  if (!grid) return;
  if (count) count.textContent = `${products.length} sản phẩm`;

  grid.innerHTML = products.map(p => `
    <div class="p-card reveal" data-id="${p._id}">
      <div class="p-card-img">
        <div class="p-emoji">${p.emoji || '🍃'}</div>
        <div class="p-badges">${(p.badges || []).map(b => `<span class="p-badge ${b}">${b === 'sale' ? 'Giảm' : b === 'new' ? 'Mới' : b === 'organic' ? 'Organic' : 'Hot'}</span>`).join('')}</div>
        <button class="p-wish" data-id="${p._id}">🤍</button>
        <div class="p-qr-hint">📱 QR Nguồn Gốc</div>
      </div>
      <div class="p-info">
        <div class="p-origin">📍 ${p.origin || 'Việt Nam'}</div>
        <h3 class="p-name">${p.name}</h3>
        <div class="p-stars">
          <span class="stars">${'★'.repeat(Math.floor(p.rating || 0))}${'☆'.repeat(5 - Math.floor(p.rating || 0))}</span>
          <span class="rn">${p.rating || 0}</span>
          <span class="rc">(${p.reviewsCount || 0})</span>
        </div>
        <p class="p-desc">${p.description || ''}</p>
        <div class="p-foot">
          <div>
            ${p.oldPrice ? `<span class="p-price-old">${vnd(p.oldPrice)}</span>` : ''}
            <span class="p-price">${vnd(p.price)}</span>
          </div>
          <button class="btn-cart-sm" data-id="${p._id}">+ Thêm</button>
        </div>
      </div>
    </div>`).join('');

  // Gắn sự kiện
  $$('.p-card').forEach(c => c.addEventListener('click', e => {
    if (e.target.closest('.btn-cart-sm') || e.target.closest('.p-wish')) return;
    openModal(c.dataset.id);
  }));
  $$('.btn-cart-sm').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); addToCart(b.dataset.id, 1); }));
  $$('.p-wish').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); toggleWish(b.dataset.id, b); }));
  observeReveal();
}

async function toggleWish(id, btn) {
  // Có thể gọi API yêu thích nếu có, nhưng tạm thời chỉ toast
  toast('❤️ Đã thêm yêu thích (demo)');
}

/* ── Cart (client-side + API khi checkout) ───────────────── */
let cart = []; // Lưu giỏ hàng local

function addToCart(id, qty = 1) {
  const product = currentProducts.find(p => p._id === id);
  if (!product) return;
  const existing = cart.find(i => i._id === id);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, qty });
  renderCartDrawer();
  toast(`✅ Đã thêm ${qty > 1 ? qty + '× ' : ''}"${product.name}"`);
}

function removeCartItem(id) {
  cart = cart.filter(i => i._id !== id);
  renderCartDrawer();
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i._id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) removeCartItem(id);
    else renderCartDrawer();
  }
}

function renderCartDrawer() {
  const body = $('.drw-body');
  const foot = $('.drw-foot');
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  $$('.badge-dot[data-role="cart"]').forEach(b => b.textContent = totalQty);

  if (!body) return;
  if (!cart.length) {
    body.innerHTML = `<div class="drw-empty"><div class="drw-empty-icon">🛒</div><p>Giỏ hàng trống</p></div>`;
    if (foot) foot.style.display = 'none';
    return;
  }

  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = sub >= 300000 ? 0 : 30000;
  const grand = sub + ship;

  body.innerHTML = cart.map(item => `
    <div class="c-item">
      <div class="c-item-img">${item.emoji || '🍃'}</div>
      <div class="c-item-info">
        <div class="c-item-name">${item.name}</div>
        <div class="c-item-price">${vnd(item.price)}</div>
        <div class="c-qty-row">
          <button class="cq-btn" data-id="${item._id}" data-d="-1">−</button>
          <span class="cq-n">${item.qty}</span>
          <button class="cq-btn" data-id="${item._id}" data-d="1">+</button>
        </div>
      </div>
      <button class="c-rm" data-id="${item._id}">🗑️</button>
    </div>`).join('');

  $$('.cq-btn').forEach(b => b.addEventListener('click', () => updateCartQty(b.dataset.id, parseInt(b.dataset.d))));
  $$('.c-rm').forEach(b => b.addEventListener('click', () => removeCartItem(b.dataset.id)));

  foot.style.display = 'block';
  foot.innerHTML = `
    <div class="cart-line"><span>Tạm tính:</span><span>${vnd(sub)}</span></div>
    <div class="cart-line"><span>Vận chuyển:</span><span>${ship === 0 ? 'Miễn phí 🎉' : vnd(ship)}</span></div>
    ${sub < 300000 ? `<div class="cart-line" style="color:var(--primary);font-size:.75rem"><span>Thêm ${vnd(300000 - sub)} để miễn ship</span></div>` : ''}
    <div class="cart-grand"><span class="cart-grand-lbl">Tổng cộng:</span><span class="cart-grand-val">${vnd(grand)}</span></div>
    <div class="pay-chips">
      <span class="pay-chip">💳 VNPay</span><span class="pay-chip">📱 MoMo</span>
      <span class="pay-chip">💵 COD</span><span class="pay-chip">🏦 ATM</span>
    </div>
    <button class="btn btn-primary btn-block btn-lg" id="checkout-btn">🎉 Đặt Hàng Ngay</button>`;
  $('#checkout-btn')?.addEventListener('click', checkout);
}

async function checkout() {
  const user = await fetchCurrentUser();
  if (!user) {
    toast('⚠️ Vui lòng đăng nhập để đặt hàng', 'warn');
    openAuth();
    return;
  }
  if (!cart.length) {
    toast('Giỏ hàng trống', 'warn');
    return;
  }
  const items = cart.map(i => ({
    productId: i._id,
    name: i.name,
    price: i.price,
    qty: i.qty,
    emoji: i.emoji
  }));
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingFee = sub >= 300000 ? 0 : 30000;
  const total = sub + shippingFee;
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, total, shippingFee, address: 'Địa chỉ mặc định', paymentMethod: 'COD' })
    });
    const data = await res.json();
    if (data.success) {
      toast('🎉 Đặt hàng thành công!');
      cart = [];
      renderCartDrawer();
      closeCart();
    } else {
      toast('Lỗi đặt hàng', 'error');
    }
  } catch (err) {
    toast('Lỗi kết nối', 'error');
  }
}

/* ── Orders History ─────────────────────────────────────── */
async function openOrders() {
  const user = await fetchCurrentUser();
  if (!user) {
    toast('Đăng nhập để xem đơn hàng', 'warn');
    openAuth();
    return;
  }
  try {
    const res = await fetch('/api/orders');
    const orders = await res.json();
    const body = $('.orders-body');
    if (!body) return;
    body.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-row">
          <span class="order-id">${o._id.slice(-8)}</span>
          <span class="o-status ${o.status}">${o.status === 'delivered' ? '✅ Đã giao' : o.status === 'shipping' ? '🚚 Đang giao' : '⏳ Đang xử lý'}</span>
        </div>
        <div class="order-items">${o.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</div>
        <div class="order-meta"><span class="order-total">${vnd(o.total)}</span><span class="order-date">${new Date(o.createdAt).toLocaleDateString('vi-VN')}</span></div>
      </div>`).join('');
    closeCart();
    $('.orders-drw')?.classList.add('on');
    $('.drw-overlay')?.classList.add('on');
    document.body.style.overflow = 'hidden';
  } catch (err) {
    toast('Lỗi tải đơn hàng', 'error');
  }
}

/* ── Product Detail Modal + QR ───────────────────────────── */
async function openModal(id) {
  try {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    const p = data.product;
    if (!p) return;
    const qrCells = Array(81).fill().map((_, i) => {
      const x = i % 9, y = Math.floor(i / 9);
      const corner = (x < 4 && y < 4) || (x >= 5 && y < 4) || (x < 4 && y >= 5);
      return corner ? 'var(--green-900)' : 'transparent';
    });
    const modal = $('.p-modal');
    const overlay = $('.overlay');
    modal.innerHTML = `
      <button class="modal-x" id="mx">✕</button>
      <div class="modal-layout">
        <div class="modal-left">
          <div class="modal-big-emoji">${p.emoji || '🌿'}</div>
          <div class="qr-block">
            <div class="qr-visual">${qrCells.map(c => `<div class="qr-cell" style="background:${c}"></div>`).join('')}</div>
            <div class="qr-label">📱 Truy Xuất</div>
            <div class="qr-sub">Nguồn gốc · ${p.origin || 'Việt Nam'}</div>
            <button class="qr-scan-btn">🔍 Xem Chi Tiết</button>
          </div>
        </div>
        <div class="modal-right">
          <div class="modal-origin">📍 ${p.origin || ''}</div>
          <h2 class="modal-name">${p.name}</h2>
          <div class="modal-rating p-stars">...</div>
          <p class="modal-desc">${p.description || ''}</p>
          <div class="modal-tags">${(p.tags || []).map(t => `<span class="m-tag">✓ ${t}</span>`).join('')}</div>
          <div class="modal-price-row">
            <span class="modal-price">${vnd(p.price)}</span>
            ${p.oldPrice ? `<span class="modal-price-old">${vnd(p.oldPrice)}</span>` : ''}
          </div>
          <div class="qty-row">
            <span class="qty-lbl">Số lượng:</span>
            <div class="qty-ctrl">
              <button class="qb" id="qm">−</button>
              <span class="qv" id="qd">1</span>
              <button class="qb" id="qp">+</button>
            </div>
          </div>
          <div class="modal-cta">
            <button class="btn btn-primary btn-lg" id="m-add">🛒 Thêm Vào Giỏ</button>
            <button class="btn btn-ghost" id="m-wish">🤍 Yêu Thích</button>
          </div>
          <div class="origin-story">
            <div class="origin-story-title">🌱 Câu Chuyện Nguồn Gốc</div>
            <div class="origin-story-text">${p.story || 'NaFarm kết nối trực tiếp nông trại Việt Nam.'}</div>
          </div>
        </div>
      </div>`;
    $('#mx')?.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    let qty = 1;
    $('#qm')?.addEventListener('click', () => { if (qty > 1) { qty--; $('#qd').textContent = qty; } });
    $('#qp')?.addEventListener('click', () => { qty++; $('#qd').textContent = qty; });
    $('#m-add')?.addEventListener('click', () => { addToCart(p._id, qty); closeModal(); });
    $('#m-wish')?.addEventListener('click', () => toast('❤️ Yêu thích (demo)'));
    $('.qr-scan-btn')?.addEventListener('click', () => toast(`📱 Nguồn gốc: ${p.origin || 'Việt Nam'}`));
    modal.classList.add('on');
    overlay.classList.add('on');
    document.body.style.overflow = 'hidden';
  } catch (err) {
    toast('Lỗi tải chi tiết sản phẩm', 'error');
  }
}
function closeModal() {
  $('.p-modal')?.classList.remove('on');
  $('.overlay')?.classList.remove('on');
  document.body.style.overflow = '';
}

/* ── Auth Modal & API ────────────────────────────────────── */
const openAuth = () => { $('.auth-overlay')?.classList.add('on'); document.body.style.overflow = 'hidden'; };
const closeAuth = () => { $('.auth-overlay')?.classList.remove('on'); document.body.style.overflow = ''; };

async function login(email, password) {
  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      toast(`👋 Chào ${data.user.name}`);
      updateUserUI(data.user);
      closeAuth();
    } else {
      toast(data.error || 'Sai thông tin', 'error');
    }
  } catch (err) {
    toast('Lỗi kết nối', 'error');
  }
}

async function register(name, email, password) {
  try {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (data.success) {
      toast(`🎉 Đăng ký thành công! Chào ${data.user.name}`);
      updateUserUI(data.user);
      closeAuth();
    } else {
      toast(data.error || 'Đăng ký thất bại', 'error');
    }
  } catch (err) {
    toast('Lỗi kết nối', 'error');
  }
}

async function logout() {
  await fetch('/auth/logout', { method: 'POST' });
  updateUserUI(null);
  toast('👋 Đã đăng xuất');
}

function initAuth() {
  $$('[data-open-auth]').forEach(el => el.addEventListener('click', openAuth));
  $('.auth-overlay')?.addEventListener('click', e => { if (e.target === $('.auth-overlay')) closeAuth(); });
  $$('.a-tab').forEach(t => t.addEventListener('click', () => {
    $$('.a-tab').forEach(x => x.classList.remove('on'));
    $$('.a-pane').forEach(x => x.classList.remove('on'));
    t.classList.add('on');
    $(`.a-pane[data-p="${t.dataset.t}"]`)?.classList.add('on');
  }));
  $('#login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#l-email')?.value.trim();
    const pass = $('#l-pass')?.value;
    if (email && pass) login(email, pass);
  });
  $('#reg-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#r-name')?.value.trim();
    const email = $('#r-email')?.value.trim();
    const pass = $('#r-pass')?.value;
    if (name && email && pass) register(name, email, pass);
  });
  $$('.s-btn').forEach(b => b.addEventListener('click', () => {
    window.location.href = '/auth/google';
  }));
  $('#btn-logout')?.addEventListener('click', logout);
  $('#btn-orders')?.addEventListener('click', () => openOrders());
}

/* ── Event Listeners, Drawers, Search, Filters ──────────── */
function initCartDrawer() {
  $('.btn-open-cart')?.addEventListener('click', () => {
    closeOrders();
    $('.cart-drw')?.classList.add('on');
    $('.drw-overlay')?.classList.add('on');
    document.body.style.overflow = 'hidden';
  });
  $('.drw-overlay')?.addEventListener('click', () => {
    $('.cart-drw')?.classList.remove('on');
    $('.orders-drw')?.classList.remove('on');
    document.body.style.overflow = '';
  });
  $$('.drw-close').forEach(b => b.addEventListener('click', () => {
    $('.cart-drw')?.classList.remove('on');
    $('.orders-drw')?.classList.remove('on');
    document.body.style.overflow = '';
  }));
}
function closeCart() {
  $('.cart-drw')?.classList.remove('on');
  $('.orders-drw')?.classList.remove('on');
  $('.drw-overlay')?.classList.remove('on');
  document.body.style.overflow = '';
}
function closeOrders() { closeCart(); }

function initSearch() {
  const navInput = $('.nav-search input');
  navInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      currentSearch = navInput.value.trim();
      loadProducts();
    }
  });
  const heroSearch = $('.hero-search-go');
  heroSearch?.addEventListener('click', () => {
    currentSearch = $('.hero-searchbar input')?.value.trim() || '';
    loadProducts();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function initFilters() {
  $$('.f-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.f-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      loadProducts();
    });
  });
  $('.sort-sel')?.addEventListener('change', e => {
    currentSort = e.target.value;
    loadProducts();
  });
}

function initSubs() {
  $$('.sub-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const user = await fetchCurrentUser();
      if (!user) { toast('Đăng nhập để đăng ký gói', 'warn'); openAuth(); return; }
      toast('🌿 Đăng ký gói thành công!');
    });
  });
}

function initNewsletter() {
  $('.nl-form')?.addEventListener('submit', e => {
    e.preventDefault();
    toast('🎉 Đã đăng ký nhận ưu đãi!');
  });
}

function animateStats() { /* giữ nguyên từ cũ */ }
function observeReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: 0.08 });

  $$('.reveal').forEach(el => observer.observe(el));
}

/* ── Init ────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', async () => {
  initAuth();
  initCartDrawer();
  initSearch();
  initFilters();
  initSubs();
  initNewsletter();
  observeReveal();
  const user = await fetchCurrentUser();
  updateUserUI(user);
  await loadProducts();
  renderCartDrawer();
});