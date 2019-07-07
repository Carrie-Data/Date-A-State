import pandas as pd
import statistics


def aster(agg_life_data_df):


    # This is comparing the population
    city_user_input = input('What is your Ideal population group?')

    state = csv_df.loc[['Alaska']]
    state_pop = state['population'][0]

    # Taking user input and giving the string a range
    # for state_pop in states_pop:
    if state_pop > 0 and state_pop <= 1000000:
        pop_bin = 'small'
    elif state_pop > 100000 and state_pop <= 4000000:
        pop_bin = 'medium'
    elif state_pop > 4000000 and state_pop <= 8000000:
        pop_bin = 'large'
    else:
        pop_bin = 'extra_large'
    print(state_pop)
    print(pop_bin)

    # Finding the median of that range so that we can do some math!
    if city_user_input == 'small':
        median_pop_value = statistics.median([0, 1000000])

    elif city_user_input == 'medium':
        median_pop_value = statistics.median([100000, 4000000])

    elif city_user_input == 'large':
        median_pop_value = statistics.median([4000000, 8000000])

    elif city_user_input == 'extra_large':
        median_pop_value = statistics.median([8000000, 20000000])

    print(median_pop_value)

    # Finding the MATCH percentage for population
    if state_pop > median_pop_value:
        pop_match_percentage = (median_pop_value/state_pop)*100
    elif median_pop_value > state_pop:
        pop_match_percentage = (state_pop/median_pop_value)*100

    print(pop_match_percentage)


    # This is comparing the income
    income_user_input = input('What is your Ideal income group?')

    state = csv_df.loc[['Alaska']]
    state_income = state['income'][0]


    # Taking user input and giving the string a range
    # for state_pop in states_pop:
    if state_income > 0 and state_income <= 30000:
        income_bin = 'lower'
    elif state_income > 30000 and state_income <= 50000:
        income_bin = 'middle'
    elif state_income > 50000 and state_income <= 70000:
        income_bin = 'upper_middle'
    else:
        income_bin = 'upper'
    print(state_income)
    print(income_bin)

    # Finding the median of that range so that we can do some math!
    if income_user_input == 'lower':
        median_income_value = statistics.median([0, 30000])

    elif income_user_input == 'middle':
        median_income_value = statistics.median([30000, 50000])

    elif income_user_input == 'upper_middle':
        median_income_value = statistics.median([50000, 70000])

    elif income_user_input == 'upper':
        median_income_value = statistics.median([7000, 90000])

    print(median_income_value)

    # Finding the MATCH percentage for income
    if state_income > median_income_value:
        income_match_percentage = (median_income_value/state_income)*100
    elif median_income_value > state_income:
        income_match_percentage = (state_income/median_income_value)*100

    return (income_match_percentage)
