#!/usr/bin/env python
# coding: utf-8

import plotly
import matplotlib_venn
# import packages
import re
import sklearn
import warnings
import math
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib
import plotly.graph_objs as go
import plotly.offline as py
import plotly.tools as tls
from matplotlib_venn import venn2
from sklearn.decomposition import PCA, FactorAnalysis
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import plotly.io as pio



def factor(df):

    # import settings
    # get_ipython().run_line_magic('matplotlib', 'inline')
    matplotlib.rcParams.update({'font.size': 12})
    # py.init_notebook_mode(connected=True)
    warnings.filterwarnings('ignore')

    print('notebook_mode')
    # read in data
    # df = pd.read_csv("Life_data_full_cleaned_dataset.csv", encoding='ISO-8859-1')
    # df = pd.read_csv("Life_data_full_cleaned_dataset.csv", encoding='ISO-8859-1')

    # set up fields
    pop_data = ['pop', 'male_pop', 'female_pop',
                'male_age_median', 'female_age_median']
    marital_status = ['married', 'separated', 'divorced', 'single']
    real_data = ['AWater', 'ALand']

    # create corrilation plot
    dat = df[pop_data+real_data+marital_status].dropna()

    # Standardize features by removing the mean and scaling to unit variance
    x = StandardScaler().fit_transform(
        dat[pop_data+real_data+marital_status].values)

    # perform factor analysis
    FA = FactorAnalysis(n_components=2).fit(x)

    # obtain covariance matrix:
    loadings = np.matrix(FA.components_)  # loading est.
    diag_psi = np.matrix(np.diag(FA.noise_variance_))  # diagonal psi
    cov = loadings.T * loadings + diag_psi

    print('getting cov')
    # transfomed data and join to our main df:
    dat['latent_1'] = FA.transform(
        dat[pop_data+real_data+marital_status].values).T[0]
    dat['latent_2'] = FA.transform(
        dat[pop_data+real_data+marital_status].values).T[1]
    df = df.join(dat[['latent_1', 'latent_2']])


    # look up dictionary for display names
    flds = {'pop': 'Population', 'male_pop': 'Male Population', 'female_pop': 'Female Population',
            'male_age_median': 'Male Age Median', 'female_age_median': 'Female Age Median',
            'married': 'Married', 'divorced': 'Divorced', 'separated': 'Separated', 'single': 'Single',
            'AWater': 'Amount of Water by State', 'ALand': 'Amount of Land by State'}

    # Plot constants
    C1 = 'rgba(44, 62, 80, 1)'
    C2 = 'rgba(44, 62, 80, .2)'
    MAX = 300
    trace = []
    shapes = []

    # create original shape
    shapes.append({'type': 'circle', 'layer': 'below', 'xref': 'x', 'yref': 'y',
                'x0': -1, 'y0': -1, 'x1': 1, 'y1': 1, 'fillcolor': 'rgba(44, 62, 80, .35)',
                'line': {'color': 'rgba(0, 0, 0,0)'}})


    for i in range(MAX):
        shapes.append({'type': 'circle', 'layer': 'below', 'xref': 'x', 'yref': 'y',
                    'x0': -i**3/MAX**3, 'y0': -i**3/MAX**3, 'x1': i**3/MAX**3,
                    'y1': i**3/MAX**3, 'fillcolor': 'rgba(250,250,250, .1)',
                    'line': {'color': 'rgba(0, 0, 0,0)'}})

    for i in range(loadings.shape[1]):
        col_name = flds[list(dat.columns.values)[i]]
        trace.append(go.Scatter(x=[0, loadings[0, i]],
                                y=[0, loadings[1, i]],
                                line={'width': 3},
                                marker=dict(size=8),
                                name=col_name))

    layout = go.Layout(shapes=shapes, width=700, height=700,
                    margin=go.Margin(l=50, r=50, b=100, t=100, pad=4),
                    xaxis=dict(zerolinecolor=C2, gridcolor=C2, range=[-1.25, 1.25],
                                color=C1, title='<b>Latent Factor<sub>1</sub><b>'),
                    yaxis=dict(zerolinecolor=C2, gridcolor=C2, range=[-1.25, 1.25],
                                color=C1, title='<b>Latent Factor<sub>2</sub><b>'),
                    font=dict(family='Open Sans', size=14),
                    title='<b>Factor Analysis: LF<sub>1</sub> & LF<sub>2</sub></b>')

    fig = go.Figure(data=trace, layout=layout)
    # py.iplot(fig, filename='basic-line',
    #         config={'displayModeBar': False, 'showLink': False,
    #                 'shape': {'layer': 'below', 'hoverinfo': 'none'}})


    print('generating image')
    static_image_bytes = pio.to_image(fig, format='png')


    return (static_image_bytes)

    
