from catboost import CatBoostRegressor
def demo_regressor(model_path: str, test_csv: str):
    # Load test data
    test_df = pd.read_csv(test_csv)
    
    # Load model
    model = CatBoostRegressor()
    model.load_model(model_path, format="cbm")
    
    # Assume the target column is 'migraine_probability' and drop it
    X_test = test_df.drop(columns=["migraine_probability"], errors="ignore")
    
    # Predict
    predictions = model.predict(X_test)
    
    # Print predictions as percentages
    for i, pred in enumerate(predictions):
        print(f"Row {i} -> Migraine Probability: {int(pred * 100)}%")