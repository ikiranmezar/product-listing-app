# 💍 Jewelry Product Carousel Web App

This is a full-stack web application that displays a scrollable carousel of jewelry products (e.g., rings) fetched from a local JSON file and dynamically priced based on real-time gold prices. It includes filtering options, responsive layout, and a polished user interface.

## 🚀 Features

* Real-time gold price fetching from a public API
* Products priced dynamically using weight and popularity
* Filtering by price range and popularity (1–5 scale)
* Scrollable carousel with Glider.js (arrows and drag support)
* Color switcher for gold types (Yellow, White, Rose)
* Responsive design with Montserrat font and modern styling

## 🗂️ Project Structure

```
project/
├── static/
│   ├── index.html        # Main HTML page
│   ├── style.css         # CSS styling
│   ├── script.js         # Frontend logic
│   └── products.json     # Local product data (images, weight, popularity)
├── app.py                # Flask backend
└── README.md             # Project documentation
```

## ⚙️ Installation

### Prerequisites:

* Python 3
* pip

### 1. Install dependencies

```bash
pip install flask flask-cors requests
```

### 2. Run the backend server

```bash
python app.py
```

Server will be available at: [http://127.0.0.1:5000](http://127.0.0.1:5000)

## 🌐 Usage

* Open `http://127.0.0.1:5000` in your browser.
* Scroll through the carousel to see all products.
* Use the filter form at the top to filter by price and popularity.
* Click color buttons under each product image to view it in Yellow, White, or Rose gold.

## 📡 API Details

### Endpoint: `/products`

Supports optional query parameters:

* `min_price` (float)
* `max_price` (float)
* `min_popularity` (float, 1–5 scale)

**Example**:

```bash
GET /products?min_price=150&max_price=600&min_popularity=3.5
```

## 📊 Gold Pricing Logic

Each product's price is calculated as:

```
price = (popularityScore + 1) * weight * goldPriceUSDPerGram
```

Gold price is fetched from:

> [https://api.metals.live/v1/spot](https://api.metals.live/v1/spot)

If API fails, fallback value `65.0` USD/gram is used.

## 🖼️ Notes

* Images must be correctly mapped in `products.json` under the `images` object with keys: `yellow`, `white`, `rose`.
* If you want to test with your own images, place them in `static/img/` and update `products.json` accordingly.

## 📱 Responsive

The layout adapts for mobile and tablet screens. Glider.js enables both drag and arrow navigation.

## 📄 License

This project is for educational/demo purposes only. No commercial rights implied.
