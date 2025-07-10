const gliderContainer = document.querySelector(".glider-contain");
const filterForm = document.getElementById("filter-form");
let gliderInstance = null;

// Create and return a new glider element after removing the old one
function createGliderElement() {
  const oldGlider = document.querySelector(".glider");
  if (oldGlider) oldGlider.remove();

  const newGlider = document.createElement("div");
  newGlider.className = "glider";
  newGlider.id = "product-list";

  const nextBtn = document.querySelector(".glider-next");
  gliderContainer.insertBefore(newGlider, nextBtn);

  return newGlider;
}

// Render product cards and initialize Glider
function renderProducts(data) {
  const gliderElement = createGliderElement();

  data.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    let currentColor = "yellow";

    // Product image
    const img = document.createElement("img");
    img.src = product.images[currentColor];
    img.alt = product.name;

    // Product name
    const title = document.createElement("h3");
    title.textContent = product.name;

    // Product price
    const price = document.createElement("p");
    price.textContent = `$${product.priceUSD} USD`;

    // Color switch buttons
    const colorButtons = document.createElement("div");
    colorButtons.className = "color-buttons";

    const colorLabel = document.createElement("p");
    colorLabel.className = "color-label";
    colorLabel.textContent = "Yellow Gold";

    ["yellow", "white", "rose"].forEach((color) => {
      const btn = document.createElement("button");
      btn.style.backgroundColor =
        color === "yellow" ? "#E6CA97" :
        color === "rose" ? "#E1A4A9" :
        "#D9D9D9";
      btn.onclick = () => {
        img.src = product.images[color];
        colorLabel.textContent =
          color === "yellow" ? "Yellow Gold" :
          color === "rose" ? "Rose Gold" :
          "White Gold";
      };
      colorButtons.appendChild(btn);
    });

    // Star rating and score 
    const popularity = document.createElement("div");
    popularity.className = "popularity";

    const stars = document.createElement("div");
    stars.className = "stars";

    let scoreValue = product.popularityScore;
    if (scoreValue <= 1) scoreValue *= 5; // normalize to 5-star scale

    const roundedScore = scoreValue.toFixed(1);
    const fullStars = Math.floor(scoreValue);

    for (let i = 0; i < 5; i++) {
      const star = document.createElement("span");
      star.textContent = i < fullStars ? "★" : "☆";
      stars.appendChild(star);
    }

    const score = document.createElement("span");
    score.textContent = ` ${roundedScore}/5`;
    score.style.marginLeft = "6px";

    popularity.appendChild(stars);
    popularity.appendChild(score);

    // Append all elements to the card
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(colorButtons);
    card.appendChild(colorLabel);
    card.appendChild(popularity);

    gliderElement.appendChild(card);
  });

  // Initialize Glider carousel
  gliderInstance = new Glider(gliderElement, {
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable: true,
    dots: "#dots",
    arrows: {
      prev: ".glider-prev",
      next: ".glider-next",
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
}

// Fetch product list from backend (optionally with query parameters)
function fetchProducts(query = "") {
  fetch(`https://web-production-879c6.up.railway.app/products${query}`)
    .then((res) => res.json())
    .then((data) => {
      renderProducts(data);
    });
}

// Load all products when the page is first loaded
fetchProducts();

// Filter form handler
filterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const minPrice = document.getElementById("minPrice").value;
  const maxPrice = document.getElementById("maxPrice").value;
  const minPopularity = document.getElementById("minPopularity").value;

  let query = "?";
  if (minPrice) query += `min_price=${minPrice}&`;
  if (maxPrice) query += `max_price=${maxPrice}&`;
  if (minPopularity) query += `min_popularity=${minPopularity}&`;

  fetchProducts(query);
});
