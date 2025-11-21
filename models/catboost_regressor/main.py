import numpy as np
from catboost import CatBoostRegressor
import pandas as pd
import matplotlib
import shap
import random

# Returns processed data by matching the person and their migrain data. Returns only the data points required.
def preprocess_data(dataset_health: str, dataset_person: str) -> pd.DataFrame:
    print("Preprocessing....")
    data_health = pd.read_csv(dataset_health)
    data_health.drop(columns=["timestamp", "migraine", "timestamp_dt"], inplace=True, errors="ignore")

    data_person = pd.read_csv(dataset_person)
    data_person.drop(columns=["birthdate", "last_delivery_date", "first_menstruation"], inplace=True, errors="ignore")

    merged = pd.merge(data_health, data_person, on="person_id", how="inner")

    merged.drop(columns=["person_id"], inplace=True, errors="ignore")
    
    return merged


def train_model(X_train, Y_train, iterations: int, learning_rate, depth, l2_leaf_reg) -> CatBoostRegressor:
    print("training....")
    cat_features = ["gender"]
    model = CatBoostRegressor(
        iterations = iterations, 
        learning_rate = learning_rate, 
        depth = depth,
        l2_leaf_reg = l2_leaf_reg,
        verbose=False,
        task_type="GPU",
    )

    model.fit(X_train, Y_train, cat_features=cat_features)

    return model
# tests multiple diffrent hyperparametes for the model
def test_hyperparameters(X_train, Y_train, test_data) -> pd.DataFrame:
    print("testing has begun")
    X_val = test_data.drop(columns=["migraine_probability"])
    Y_val = test_data["migraine_probability"]

    results = []
    
    n_trials = 1
    for _ in range(n_trials):
        iteration = random.choice([300, 500, 700, 900])
        learning_rate = random.uniform(0.01, 0.1)
        depth = random.randint(3, 10)
        l2_leaf_reg = random.randint(1, 15)
        model = train_model(X_train, Y_train,iteration,learning_rate,depth,l2_leaf_reg)
        score = model.score(X_val, Y_val) 

        results.append({
            "iterations": iteration,
            "learning_rate": learning_rate,
            "depth": depth,
            "l2_leaf_reg": l2_leaf_reg,
            "score": score
        })

        print(score)
    
    

    results_df = pd.DataFrame(results)
    results_df = results_df.sort_values("score", ascending=False)
    print("Best parameters:")
    print(results_df.iloc[0])

    return results_df

def main():

    data = preprocess_data("synthetic_data_100_000/health_data_100000_90.csv", "synthetic_data_100_000/person_data_100000.csv")
    test_data = preprocess_data("synthetic_data_10_000/health_data_10000_365.csv", "synthetic_data_10_000/person_data_10000.csv")

    X_train = data.drop(columns=["migraine_probability"])
    Y_train = data["migraine_probability"]

    results_df = test_hyperparameters(X_train, Y_train, test_data)
    hyperparameters = results_df.iloc[0]
    # now train a model again with those values and test for overfitting and breakdown of how its factors
    model = train_model(X_train, Y_train, iterations=hyperparameters["iterations"], learning_rate=hyperparameters["learning_rate"], depth=hyperparameters["depth"],l2_leaf_reg=hyperparameters["l2_leaf_reg"])
    model.save_model("migrain_probability.cbm")

    #model = train_model(X_train, Y_train, iterations=240, learning_rate=0.008, depth=6, l2_leaf_reg=4) best model so far

    explainer = shap.TreeExplainer(model)
    
    X_sample = X_train.sample(10000)
    shap_values = explainer.shap_values(X_sample)

    row_strength = np.abs(shap_values).sum(axis=1)
    important_rows = row_strength.argsort()[::-1]

    for idx in important_rows:  
        print(f"Row {idx}: influence = {row_strength[idx]:.5f}")


if __name__ == "__main__": 
    main()