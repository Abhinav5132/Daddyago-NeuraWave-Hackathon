import numpy as np
from catboost import CatBoostRegressor
import pandas as pd
import matplotlib


# Returns processed data by matching the person and their migrain data. Returns only the data points required.
def preprocess_data(dataset_health: str, dataset_person: str) -> pd.DataFrame:
    data_health = pd.read_csv(dataset_health)
    data_health.drop(columns=["timestamp", "migraine"])

    data_person = pd.read_csv(dataset_person)
    data_person.drop(columns=["birthdate", "last_delivery_date", "first_menstruation"])

    merged = pd.merge(data_health, data_person, on="person_id", how="inner")

    merged.drop("person_id")

    return merged


def train_model(processed_dataset: pd.DataFrame, iterations: int, learning_rate, depth, l2_leaf_reg) -> CatBoostRegressor:
    label1 = "migraine_probability"
    X_train = processed_dataset.drop(columns=[label1])
    Y_train = processed_dataset[label1]

    model = CatBoostRegressor(
        iterations = iterations, 
        learning_rate = learning_rate, 
        depth = depth,
        l2_leaf_reg = l2_leaf_reg,
        verbose=False,
    )

    model.fit(X_train, Y_train)

    return model
# tests multiple diffrent hyperparametes for the model
def test_hyperparameters() -> pd.DataFrame:
    data = preprocess_data("synthetic_data_100_000/health_data_100000_365.csv", "synthetic_data_100_000/person_data_100000.csv")
    test_data = preprocess_data("synthetic_data_10_000/health_data_10000_365.csv", "synthetic_data_10_000/person_data_10000.csv")
    X_val = test_data.drop(columns=["migraine_probability"])
    Y_val = test_data["migraine_probability"]

    results = []

    for iteration in range(300, 1500, 200):
        for learn_rate in range(10, 1000, 10):
            learn_rate = learn_rate / 1000
            for depth in range (3, 11, 1):
                for l2_leaf_reg in range(1, 20, 1):
                    model = train_model(data, iteration,learn_rate,depth,l2_leaf_reg)
                    score = model.score(X_val, Y_val) 

                    results.append({
                        "iterations": iteration,
                        "learning_rate": learn_rate,
                        "depth": depth,
                        "l2_leaf_reg": l2_leaf_reg,
                        "score": score
                    })

    results_df = pd.DataFrame(results)
    results_df.sort_values("score", ascending=False)
    print("Best parameters:")
    print(results_df.iloc[0])

    return results_df

def main():
    data = preprocess_data("synthetic_data_100_000/health_data_100000_365.csv", "synthetic_data_100_000/person_data_100000.csv")

    results_df = test_hyperparameters()
    hyperparameters = results_df.iloc[0]

    # now train a model again with those values and test for overfitting and breakdown of how its factors
    model = train_model(data, iterations=hyperparameters["iterations"], learning_rate=hyperparameters["learning_rate"], depth=hyperparameters["depth"],l2_leaf_reg=hyperparameters["l2_leaf_reg"])
    model.save_model("migrain_probability.cbm") # saving the model


