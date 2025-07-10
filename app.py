from flask import Flask, jsonify, request, send_from_directory  # type: ignore
from flask_cors import CORS
import json
import requests

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

# Gold price API source (real-time)
GOLD_API_URL = "https://api.metals.live/v1/spot"

def get_gold_price():
    """
    Fetches the price of gold per ounce from an external API
    and converts it to price per gram in USD.
    If the API fails, returns a fallback value (65.0 USD/gram).
    """
    try:
        response = requests.get(GOLD_API_URL)
        data = response.json()
        gold_price_per_ounce = data[0]['gold']
        gold_price_per_gram = gold_price_per_ounce / 31.1035
        return gold_price_per_gram
    except Exception as e:
        print("Gold price API error:", e)
        return 65.0  # fallback value

@app.route("/")
def index():
    """
    Serves the main HTML page (static/index.html).
    """
    return send_from_directory("static", "index.html")

@app.route("/products", methods=["GET"])
def get_products():
    """
    Returns a list of products.
    Optional query parameters for filtering:
    - min_price: minimum price (USD)
    - max_price: maximum price (USD)
    - min_popularity: minimum popularity score (1–5 scale)
    """
    with open("products.json", "r") as f:
        products = json.load(f)

    gold_price = get_gold_price()

    # Read query parameters
    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)
    min_popularity = request.args.get("min_popularity", type=float)

    result = []

    for p in products:
        # Price is calculated based on popularity and weight
        price = (p["popularityScore"] + 1) * p["weight"] * gold_price
        popularity_score_5 = round(p["popularityScore"] * 5, 1)

        # Apply filters if provided
        if min_price is not None and price < min_price:
            continue
        if max_price is not None and price > max_price:
            continue
        if min_popularity is not None and popularity_score_5 < min_popularity:
            continue

        result.append({
            "name": p["name"],
            "images": p["images"],
            "weight": p["weight"],
            "popularityScore": popularity_score_5,
            "priceUSD": round(price, 2)
        })

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
