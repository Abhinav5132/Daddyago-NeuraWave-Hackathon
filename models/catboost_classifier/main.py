import numpy as np
from catboost import CatBoostClassifier
import pandas as pd
import matplotlib
import shap
import random


def preprocess_data(dataset_health: str):
    print("Preprocessing....")
    data_health = pd.read_csv(dataset_health)
    data_health.drop(columns=["DPF"], inplace=True, errors="ignore")
    
    validation_data = data_health.groupby("Type").apply(lambda x: x.sample(n=5, random_state=42)).reset_index(drop=True)
    
    return data_health, validation_data

def train_model(X_train, Y_train, iterations: int, learning_rate, depth, l2_leaf_reg) -> CatBoostClassifier:
    print("training....")
    model = CatBoostClassifier(
        iterations = iterations, 
        learning_rate = learning_rate, 
        depth = depth,
        l2_leaf_reg = l2_leaf_reg,
        verbose=False,
        task_type="GPU",
    )

    model.fit(X_train, Y_train)

    return model

def test_hyperparameters(X_train, Y_train, test_data) -> pd.DataFrame:
    print("testing has begun")
    X_val = test_data.drop(columns=["Type"])
    Y_val = test_data["Type"]

    results = []
    
    n_trials = 100
    for _ in range(n_trials):
        iteration = random.choice([150, 200, 250, 300, 350, 500])
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
    data, validation_data = preprocess_data("migrain_type_data/migraine_data.csv")

    X_train = data.drop(columns=["Type"])
    Y_train = data["Type"]

    results_df = test_hyperparameters(X_train, Y_train, validation_data)
    hyperparameters = results_df.iloc[0]
    # now train a model again with those values and test for overfitting and breakdown of how its factors
    model = train_model(X_train, Y_train, iterations=hyperparameters["iterations"], learning_rate=hyperparameters["learning_rate"], depth=hyperparameters["depth"],l2_leaf_reg=hyperparameters["l2_leaf_reg"])
    model.save_model("migrain_type.cbm")

if __name__ == "__main__": 
    main()