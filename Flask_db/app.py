import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask import send_file

# import functions
#import factor_analysis

app = Flask(__name__)


#################################################
# Database Setup
#################################################

#app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/Raw_life_census_data.db"
engine = create_engine("sqlite:///Flask_db/Raw_life_census_data.db")

import json

@app.route("/")
def index():
    """Return the homepage."""
    #Make another change
    import os
    return render_template("index.html", os=os)


@app.route("/choropleth")
def chrplth():
    """Return aster plot aggregrated data."""
    
    agg_life_data_df = pd.read_sql_query('SELECT * FROM agg_aster', engine)

    # print(agg_life_data_df)
    return jsonify(agg_life_data_df.to_dict('records'))
    # return jsonify(json.loads(agg_life_data_df.to_json()))# jsonify(agg_life_data_df.to_json())


@app.route("/cluster")
def clstr():
    """Return the cleaned life dataset."""

    life_data_cleaned_df = pd.read_sql_query('SELECT * FROM cleaned', engine)

    # print(life_data_cleaned_df)
    return jsonify(life_data_cleaned_df.to_dict('records'))


@app.route("/aster_plot")
def aster_plot():
    """Return aster plot aggregrated data."""

    agg_life_data_df = pd.read_sql_query('SELECT * FROM agg_aster', engine)

    return jsonify(agg_life_data_df.to_dict('records'))


# @app.route("/factor")
# def FA():
#     """Return the cleaned life dataset."""

#     life_data_cleaned_df = pd.read_sql_query('SELECT * FROM cleaned', engine)
#     static_image_bytes = factor_analysis.factor(life_data_cleaned_df)

#     response = send_file(static_image_bytes,
#                          attachment_filename='logo.png',
#                          mimetype='image/png')
#     # response.headers.set('Content-Type', 'image/jpeg')
#     # response.headers.set(
#     #     'Content-Disposition', 'attachment', filename='%s.jpg' % pid)
#     return response


if __name__ == "__main__":
    app.run()
