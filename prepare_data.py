import pandas as pd
import geopandas as gpd

geo = gpd.read_file("data/NeighborhoodMap.geojson")

df = pd.read_csv("data/NeighborhoodHousingCosts.csv")

print("GeoJSON columns:", geo.columns.tolist())
print("CSV columns:", df.columns.tolist())

df = df[df["City"].str.lower() == "seattle"]

df.rename(columns={"RegionName": "neighborhood"}, inplace=True)
geo.rename(columns={"S_HOOD": "neighborhood"}, inplace=True)

date_columns = [c for c in df.columns if "/" in c] 
keep_cols = ["neighborhood"] + date_columns
df = df[keep_cols]

merged = geo.merge(df, on="neighborhood", how="inner")

merged.to_file("data/seattle_housing_prices.geojson", driver="GeoJSON")

print(f"✅ Created GeoJSON with {len(merged)} neighborhoods and {len(date_columns)} months of data.")
