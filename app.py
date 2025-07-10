from flask import Flask, jsonify, request, send_from_directory  # type: ignore
from flask_cors import CORS
import json
import requests

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

# 🪙 Altın fiyatı API kaynağı
GOLD_API_URL = "https://api.metals.live/v1/spot"

def get_gold_price():
    """
    Altının ons fiyatını alır ve gram cinsinden USD fiyatını döner.
    API çalışmazsa fallback olarak 65.0 USD/gram kullanılır.
    """
    try:
        response = requests.get(GOLD_API_URL)
        data = response.json()
        gold_price_per_ounce = data[0]['gold']
        gold_price_per_gram = gold_price_per_ounce / 31.1035
        return gold_price_per_gram
    except Exception as e:
        print("Gold price API error:", e)
        return 65.0  # fallback

@app.route("/")
def index():
    """
    Ana sayfa (static/index.html) dosyasını döner.
    """
    return send_from_directory("static", "index.html")

@app.route("/products", methods=["GET"])
def get_products():
    """
    Ürün listesini döner. Query parametreleri ile filtreleme yapılabilir:
    - min_price
    - max_price
    - min_popularity
    """
    with open("products.json", "r") as f:
        products = json.load(f)

    gold_price = get_gold_price()

    # Query parametrelerini oku
    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)
    min_popularity = request.args.get("min_popularity", type=float)

    result = []

    for p in products:
        price = (p["popularityScore"] + 1) * p["weight"] * gold_price
        popularity_score_5 = round(p["popularityScore"] * 5, 1)

        # Filtre uygula
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
