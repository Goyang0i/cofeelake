import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://zlzfdpsnrpnhpqbjnkhl.supabase.co";
const SUPABASE_KEY = "sb_publishable_ICGMBgKXj4CPDBQd1qlyXg_O6rKOKLd";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = (id) => document.getElementById(id);

let menuProducts = [];
let menuLoaded = false;

const loginScreen = $("login-screen");
const app = $("app");
const loginForm = $("login-form");
const loginButton = $("login-button");
const loginMessage = $("login-message");

let orders = [];
let orderItems = [];
let selectedOrderId = null;
let currentSection = "dashboard";

const money = (value) =>
  `${Number(value || 0).toLocaleString("en-US")} ₸`;

const escapeHTML = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);

function statusLabel(status) {
  const labels = {
    received: "Received",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled"
  };
  return labels[status] || status;
}

function statusClass(status) {
  return `status-${status || "received"}`;
}

function orderNumber(order) {
  return order.order_number
    ? `#${order.order_number}`
    : `#${String(order.id).slice(0, 8)}`;
}

function formatTime(dateValue) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDate(dateValue) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short"
  });
}

function itemsForOrder(orderId) {
  return orderItems.filter(
    item => String(item.order_id) === String(orderId)
  );
}

function orderItemSummary(order) {
  const items = itemsForOrder(order.id);
  if (!items.length) return "—";

  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item.quantity || 1), 0
  );

  const first = items[0];
  const firstName = first.product_name || "Drink";

  return items.length === 1
    ? `${totalQuantity} × ${firstName}`
    : `${totalQuantity} items`;
}

function selectedOrdersForPeriod() {
  const period = $("period-select").value;

  if (period === "all") return orders;

  const days = Number(period);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return orders.filter(order =>
    order.created_at && new Date(order.created_at) >= cutoff
  );
}

function renderStats() {
  const periodOrders = selectedOrdersForPeriod();
  const validOrders = periodOrders.filter(
    order => order.status !== "cancelled"
  );

  const revenue = validOrders.reduce(
    (sum, order) => sum + Number(order.total || 0), 0
  );

  const average = validOrders.length
    ? revenue / validOrders.length
    : 0;

  $("total-orders").textContent =
    periodOrders.length.toLocaleString("en-US");

  $("total-revenue").textContent = money(revenue);
  $("average-order").textContent = money(Math.round(average));

  $("chart-total").textContent =
    `${periodOrders.length} orders`;
}

function renderChart() {
  const svg = $("orders-chart");
  const period = $("period-select").value;
  const days = period === "all" ? 7 : Number(period);
  const numberOfDays = Math.min(days, 30);

  const labels = [];
  const counts = [];

  for (let i = numberOfDays - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    labels.push(date.toLocaleDateString("en-US", {
      weekday: numberOfDays <= 7 ? "short" : "numeric",
      day: numberOfDays > 7 ? "numeric" : undefined
    }));

    const count = orders.filter(order => {
      if (!order.created_at) return false;
      const orderDate = new Date(order.created_at);
      return orderDate.toDateString() === date.toDateString();
    }).length;

    counts.push(count);
  }

  const max = Math.max(5, ...counts);
  const chartWidth = 560;
  const chartHeight = 160;
  const left = 30;
  const top = 15;
  const bottom = 185;

  const points = counts.map((count, index) => {
    const x = left + (index / Math.max(1, counts.length - 1)) * chartWidth;
    const y = bottom - (count / max) * chartHeight;
    return { x, y, count };
  });

  const line = points.map((point, index) =>
    `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
  ).join(" ");

  const area = `${line} L ${points[points.length - 1].x} ${bottom} L ${points[0].x} ${bottom} Z`;

  const grid = [0, 1, 2, 3].map(step => {
    const y = top + step * (chartHeight / 3);
    const value = Math.round(max * (3 - step) / 3);

    return `
      <line class="chart-grid-line" x1="${left}" y1="${y}"
        x2="590" y2="${y}"></line>
      <text class="chart-label" x="3" y="${y + 4}">${value}</text>
    `;
  }).join("");

  const circles = points.map(point => `
    <circle class="chart-point" cx="${point.x}" cy="${point.y}" r="4.5"></circle>
  `).join("");

  const xLabels = points.map((point, index) => {
    if (numberOfDays > 14 && index % 4 !== 0) return "";

    return `
      <text class="chart-label" text-anchor="middle"
        x="${point.x}" y="215">${escapeHTML(labels[index])}</text>
    `;
  }).join("");

  svg.innerHTML = `
    <defs>
      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#78947b" stop-opacity=".28"></stop>
        <stop offset="100%" stop-color="#78947b" stop-opacity=".02"></stop>
      </linearGradient>
    </defs>
    ${grid}
    <path class="chart-area" d="${area}"></path>
    <path class="chart-line" d="${line}"></path>
    ${circles}
    ${xLabels}
  `;
}

// Image paths are relative to admin.html.
// Keep the filename extension exactly as it exists in the images folder.
const drinkImages = {
  "americano": "images/americano.jpg",
  "berry-fruit-tea": "images/berry-fruit-tea.jpg",
  "bumble-cherry": "images/bumble-cherry.webp",
  "cherry-bumble": "images/cherry-bumble.jpg",
  "espresso": "images/espresso.jpg",
  "lemon-iced-tea": "images/lemon-iced-tea.jpg",
  "masala-tea": "images/masala-tea.jpg",
  "orange-bubble-tea": "images/orange-bubble-tea.jpg",
  "pomegranate-iced-tea": "images/pomegranate-iced-tea.jpg",
  "sea-buckthorn-tea": "images/sea-buckthorn-tea.jpg",
  "tashkent-tea": "images/tashkent-tea.jpg",
  "apple-bumble": "images/apple-bumble.webp",
  "blueberry-bubble-tea": "images/blueberry-bubble-tea.webp",
  "bumble-peach": "images/bumble-peach.jpg",
  "double-americano": "images/double-americano.jpg",
  "karak-chai": "images/karak-chai.jpg",
  "mango-bubble-tea": "images/mango-bubble-tea.jpg",
  "moroccan-tea": "images/moroccan-tea.jpg",
  "oreo-bubble-tea": "images/oreo-bubble-tea.jpg",
  "raspberry-iced-tea": "images/raspberry-iced-tea.jpg",
  "strawberry_bubble_tea": "images/strawberry_bubble_tea.jpg",
  "toxic-matcha-bubble-tea": "images/toxic-matcha-bubble-tea.jpg",
  "a-thousand-and-one-nights": "images/a-thousand-and-one-nights.jpg",
  "blue-matcha-bubble-tea": "images/blue-matcha-bubble-tea.jpg",
  "cappuccino": "images/cappuccino.jpg",
  "double-espresso": "images/double-espresso.jpg",
  "latte": "images/latte.jpg",
  "mango-passion-fruit-tea": "images/mango-passion-fruit-tea.jpg",
  "mulled-tea": "images/mulled-tea.jpg",
  "peach-iced-tea": "images/peach-iced-tea.jpg",
  "sakura-bubble-tea": "images/sakura-bubble-tea.webp",
  "strawberry-bubble-tea": "images/strawberry-bubble-tea.jpg"
};

function renderPopularDrinks() {
  const totals = new Map();

  orderItems.forEach(item => {
    const order = orders.find(
      entry => String(entry.id) === String(item.order_id)
    );

    if (!order || order.status === "cancelled") return;

    const name = item.product_name || "Unknown drink";
    const quantity = Number(item.quantity || 1);

    totals.set(name, (totals.get(name) || 0) + quantity);
  });

  const popular = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const list = $("popular-list");

  if (!popular.length) {
    list.innerHTML = '<div class="empty-note">No drink data yet.</div>';
    return;
  }

  const max = popular[0][1];
  const total = popular.reduce((sum, item) => sum + item[1], 0);

  list.innerHTML = popular.map(([name, count]) => {
    const percent = total ? (count / total) * 100 : 0;
    const width = max ? (count / max) * 100 : 0;

    const rawKey = String(name).toLowerCase().trim().replace(/\s+/g, "-");
    const underscoreKey = rawKey.replace(/-/g, "_");
    const normalizedKey = rawKey.replace(/_/g, "-");

    const image =
      drinkImages[rawKey] ||
      drinkImages[underscoreKey] ||
      drinkImages[normalizedKey];

    const thumbnail = image
      ? `<img src="${image}" alt="${escapeHTML(name)}"
           loading="lazy"
           onerror="this.style.display='none'; this.parentElement.textContent='☕';">`
      : "☕";

    return `
      <div class="popular-item">
        <div class="drink-thumb">${thumbnail}</div>
        <div>
          <div class="drink-name">${escapeHTML(name)}</div>
          <div class="drink-meta">
            ${count} orders &nbsp; ${percent.toFixed(1)}%
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${width}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderOrdersTable() {
  const recent = [...orders].sort((a, b) =>
    new Date(b.created_at || 0) - new Date(a.created_at || 0)
  ).slice(0, 8);

  $("orders-table-body").innerHTML = recent.length
    ? recent.map(order => `
      <tr data-order-id="${escapeHTML(order.id)}"
          class="${String(order.id) === String(selectedOrderId) ? "selected" : ""}">
        <td class="order-number">${escapeHTML(orderNumber(order))}</td>
        <td>${escapeHTML(order.customer_name)}</td>
        <td>${escapeHTML(orderItemSummary(order))}</td>
        <td>${money(order.total)}</td>
        <td>
          <span class="status-pill ${statusClass(order.status)}">
            ${escapeHTML(statusLabel(order.status))}
          </span>
        </td>
        <td>${formatTime(order.created_at)}</td>
      </tr>
    `).join("")
    : '<tr><td colspan="6" class="empty-note">No orders found.</td></tr>';

  $("all-orders-body").innerHTML = [...orders]
    .sort((a, b) =>
      new Date(b.created_at || 0) - new Date(a.created_at || 0)
    )
    .map(order => `
      <tr data-order-id="${escapeHTML(order.id)}">
        <td class="order-number">${escapeHTML(orderNumber(order))}</td>
        <td>${escapeHTML(order.customer_name)}</td>
        <td>${escapeHTML(order.phone)}</td>
        <td>${escapeHTML(orderItemSummary(order))}</td>
        <td>${money(order.total)}</td>
        <td>
          <span class="status-pill ${statusClass(order.status)}">
            ${escapeHTML(statusLabel(order.status))}
          </span>
        </td>
        <td>${formatDate(order.created_at)} ${formatTime(order.created_at)}</td>
      </tr>
    `).join("");
}

function renderOrderDetails() {
  const order = orders.find(
    entry => String(entry.id) === String(selectedOrderId)
  );

  if (!order) {
    $("detail-order-title").textContent = "Select an order";
    $("order-details-content").innerHTML =
      '<div class="empty-note">Choose an order from the table to see its details.</div>';
    return;
  }

  const items = itemsForOrder(order.id);

  $("detail-order-title").textContent =
    `Order ${orderNumber(order)}`;

  $("order-details-content").innerHTML = `
    <div class="customer-info">
      <div class="customer-name">${escapeHTML(order.customer_name)}</div>
      <div>${escapeHTML(order.phone)}</div>
      <div>${formatTime(order.created_at)} · ${formatDate(order.created_at)}</div>
      <div>Pickup: ${escapeHTML(order.pickup_time || "Not specified")}</div>
    </div>

    <div class="details-divider"></div>

    <div class="detail-section-title">Items</div>

    ${items.length ? items.map(item => `
      <div class="detail-item">
        <div>
          <div class="detail-item-name">
            ${Number(item.quantity || 1)} × ${escapeHTML(item.product_name)}
          </div>
          <div class="detail-item-meta">
            ${escapeHTML(item.size_name || "")}
            ${item.sugar ? " · " + escapeHTML(item.sugar) + " sugar" : ""}
            ${item.syrup && item.syrup !== "None" ? " · " + escapeHTML(item.syrup) + " syrup" : ""}
          </div>
        </div>
        <strong>${money(Number(item.unit_price || 0) * Number(item.quantity || 1))}</strong>
      </div>
    `).join("") : '<div class="empty-note">No item details found.</div>'}

    <div class="details-divider"></div>

    <div class="detail-total">
      <span>Total</span>
      <span>${money(order.total)}</span>
    </div>

    <div class="current-status">
      <strong>Status</strong>
      <span class="status-pill ${statusClass(order.status)}">
        ${escapeHTML(statusLabel(order.status))}
      </span>
    </div>

    <div class="detail-section-title">Update status:</div>

    <div class="status-actions">
      <button class="status-action preparing" data-status="preparing">Preparing</button>
      <button class="status-action ready" data-status="ready">Ready</button>
      <button class="status-action completed" data-status="completed">Completed</button>
      <button class="status-action cancel" data-status="cancelled">Cancel</button>
    </div>
  `;

  $("app-message").textContent = "";
}

function renderDashboard() {
  renderStats();
  renderChart();
  renderPopularDrinks();
  renderOrdersTable();
  renderOrderDetails();
}

async function callAdmin(action, extra = {}) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session?.access_token) {
    throw new Error("Your session expired. Please sign in again.");
  }

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/clever-api`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${sessionData.session.access_token}`
      },
      body: JSON.stringify({ action, ...extra })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `Server error: ${response.status}`);
  }

  return result;
}

async function loadOrders() {
  $("app-message").textContent = "Loading orders...";

  try {
    const result = await callAdmin("admin_orders");

    orders = Array.isArray(result.orders) ? result.orders : [];
    orderItems = Array.isArray(result.items) ? result.items : [];

    if (
      selectedOrderId &&
      !orders.some(order => String(order.id) === String(selectedOrderId))
    ) {
      selectedOrderId = null;
    }

    if (!selectedOrderId && orders.length) {
      selectedOrderId = orders[0].id;
    }

    renderDashboard();
    $("app-message").textContent = "";

  } catch (error) {
    console.error("Could not load orders:", error);
    $("app-message").textContent =
      error instanceof Error ? error.message : "Could not load orders.";
  }
}

async function updateOrderStatus(status) {
  if (!selectedOrderId) return;

  const buttons = document.querySelectorAll("[data-status]");
  buttons.forEach(button => button.disabled = true);

  $("app-message").textContent = "Updating order status...";

  try {
    await callAdmin("admin_update_status", {
      orderId: selectedOrderId,
      status
    });

    const order = orders.find(
      entry => String(entry.id) === String(selectedOrderId)
    );

    if (order) order.status = status;

    renderDashboard();
    $("app-message").textContent = "Order status updated.";

  } catch (error) {
    console.error("Status update failed:", error);
    $("app-message").textContent =
      error instanceof Error ? error.message : "Could not update status.";
    buttons.forEach(button => button.disabled = false);
  }
}

function showSection(section) {
  currentSection = section;

  document.querySelectorAll(".nav-button[data-section]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.section === section
    );
  });

  [
    "dashboard",
    "orders",
    "analytics",
    "menu",
    "settings"
  ].forEach(name => {
    $(`${name}-section`).classList.toggle(
      "hidden",
      name !== section
    );
  });

  const titles = {
    dashboard: ["Good morning!", "Here's what's happening at Coffee Lake today."],
    orders: ["Orders", "Manage your café orders."],
    analytics: ["Analytics", "Explore your café performance."],
    menu: ["Menu", "Manage your café menu."],
    settings: ["Settings", "Manage your staff workspace."]
  };

  $("greeting").textContent = titles[section][0];
  document.querySelector(".page-subtitle").textContent = titles[section][1];
  if (section === "analytics") {
  renderAnalytics();
}
  if (section === "menu") loadMenuProducts();
}


let ordersRefreshInterval = null;

function startOrdersAutoRefresh() {
  if (ordersRefreshInterval) return;

  ordersRefreshInterval = setInterval(() => {
    loadOrders();
  }, 5000);
}

function stopOrdersAutoRefresh() {
  if (!ordersRefreshInterval) return;

  clearInterval(ordersRefreshInterval);
  ordersRefreshInterval = null;
}


function showApp(user) {
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");

  const emailName = user?.email?.split("@")[0] || "Staff";
  $("staff-avatar").textContent =
    emailName.slice(0, 2).toUpperCase();

  const hour = new Date().getHours();
  $("greeting").textContent =
    hour < 12 ? "Good morning!" :
    hour < 18 ? "Good afternoon!" :
    "Good evening!";

  loadOrders();
  startOrdersAutoRefresh();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginMessage.textContent = "";
  loginButton.disabled = true;
  loginButton.textContent = "Signing in...";

  try {
    const email = $("email").value.trim();
    const password = $("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error("Sign in failed. Check your email and password.");
    }

    loginMessage.style.color = "var(--green)";
    loginMessage.textContent = "Checking staff access...";

    const result = await callAdmin("admin_orders");

    orders = Array.isArray(result.orders) ? result.orders : [];
    orderItems = Array.isArray(result.items) ? result.items : [];

    showApp(data.user);
    renderDashboard();

  } catch (error) {
    console.error("Staff sign-in error:", error);

    await supabase.auth.signOut();

    loginMessage.style.color = "var(--red-text)";
    loginMessage.textContent =
      error instanceof Error ? error.message : "Could not sign in.";

  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign In";
  }
});

$("logout-button").addEventListener("click", async () => {
  await supabase.auth.signOut();

  orders = [];
  orderItems = [];
  selectedOrderId = null;

  app.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  loginForm.reset();
  loginMessage.textContent = "";
});

document.querySelectorAll(".nav-button[data-section]").forEach(button => {
  button.addEventListener("click", () => {
    showSection(button.dataset.section);
  });
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    showSection(button.dataset.go);
  });
});

$("period-select").addEventListener("change", renderDashboard);

$("refresh-orders").addEventListener("click", loadOrders);

$("clear-selection").addEventListener("click", () => {
  selectedOrderId = null;
  renderOrdersTable();
  renderOrderDetails();
});

document.addEventListener("click", event => {
  const row = event.target.closest("tr[data-order-id]");

  if (row) {
    selectedOrderId = row.dataset.orderId;
    renderOrdersTable();
    renderOrderDetails();
    return;
  }

  const statusButton = event.target.closest("[data-status]");

  if (statusButton) {
    updateOrderStatus(statusButton.dataset.status);
  }
});

// Restore an existing session and verify staff permissions.
const { data: existingSession } = await supabase.auth.getSession();

if (existingSession.session?.user) {
  try {
    const result = await callAdmin("admin_orders");

    orders = Array.isArray(result.orders) ? result.orders : [];
    orderItems = Array.isArray(result.items) ? result.items : [];

    showApp(existingSession.session.user);
    renderDashboard();

  } catch (error) {
    console.warn("Saved session could not access admin:", error);
    await supabase.auth.signOut();
  }
}


// =====================================
// NEW ADMIN PAGES
// =====================================

function imageForDrink(name) {
  const rawKey = String(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  const underscoreKey = rawKey.replace(/-/g, "_");
  const normalizedKey = rawKey.replace(/_/g, "-");

  return drinkImages[rawKey] ||
    drinkImages[underscoreKey] ||
    drinkImages[normalizedKey] ||
    "";
}


// ANALYTICS

function renderAnalytics() {
  const validOrders = orders.filter(
    order => order.status !== "cancelled"
  );

  const revenue = validOrders.reduce(
    (sum, order) => sum + Number(order.total || 0), 0
  );

  const average = validOrders.length
    ? revenue / validOrders.length
    : 0;

  $("analytics-orders").textContent = validOrders.length;
  $("analytics-revenue").textContent = money(revenue);
  $("analytics-average").textContent = money(Math.round(average));

  $("analytics-cancelled").textContent =
    orders.filter(order => order.status === "cancelled").length;

  const totals = new Map();

  orderItems.forEach(item => {
    const order = orders.find(
      entry => String(entry.id) === String(item.order_id)
    );

    if (!order || order.status === "cancelled") return;

    const name = item.product_name || "Unknown drink";
    const quantity = Number(item.quantity || 1);

    totals.set(name, (totals.get(name) || 0) + quantity);
  });

  const popular = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const max = popular[0]?.[1] || 1;

  $("analytics-products").innerHTML = popular.length
    ? popular.map(([name, count]) => {
        const image = imageForDrink(name);

        return `
          <div class="admin-product-row">
            <div class="admin-product-image">
              ${image
                ? `<img src="${image}" alt="${escapeHTML(name)}">`
                : "☕"}
            </div>
            <div class="admin-product-info">
              <strong>${escapeHTML(name)}</strong>
              <span>${count} sold</span>
              <div class="admin-progress">
                <div style="width:${count / max * 100}%"></div>
              </div>
            </div>
          </div>
        `;
      }).join("")
    : '<p class="empty-note">No product sales data yet.</p>';

  const statuses = [
    "received",
    "preparing",
    "ready",
    "completed",
    "cancelled"
  ];

  $("analytics-statuses").innerHTML = statuses.map(status => {
    const count = orders.filter(
      order => order.status === status
    ).length;

    return `
      <div class="admin-status-row">
        <span>${escapeHTML(statusLabel(status))}</span>
        <strong>${count}</strong>
      </div>
    `;
  }).join("");
}



// SETTINGS

function loadCafeSettings() {
  let settings = {};

  try {
    settings = JSON.parse(
      localStorage.getItem("coffeeLakeAdminSettings") || "{}"
    );
  } catch (error) {
    console.warn("Could not read café settings:", error);
  }

  $("setting-cafe-name").value =
    settings.name || "Coffee Lake";

  $("setting-tagline").value =
    settings.tagline || "Your Campus Café";

  $("setting-currency").value =
    settings.currency || "₸";
}

$("cafe-settings-form").addEventListener("submit", event => {
  event.preventDefault();

  const settings = {
    name: $("setting-cafe-name").value.trim(),
    tagline: $("setting-tagline").value.trim(),
    currency: $("setting-currency").value
  };

  localStorage.setItem(
    "coffeeLakeAdminSettings",
    JSON.stringify(settings)
  );

  $("settings-message").textContent = "Settings saved in this browser.";
});


// INITIALIZE NEW PAGES
loadCafeSettings();

// ===== MENU MANAGEMENT (products + product_sizes) =====
function menuImagePath(product) {
  const path = String(product.image || "").trim();
  return path || "";
}

function menuMessage(message, isError = false) {
  const node = $("menu-message");
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("is-error", isError);
}

function renderMenuCategoryFilter() {
  const select = $("menu-category-filter");
  if (!select) return;
  const previous = select.value;
  const categories = [...new Set(menuProducts.map(p => String(p.category || "").trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  select.innerHTML = '<option value="">All categories</option>' +
    categories.map(category => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
  select.value = categories.includes(previous) ? previous : "";
}

function renderMenuProducts() {
  const grid = $("menu-products-grid");
  if (!grid) return;

  const search = ($("menu-search")?.value || "").trim().toLowerCase();
  const category = $("menu-category-filter")?.value || "";
  const availability = $("menu-availability-filter")?.value || "all";

  const filtered = menuProducts.filter(product => {
    const matchesSearch = `${product.name || ""} ${product.category || ""}`.toLowerCase().includes(search);
    const matchesCategory = !category || product.category === category;
    const available = product.is_available !== false;
    const matchesAvailability = availability === "all" ||
      (availability === "available" && available) ||
      (availability === "unavailable" && !available);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-note admin-menu-empty">No products match these filters.</div>';
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const sizes = Array.isArray(product.product_sizes) ? product.product_sizes : [];
    const priceText = sizes.length
      ? sizes.map(size => `${escapeHTML(size.size_name)}: ${money(size.price)}`).join(" · ")
      : "No sizes or prices";
    const image = menuImagePath(product);
    return `
      <article class="admin-menu-card">
        <div class="admin-menu-photo">
          ${image ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.hidden=false">` : ""}
          <span class="admin-menu-photo-fallback" ${image ? "hidden" : ""}>☕</span>
          <span class="admin-menu-availability ${product.is_available === false ? "unavailable" : ""}">
            ${product.is_available === false ? "Unavailable" : "Available"}
          </span>
        </div>
        <div class="admin-menu-card-content">
          <div class="admin-menu-card-top">
            <div>
              <h3>${escapeHTML(product.name)}</h3>
              <span class="admin-menu-category">${escapeHTML(product.category || "Uncategorised")}</span>
            </div>
          </div>
          <p class="admin-menu-description">${escapeHTML(product.description || "No description")}</p>
          <p class="admin-menu-prices">${priceText}</p>
          <div class="admin-menu-card-actions">
            <button type="button" class="admin-secondary-button" data-edit-product="${escapeHTML(product.id)}">Edit</button>
            <button type="button" class="admin-secondary-button" data-toggle-product="${escapeHTML(product.id)}">
              ${product.is_available === false ? "Make available" : "Make unavailable"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

async function loadMenuProducts(force = false) {
  if (menuLoaded && !force) {
    renderMenuProducts();
    return;
  }

  menuMessage("Loading menu...");
  const grid = $("menu-products-grid");
  if (grid) grid.innerHTML = '<p class="empty-note">Loading products...</p>';

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category, description, image, is_available, created_at, product_sizes(id, product_id, size_name, price)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    menuProducts = (data || []).map(product => ({
      ...product,
      product_sizes: Array.isArray(product.product_sizes) ? product.product_sizes : []
    }));
    menuLoaded = true;
    renderMenuCategoryFilter();
    renderMenuProducts();
    menuMessage(`${menuProducts.length} products loaded.`);
  } catch (error) {
    console.error("Could not load menu products:", error);
    if (grid) grid.innerHTML = '<p class="empty-note">Could not load products.</p>';
    menuMessage(error.message || "Could not load menu products. Check Supabase permissions (RLS).", true);
  }
}

function addProductSizeRow(size = {}) {
  const container = $("product-sizes-editor");
  if (!container) return;
  const row = document.createElement("div");
  row.className = "admin-size-row";
  row.innerHTML = `
    <label>Size name
      <input class="size-name-input" type="text" maxlength="40" placeholder="Regular" value="${escapeHTML(size.size_name || "")}" required>
    </label>
    <label>Price (₸)
      <input class="size-price-input" type="number" min="0" step="1" placeholder="1200" value="${size.price == null ? "" : escapeHTML(size.price)}" required>
    </label>
    <button type="button" class="admin-remove-size" aria-label="Remove size">×</button>
  `;
  row.querySelector(".admin-remove-size").addEventListener("click", () => {
    row.remove();
    if (!container.children.length) addProductSizeRow();
  });
  container.appendChild(row);
}

function openProductEditor(product = null) {
  $("product-form").reset();
  $("product-id").value = product?.id || "";
  $("product-name").value = product?.name || "";
  $("product-category").value = product?.category || "";
  $("product-description").value = product?.description || "";
  $("product-image").value = product?.image || "";
  $("product-available").checked = product ? product.is_available !== false : true;
  $("product-editor-title").textContent = product ? "Edit product" : "Add product";
  $("save-product-button").textContent = product ? "Save changes" : "Add product";
  $("product-form-message").textContent = "";

  const sizesEditor = $("product-sizes-editor");
  sizesEditor.innerHTML = "";
  const sizes = product?.product_sizes?.length ? product.product_sizes : [{ size_name: "", price: "" }];
  sizes.forEach(size => addProductSizeRow(size));

  $("product-editor").classList.remove("hidden");
  $("product-editor").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeProductEditor() {
  $("product-editor").classList.add("hidden");
  $("product-form").reset();
}

async function saveMenuProduct(event) {
  event.preventDefault();
  const saveButton = $("save-product-button");
  const message = $("product-form-message");
  saveButton.disabled = true;
  message.textContent = "Saving...";

  try {
    const name = $("product-name").value.trim();
    const category = $("product-category").value.trim();
    const image = $("product-image").value.trim();
    const sizeRows = [...$("product-sizes-editor").querySelectorAll(".admin-size-row")];
    const sizes = sizeRows.map(row => ({
      size_name: row.querySelector(".size-name-input").value.trim(),
      price: Number(row.querySelector(".size-price-input").value)
    }));

    if (!name || !category || !image) throw new Error("Fill in the product name, category and image path.");
    if (!image.startsWith("images/")) throw new Error("Image path must start with images/.");
    if (!sizes.length || sizes.some(size => !size.size_name || !Number.isFinite(size.price) || size.price < 0)) {
      throw new Error("Add at least one size and enter a valid non-negative price for each size.");
    }

    const duplicateSizes = sizes.map(size => size.size_name.toLowerCase());
    if (new Set(duplicateSizes).size !== duplicateSizes.length) {
      throw new Error("Size names must be unique within a product.");
    }

    const productPayload = {
      name,
      category,
      description: $("product-description").value.trim(),
      image,
      is_available: $("product-available").checked
    };

    const productId = $("product-id").value;
    let savedProduct;

    if (productId) {
      const { data, error } = await supabase.from("products")
        .update(productPayload).eq("id", productId)
        .select("id").single();
      if (error) throw error;
      savedProduct = data;
    } else {
      const { data, error } = await supabase.from("products")
        .insert(productPayload).select("id").single();
      if (error) throw error;
      savedProduct = data;
    }

    const { error: sizeDeleteError } = await supabase
      .from("product_sizes").delete().eq("product_id", savedProduct.id);
    if (sizeDeleteError) throw sizeDeleteError;

    const sizePayload = sizes.map(size => ({
      product_id: savedProduct.id,
      size_name: size.size_name,
      price: size.price
    }));
    const { error: sizeInsertError } = await supabase.from("product_sizes").insert(sizePayload);
    if (sizeInsertError) throw sizeInsertError;

    closeProductEditor();
    await loadMenuProducts(true);
    menuMessage(productId ? "Product updated successfully." : "Product added successfully.");
  } catch (error) {
    console.error("Could not save product:", error);
    message.textContent = error.message || "Could not save product.";
    message.classList.add("is-error");
  } finally {
    saveButton.disabled = false;
  }
}

async function toggleProductAvailability(productId) {
  const product = menuProducts.find(item => String(item.id) === String(productId));
  if (!product) return;
  const nextValue = product.is_available === false;
  const confirmation = nextValue
    ? `Make "${product.name}" available for sale?`
    : `Make "${product.name}" unavailable? It will remain in the database and order history.`;
  if (!window.confirm(confirmation)) return;

  try {
    const { error } = await supabase.from("products")
      .update({ is_available: nextValue }).eq("id", productId);
    if (error) throw error;
    await loadMenuProducts(true);
    menuMessage(nextValue ? "Product is now available." : "Product is now unavailable.");
  } catch (error) {
    console.error("Could not update product availability:", error);
    menuMessage(error.message || "Could not update product availability.", true);
  }
}

$("add-product-button")?.addEventListener("click", () => openProductEditor());
$("close-product-editor")?.addEventListener("click", closeProductEditor);
$("cancel-product-edit")?.addEventListener("click", closeProductEditor);
$("add-size-row")?.addEventListener("click", () => addProductSizeRow());
$("product-form")?.addEventListener("submit", saveMenuProduct);
$("menu-search")?.addEventListener("input", renderMenuProducts);
$("menu-category-filter")?.addEventListener("change", renderMenuProducts);
$("menu-availability-filter")?.addEventListener("change", renderMenuProducts);

$("menu-products-grid")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-product]");
  if (editButton) {
    const product = menuProducts.find(item => String(item.id) === String(editButton.dataset.editProduct));
    if (product) openProductEditor(product);
    return;
  }
  const toggleButton = event.target.closest("[data-toggle-product]");
  if (toggleButton) toggleProductAvailability(toggleButton.dataset.toggleProduct);
});
