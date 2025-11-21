import pandas as pd
# this is a stand in connector for the health api in an actual implementation it would connect to your fitness, menstration and calorie traciking app to get the data

# this should return a json
def csvHealthConnector():
    health_df = pd.read_csv("synthetic_data_10_000/health_data_10000_365.csv")
    health_df.drop(columns=["timestamp", "migraine", "timestamp_dt", "person_id"], inplace=True, errors="ignore")

    random_row = health_df.sample(n=1, random_state = None)

    json_health = random_row.to_json()

    return json_health

