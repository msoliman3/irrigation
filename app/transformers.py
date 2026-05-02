import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import OneHotEncoder

class FeatureEncoder(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        self.encoders_ = {}
        self.column_names_ = {}
        for col in X.select_dtypes(include="object").columns:
            enc = OneHotEncoder(sparse_output=False)
            enc.fit(X[[col]])
            self.encoders_[col] = enc
            self.column_names_[col] = enc.categories_[0]
        return self

    def transform(self, X: pd.DataFrame, y=None):
        X = X.copy()
        for col, enc in self.encoders_.items():
            matrix = enc.transform(X[[col]])
            for i, name in enumerate(self.column_names_[col]):
                X[name] = matrix[:, i]
        return X

class FeatureDropper(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X: pd.DataFrame):
        dropped_cols = list(X.select_dtypes(include="object").columns)
        return X.drop(dropped_cols, axis=1, errors="ignore")