import numpy as np
from catboost import CatBoostRegressor
import pandas as pd
import matplotlib


# Returns processed data by matching the person and their migrain data. Returns only the data points required.
def preprocess_data(dataset: str) -> pd.DataFrame:
    #TODO remove unrequired rows from the dataset
    return pd.read_csv(dataset)

def train_model(processed_dataset: pd.DataFrame, iterations: int, learning_rate, depth, l2_leaf_reg) -> CatBoostRegressor:
    label1 = "migraine_probability"
    label2 = "migraine"
    X_train = processed_dataset.drop(columns=[label1, label2])
    Y_train = processed_dataset[label1, label2]

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
    data = preprocess_data("synthetic_data_100_000/health_data_100000_365.csv")

    results = []

    for iteration in range(300, 1500, 200):
        for learn_rate in range(10, 100, 10):
            learn_rate = learn_rate / 1000
            for depth in range (3, 11, 1):
                for l2_leaf_reg in range(1, 20, 1):
                    model = train_model(data, iteration,learn_rate,depth,l2_leaf_reg)
                    score = model.score(X_val, Y_val) # TODO

                    results.append({
                        "iterations": iteration,
                        "learning_rate": learn_rate,
                        "depth": depth,
                        "l2_leaf_regg": l2_leaf_reg,
                        "score": score
                    })

    return pd.DataFrame(results)
