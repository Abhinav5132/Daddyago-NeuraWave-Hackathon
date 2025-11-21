from catboost import CatBoostRegressor, CatBoostClassifier
import pandas as pd

class RegressorModelConnector():
    model: CatBoostRegressor
    def get_prediction(self, health_val_json, person_val_json):
        h_val = pd.read_json(health_val_json)
        p_val = pd.read_json(person_val_json)

        X_val = pd.merge(h_val, p_val, how="inner")
        self.load_model("migrain_probability.cbm")
        Y_val = self.model.predict(X_val)
        probaility = round(Y_val[0] * 100)

        return probaility

    def load_model(self, location):
        model = CatBoostRegressor()
        model.load_model(location, format="cbm")
        self.model = model


class ClassifierModelConnector():
    model: CatBoostClassifier
    def get_prediction(self, health_val_json, person_val_json):
        h_val = pd.read_json(health_val_json)
        p_val = pd.read_json(person_val_json)
        X_val = pd.merge(h_val, p_val, how="inner")
        
        self.load_model("migrain_type.cbm")
        Y_val = self.model.predict(X_val)
        return Y_val[0]

    def load_model(self, location):
        model = CatBoostClassifier()
        model.load_model(location, format="cbm")
        self.model = model
