
"use strict";

const PHOTO = "https://images.unsplash.com/";
const photo = (id) => `${PHOTO}${id}?auto=format&fit=crop&w=800&q=80`;

const products = [
  {
    id: "espresso",
    name: "Espresso",
    category: "Coffee",
    description: "A concentrated shot with a rich, bold coffee flavour.",
    image: "images/espresso.jpg",
    sizes: [{ name: "30 ml", price: 600 }]
  },
  {
    id: "double-espresso",
    name: "Double Espresso",
    category: "Coffee",
    description: "Two espresso shots for a fuller coffee experience.",
    image: "images/double-espresso.jpg",
    sizes: [{ name: "60 ml", price: 700 }]
  },
  {
    id: "americano",
    name: "Americano",
    category: "Coffee",
    description: "Smooth espresso balanced with hot water.",
    image: "images/americano.jpg",
    sizes: [{ name: "350 ml", price: 700 }]
  },
  {
    id: "double-americano",
    name: "Double Americano",
    category: "Coffee",
    description: "A larger Americano with a stronger coffee taste.",
    image: "images/double-americano.jpg",
    sizes: [{ name: "450 ml", price: 900 }]
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "Coffee",
    description: "Espresso with steamed milk and a soft foam finish.",
    image:"images/cappuccino.jpg",
    sizes: [{ name: "350 ml", price: 900 }, { name: "450 ml", price: 1000 }]
  },
  {
    id: "latte",
    name: "Latte",
    category: "Coffee",
    description: "A smooth espresso drink with creamy steamed milk.",
    image: "images/latte.jpg",
    sizes: [{ name: "350 ml", price: 900 }, { name: "450 ml", price: 1000 }]
  },

  {
    id: "bubble-oreo",
    name: "Oreo Bubble Tea",
    category: "Bubble Tea",
    description: "A creamy cookie-inspired drink with chewy tapioca pearls.",
    image: "images/oreo-bubble-tea.jpg",
    sizes: [{ name: "500 ml", price: 1590 }]
  },
  {
    id: "bubble-strawberry",
    name: "Strawberry Bubble Tea",
    category: "Bubble Tea",
    description: "A fruity strawberry drink with tapioca pearls.",
    image: "images/strawberry_bubble_tea.jpg",
    sizes: [{ name: "500 ml", price: 1590 }]
  },
  {
    id: "bubble-mango",
    name: "Mango Bubble Tea",
    category: "Bubble Tea",
    description: "Tropical mango flavour with chewy tapioca pearls.",
    image: "images/mango-bubble-tea.jpg",
    sizes: [{ name: "500 ml", price: 1590 }]
  },
  {
    id: "bubble-blueberry",
    name: "Blueberry Bubble Tea",
    category: "Bubble Tea",
    description: "A berry-inspired bubble tea with a refreshing finish.",
    image: "images/blueberry-bubble-tea.webp",
    sizes: [{ name: "500 ml", price: 1590 }]
  },
  {
    id: "bubble-toxic-matcha",
    name: "Toxic Matcha Bubble Tea",
    category: "Bubble Tea",
    description: "A vivid matcha-inspired drink with tapioca pearls.",
    image: "images/toxic-matcha-bubble-tea.jpg",
    sizes: [{ name: "500 ml", price: 1590 }]
  },
  {
    id: "bubble-blue-matcha",
    name: "BlueMatcha Bubble Tea",
    category: "Bubble Tea",
    description: "A colourful blue matcha-inspired bubble tea.",
    image: "images/blue-matcha-bubble-tea.jpg",
    sizes: [{ name: "500 ml", price: 1590 }]
  },
  {
    id: "bubble-sakura",
    name: "Sakura Bubble Tea",
    category: "Bubble Tea",
    description: "A delicate floral-inspired drink with tapioca pearls.",
    image: "images/sakura-bubble-tea.webp",
    sizes: [{ name: "500 ml", price: 1590 }]
  },

  {
    id: "bumble-orange",
    name: "Orange Bumble",
    category: "Bumbles",
    description: "A bright citrus coffee drink inspired by fresh orange.",
    image: "images/orange-bubble-tea.jpg",
    sizes: [{ name: "500 ml", price: 1200 }]
  },
  {
    id: "bumble-cherry",
    name: "Cherry Bumble",
    category: "Bumbles",
    description: "A fruity coffee drink with cherry-inspired flavour.",
    image: "images/bumble-cherry.webp",
    sizes: [{ name: "500 ml", price: 1200 }]
  },
  {
    id: "bumble-peach",
    name: "Peach Bumble",
    category: "Bumbles",
    description: "A refreshing coffee and peach-inspired combination.",
    image: "images/bumble-peach.jpg",
    sizes: [{ name: "500 ml", price: 1200 }]
  },
  {
    id: "bumble-apple",
    name: "Apple Bumble",
    category: "Bumbles",
    description: "A crisp apple-inspired citrus coffee drink.",
    image: "images/apple-bumble.webp",
    sizes: [{ name: "500 ml", price: 1200 }]
  },

  {
    id: "tea-sea-buckthorn",
    name: "Sea Buckthorn Tea",
    category: "Tea",
    description: "A warming fruit tea with sea buckthorn flavour.",
    image: "images/sea-buckthorn-tea.jpg",
    sizes: [{ name: "450 ml", price: 700 }]
  },
  {
    id: "tea-tashkent",
    name: "Tashkent Tea",
    category: "Tea",
    description: "A fragrant tea inspired by traditional Central Asian tea.",
    image: "images/tashkent-tea.jpg",
    sizes: [{ name: "450 ml", price: 700 }]
  },
  {
    id: "tea-moroccan",
    name: "Moroccan Tea",
    category: "Tea",
    description: "A refreshing mint-inspired tea with a fragrant aroma.",
    image: "images/moroccan-tea.jpg",
    sizes: [{ name: "450 ml", price: 700 }]
  },
  {
    id: "tea-mango-passion",
    name: "Mango Passion Fruit Tea",
    category: "Tea",
    description: "A tropical tea inspired by mango and passion fruit.",
    image: "images/mango-passion-fruit-tea.jpg",
    sizes: [{ name: "450 ml", price: 700 }]
  },
  {
    id: "tea-berry-fruit",
    name: "Berry-Fruit Tea",
    category: "Tea",
    description: "A fruity blend inspired by mixed berries.",
    image: "images/berry-fruit-tea.jpg",
    sizes: [{ name: "450 ml", price: 700 }]
  },
  {
    id: "tea-thousand-nights",
    name: "A Thousand and One Nights",
    category: "Tea",
    description: "An aromatic tea blend for a calm study break.",
    image: "images/a-thousand-and-one-nights.jpg",
    sizes: [{ name: "450 ml", price: 700 }]
  },
  {
    id: "tea-mulled",
    name: "Mulled Tea",
    category: "Tea",
    description: "A warming spiced tea inspired by winter flavours.",
    image: "images/mulled-tea.jpg",
    sizes: [{ name: "450 ml", price: 950 }]
  },
  {
    id: "tea-masala",
    name: "Masala Tea",
    category: "Tea",
    description: "A fragrant spiced tea inspired by traditional masala chai.",
    image: "images/masala-tea.jpg",
    sizes: [{ name: "350 ml", price: 1000 }]
  },
  {
    id: "tea-karak",
    name: "Karak Chai",
    category: "Tea",
    description: "A rich, milky tea inspired by classic karak chai.",
    image: "images/karak-chai.jpg",
    sizes: [{ name: "350 ml", price: 1000 }]
  },
  {
    id: "iced-peach",
    name: "Peach Iced Tea",
    category: "Tea",
    description: "Chilled tea with a light peach-inspired flavour.",
    image: "images/peach-iced-tea.jpg",
    sizes: [{ name: "500 ml", price: 900 }]
  },
  {
    id: "iced-pomegranate",
    name: "Pomegranate Iced Tea",
    category: "Tea",
    description: "A refreshing iced tea inspired by pomegranate.",
    image: "images/pomegranate-iced-tea.jpg",
    sizes: [{ name: "500 ml", price: 900 }]
  },
  {
    id: "iced-lemon",
    name: "Lemon Iced Tea",
    category: "Tea",
    description: "Chilled tea with a bright lemon-inspired finish.",
    image: "images/lemon-iced-tea.jpg",
    sizes: [{ name: "500 ml", price: 900 }]
  },
  {
    id: "iced-raspberry",
    name: "Raspberry Iced Tea",
    category: "Tea",
    description: "Refreshing iced tea with a raspberry-inspired flavour.",
    image: "images/raspberry-iced-tea.jpg",
    sizes: [{ name: "500 ml", price: 900 }]
  }
];

const state = {
  category: "All",
  search: "",
  selectedProduct: null,
  selectedSizeIndex: 0,
  basket: loadJSON("coffeelake-basket", []),
  loyalty: loadJSON("coffeelake-loyalty", { stamps: 0 }),
  latestOrder: loadJSON("coffeelake-latest-order", null)
};

const $ = (selector) => document.querySelector(selector);


const clickSound = new Audio("sounds/click.mp3");
const addToCartSound = new Audio("sounds/add-to-cart.mp3");

function playSound(audio) {
  audio.currentTime = 0;
  audio.play().catch((error) => {
    console.warn("Sound playback was blocked:", error);
  });
}


function loadJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast("Unable to save data in this browser.");
  }
}

function money(amount) {
  return `${Number(amount).toLocaleString("en-US")} ₸`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function getItemPrice(item) {
  return item.unitPrice + (item.syrup !== "None" ? 150 : 0);
}

function getBasketTotal() {
  return state.basket.reduce(
    (total, item) => total + getItemPrice(item) * item.quantity,
    0
  );
}

function getBasketCount() {
  return state.basket.reduce((total, item) => total + item.quantity, 0);
}

function renderMenu() {
  const grid = $("#product-grid");

  const filtered = products.filter((product) => {
    const categoryMatches =
      state.category === "All" || product.category === state.category;

    const searchText =
      `${product.name} ${product.description} ${product.category}`.toLowerCase();

    return categoryMatches && searchText.includes(state.search.toLowerCase());
  });

  $("#results-count").textContent = `${filtered.length} drinks`;
  grid.innerHTML = "";

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>No drinks found</h3>
        <p>Try a different name or category.</p>
      </div>`;
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
        >
        <span class="product-category">${escapeHTML(product.category)}</span>
      </div>
      <div class="product-info">
        <h3>${escapeHTML(product.name)}</h3>
        <p class="product-description">${escapeHTML(product.description)}</p>
        <div class="product-bottom">
          <span class="product-price">
            ${money(Math.min(...product.sizes.map((size) => size.price)))}
            <small>${product.sizes.length > 1 ? "Starting price" : escapeHTML(product.sizes[0].name)}</small>
          </span>
          <button class="add-button" type="button" aria-label="Choose ${escapeHTML(product.name)}" data-product="${escapeHTML(product.id)}">+</button>
        </div>
      </div>`;

    const image = card.querySelector("img");
    image.addEventListener("error", () => {
      image.src = "https://placehold.co/800x600/e7eee3/284b38?text=Coffee+Lake";
    }, { once: true });

    card.querySelector(".add-button").addEventListener("click", () => {
      openProduct(product.id);
    });

    grid.appendChild(card);
  });
}

function openProduct(productId) {
  const product = getProduct(productId);
  if (!product) return;

  state.selectedProduct = product;
  state.selectedSizeIndex = 0;

  $("#modal-product-image").src = product.image;
  $("#modal-product-image").alt = product.name;
  $("#modal-product-category").textContent = product.category;
  $("#product-modal-title").textContent = product.name;
  $("#modal-product-description").textContent = product.description;

  const sizeSelect = $("#drink-size");
  sizeSelect.innerHTML = product.sizes.map((size, index) => `
    <option value="${index}">${escapeHTML(size.name)} — ${money(size.price)}</option>
  `).join("");

  $("#drink-sugar").value = "Normal";
  $("#drink-syrup").value = "None";

  updateModalPrice();
  $("#product-modal").hidden = false;
  document.body.classList.add("panel-open");
}

function updateModalPrice() {
  const product = state.selectedProduct;
  if (!product) return;

  const size = product.sizes[state.selectedSizeIndex];
  const syrupExtra = $("#drink-syrup").value !== "None" ? 150 : 0;

  $("#modal-price").textContent = money(size.price + syrupExtra);
}

function addConfiguredDrink() {
  const product = state.selectedProduct;
  if (!product) return;

  const size = product.sizes[state.selectedSizeIndex];
  const sugar = $("#drink-sugar").value;
  const syrup = $("#drink-syrup").value;

  const existing = state.basket.find((item) =>
    item.productId === product.id &&
    item.size === size.name &&
    item.sugar === sugar &&
    item.syrup === syrup
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    state.basket.push({
      lineId: `${product.id}-${size.name}-${sugar}-${syrup}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      size: size.name,
      sugar,
      syrup,
      unitPrice: size.price,
      quantity: 1
    });
  }

  
  saveJSON("coffeelake-basket", state.basket);
  renderBasket();
  closeModal($("#product-modal"));
  playSound(addToCartSound);
  showToast(`${product.name} added to your basket.`);

}

function renderBasket() {
  const container = $("#basket-items");
  $("#basket-count").textContent = getBasketCount();
  $("#basket-total").textContent = money(getBasketTotal());
  $("#checkout-total").textContent = money(getBasketTotal());
  $("#checkout-button").disabled = state.basket.length === 0;

  if (!state.basket.length) {
    container.innerHTML = `<div class="empty-basket">Your basket is empty.<br>Find something you love on the menu.</div>`;
    return;
  }

  container.innerHTML = state.basket.map((item) => `
    <div class="basket-item">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">
      <div>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${escapeHTML(item.size)} · Sugar ${escapeHTML(item.sugar)}</p>
        <p>${item.syrup !== "None" ? `${escapeHTML(item.syrup)} syrup` : "No extra syrup"}</p>
        <div class="quantity-controls">
          <button type="button" data-action="decrease" data-line="${escapeHTML(item.lineId)}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="increase" data-line="${escapeHTML(item.lineId)}" aria-label="Increase quantity">+</button>
          <button type="button" data-action="remove" data-line="${escapeHTML(item.lineId)}" aria-label="Remove item">×</button>
        </div>
      </div>
      <div class="basket-item-price">${money(getItemPrice(item) * item.quantity)}</div>
    </div>
  `).join("");

  container.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      changeQuantity(button.dataset.line, button.dataset.action);
    });
  });

  container.querySelectorAll(".basket-item img").forEach((image) => {
    image.addEventListener("error", () => {
      image.src = "https://placehold.co/160x160/e7eee3/284b38?text=Drink";
    }, { once: true });
  });
}

function changeQuantity(lineId, action) {
  const item = state.basket.find((entry) => entry.lineId === lineId);
  if (!item) return;

  if (action === "increase") item.quantity += 1;
  if (action === "decrease") item.quantity -= 1;
  if (action === "remove" || item.quantity <= 0) {
    state.basket = state.basket.filter((entry) => entry.lineId !== lineId);
  }

  saveJSON("coffeelake-basket", state.basket);
  renderBasket();
}

function openBasket() {
  $("#basket-panel").classList.add("open");
  $("#basket-panel").setAttribute("aria-hidden", "false");
  $("#overlay").hidden = false;
  document.body.classList.add("panel-open");
}

function closeBasket() {
  $("#basket-panel").classList.remove("open");
  $("#basket-panel").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;

  if ($("#product-modal").hidden && $("#checkout-modal").hidden) {
    document.body.classList.remove("panel-open");
  }
}

function closeModal(modal) {
  modal.hidden = true;

  if ($("#product-modal").hidden && $("#checkout-modal").hidden && !$("#basket-panel").classList.contains("open")) {
    document.body.classList.remove("panel-open");
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
}

function renderLoyalty() {
  const stamps = Math.max(0, Math.min(7, Number(state.loyalty.stamps) || 0));

  $("#stamp-row").innerHTML = Array.from({ length: 7 }, (_, index) => `
    <span class="stamp ${index < stamps ? "filled" : ""}">${index < stamps ? "✓" : "·"}</span>
  `).join("");

  $("#loyalty-text").textContent =
    stamps >= 7 ? "Your free drink is ready!" : `${stamps} of 7 drinks collected`;
}

function renderLatestOrder() {
  const container = $("#order-status-card");
  const order = state.latestOrder;

  if (!order) {
    container.innerHTML = `
      <div class="empty-order-icon">↗</div>
      <div><strong>No recent order</strong><p>Your order status will appear here after checkout.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="empty-order-icon">✓</div>
    <div>
      <strong>Order ${escapeHTML(order.number)}</strong>
      <p>${escapeHTML(order.name)} · Pickup: ${escapeHTML(order.pickupTime)}</p>
      <p>${order.items.length} drink(s) · ${money(order.total)}</p>
      <span class="order-status-pill">${escapeHTML(order.status)}</span>
    </div>`;
}

function openCheckout() {
  if (!state.basket.length) {
    showToast("Your basket is empty.");
    return;
  }

  closeBasket();
  $("#checkout-total").textContent = money(getBasketTotal());
  $("#checkout-modal").hidden = false;
  document.body.classList.add("panel-open");
}

function createOrderNumber() {
  return `CL-${Date.now().toString().slice(-8)}`;
}


async function placeOrder(event) {
  event.preventDefault();

  if (!state.basket.length) {
    showToast("Add a drink before placing your order.");
    closeModal($("#checkout-modal"));
    return;
  }

  const name = $("#customer-name").value.trim();
  const phone = $("#customer-phone").value.trim();
  const pickupTime = $("#pickup-time").value;
  const paymentMethod = $("#payment-method").value;

  if (!name) {
    $("#customer-name").focus();
    return;
  }

  if (!phone) {
    $("#customer-phone").focus();
    return;
  }

  
const orderItems = state.basket.map((item) => ({
  productId: item.productId,
  name: item.name,
  size: item.size,
  sugar: item.sugar,
  syrup: item.syrup,
  quantity: item.quantity,
  price: item.unitPrice
}));


  const submitButton = $("#checkout-form").querySelector(
    'button[type="submit"]'
  );

  if (submitButton) {
    submitButton.disabled = true;
  }

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone,
        pickupTime,
        paymentMethod,
        items: orderItems
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.error || "The order could not be saved."
      );
    }

    const order = {
      number: result.orderNumber,
      name,
      phone,
      pickupTime,
      paymentMethod,
      items: state.basket.map((item) => ({ ...item })),
      total: Number(result.total),
      status: result.status || "Received",
      createdAt: new Date().toISOString()
    };

    state.latestOrder = order;
    saveJSON("coffeelake-latest-order", order);

    const drinkCount = getBasketCount();
    state.loyalty.stamps =
      (Number(state.loyalty.stamps) + drinkCount) % 7;

    saveJSON("coffeelake-loyalty", state.loyalty);

    state.basket = [];
    saveJSON("coffeelake-basket", state.basket);

    renderBasket();
    renderLoyalty();
    renderLatestOrder();
    closeModal($("#checkout-modal"));
    $("#checkout-form").reset();

    showToast(`Order ${order.number} placed successfully!`);
    $("#orders").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Order submission failed:", error);

    showToast(
      error.message || "Could not place your order. Please try again."
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}


function initialize() {
  $("#current-year").textContent = new Date().getFullYear();

  $("#category-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    state.category = button.dataset.category;

    document.querySelectorAll(".category-button").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderMenu();
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button || button.id === "add-to-basket") return;

    if (typeof playSound === "function" &&
      typeof clickSound !== "undefined") {
      playSound(clickSound);
    }
  });

  $("#search-input").addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    renderMenu();
  });

  $("#drink-size").addEventListener("change", (event) => {
    state.selectedSizeIndex = Number(event.target.value);
    updateModalPrice();
  });

  $("#drink-syrup").addEventListener("change", updateModalPrice);
  $("#add-to-basket").addEventListener("click", addConfiguredDrink);

  $("#basket-button").addEventListener("click", openBasket);
  $("#close-basket").addEventListener("click", closeBasket);
  $("#overlay").addEventListener("click", closeBasket);
  $("#checkout-button").addEventListener("click", openCheckout);
  $("#checkout-form").addEventListener("submit", placeOrder);

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.closest(".modal"));
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeBasket();
    document.querySelectorAll(".modal:not([hidden])").forEach(closeModal);
  });

  renderMenu();
  renderBasket();
  renderLoyalty();
  renderLatestOrder();
}

initialize();
