from catboost import CatBoostRegressor
import pandas as pd
def demo_regressor(model_path: str, test_df):
    model = CatBoostRegressor()
    model.load_model(model_path, format="cbm")
    
    X_test = test_df.drop(columns=["migraine_probability"], errors="ignore")
    
    predictions = model.predict(X_test)
    
    for i, pred in enumerate(predictions):
        print(f"Row {i} -> Migraine Probability: {int(pred * 100)}%")


data_health = pd.read_csv("synthetic_data_10_000/health_data_10000_365.csv")
data_health.drop(columns=["timestamp", "migraine", "timestamp_dt"], inplace=True, errors="ignore")

data_person = pd.read_csv("synthetic_data_10_000/person_data_10000.csv")
data_person.drop(columns=["birthdate", "last_delivery_date", "first_menstruation"], inplace=True, errors="ignore")

test_df = pd.merge(data_health, data_person)

demo_regressor("migrain_type.cbm", test_df)