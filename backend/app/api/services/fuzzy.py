import numpy as np
import skfuzzy as fuzz
from skfuzzy import control


class Fuzzy:
    def __init__(self, subjects_max):
        self.hour = control.Antecedent(np.arange(1, 24 + 1, 1), 'hour')
        self.subject = control.Antecedent(np.arange(1, subjects_max + 1, 1), 'subject')
        self.weekday = control.Antecedent(np.arange(1, 5 + 1, 1), 'weekday')
        self.output = control.Consequent(np.array([0, 1]), 'output')

        self.output['no'] = fuzz.zmf(self.output.universe, 0, 1)
        self.output['yes'] = fuzz.smf(self.output.universe, 0, 1)

        self.predictor = None

    def fit(self, start_hour, end_hour, subject, weekday):
        self.hour['left'] = fuzz.zmf(self.hour.universe, start_hour - 1, end_hour)
        self.hour['middle'] = fuzz.trapmf(self.hour.universe, [start_hour - 1, start_hour, end_hour, end_hour + 1])
        self.hour['right'] = fuzz.smf(self.hour.universe, start_hour, end_hour + 1)

        self.subject['left'] = fuzz.zmf(self.subject.universe, subject - 1, subject)
        self.subject['middle'] = fuzz.trimf(self.subject.universe, [subject - 1, subject, subject + 1])
        self.subject['right'] = fuzz.smf(self.subject.universe, subject, subject + 1)

        self.weekday['left'] = fuzz.zmf(self.weekday.universe, weekday - 1, weekday)
        self.weekday['middle'] = fuzz.trimf(self.weekday.universe, [weekday - 1, weekday, weekday + 1])
        self.weekday['right'] = fuzz.smf(self.weekday.universe, weekday, weekday + 1)

        rule1 = control.Rule((self.hour['left'] | self.hour['right']) & self.subject['middle'] & (self.weekday['left'] | self.weekday['right']), self.output['yes'])
        rule2 = control.Rule((self.hour['left'] | self.hour['right']) & self.subject['middle'] & (self.weekday['middle']), self.output['yes'])
        rule3 = control.Rule(self.hour['middle'] & self.subject['middle'] & (self.weekday['left'] | self.weekday['right']), self.output['yes'])
        rule4 = control.Rule(self.hour['middle'] & (self.subject['left'] | self.subject['right']) & self.weekday['middle'], self.output['no'])
        rule5 = control.Rule(self.hour['middle'] & (self.subject['left'] | self.subject['right']) & (self.weekday['left'] | self.weekday['right']), self.output['no'])
        rule6 = control.Rule(self.hour['middle'] & self.subject['middle'] & (self.weekday['left'] | self.weekday['right']), self.output['no'])
        rule7 = control.Rule(self.hour['middle'] & self.subject['middle'] & self.weekday['middle'], self.output['no'])
        rule8 = control.Rule((self.hour['left'] | self.hour['right']) & (self.subject['left'] | self.subject['right']) & self.weekday['middle'], self.output['no'])
        rule9 = control.Rule((self.hour['left'] | self.hour['right']) & (self.subject['left'] | self.subject['right']) & (self.weekday['left'] | self.weekday['right']), self.output['no'])

        output_control = control.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9])
        self.predictor = control.ControlSystemSimulation(output_control)

    def predict(self, hour, subject, weekday):
        self.predictor.input['hour'] = hour
        self.predictor.input['subject'] = subject
        self.predictor.input['weekday'] = weekday
        self.predictor.compute()

        return self.predictor.output['output']
