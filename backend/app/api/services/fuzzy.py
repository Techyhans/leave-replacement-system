import numpy as np
import skfuzzy as fuzz
from skfuzzy import control


class Fuzzy:
    def __init__(self):
        self.subject = control.Antecedent(np.arange(1, 16, 1), 'subject')
        self.skill = control.Antecedent(np.arange(1, 16, 1), 'skill')
        self.output = control.Consequent(np.array([0, 1]), 'output')

        self.output['no'] = fuzz.zmf(self.output.universe, 0, 1)
        self.output['yes'] = fuzz.smf(self.output.universe, 0, 1)

        self.subject['language'] = fuzz.trapmf(self.subject.universe, [0, 1, 5, 6])
        self.subject['islamic'] = fuzz.trapmf(self.subject.universe, [5, 6, 8, 9])
        self.subject['science'] = fuzz.trapmf(self.subject.universe, [8, 9, 11, 12])
        self.subject['art'] = fuzz.trapmf(self.subject.universe, [11, 12, 14, 15])

        self.skill['language'] = fuzz.trapmf(self.skill.universe, [0, 1, 5, 6])
        self.skill['islamic'] = fuzz.trapmf(self.skill.universe, [5, 6, 8, 9])
        self.skill['science'] = fuzz.trapmf(self.skill.universe, [8, 9, 11, 12])
        self.skill['art'] = fuzz.trapmf(self.skill.universe, [11, 12, 14, 15])

        self.output['no'] = fuzz.zmf(self.output.universe, 0, 1)
        self.output['yes'] = fuzz.smf(self.output.universe, 0, 1)

        rule1 = control.Rule((self.subject['language'] | self.subject['islamic']) & (self.skill['islamic']),
                             self.output['yes'])
        rule2 = control.Rule(
            (self.subject['language']) & (self.skill['language'] | self.skill['science']),
            self.output['yes'])
        rule3 = control.Rule(self.subject['science'] & (self.skill['language']), self.output['no'])
        rule4 = control.Rule(self.subject['islamic'] & (self.skill['islamic']), self.output['yes'])
        rule5 = control.Rule((self.subject['science'] | self.subject['art']) & (self.skill['islamic']),
                             self.output['no'])
        rule6 = control.Rule(
            (self.subject['science'] | self.subject['art'] | self.subject['language']) & (self.skill['science']),
            self.output['yes'])
        rule7 = control.Rule((self.subject['islamic']) & (self.skill['science']), self.output['no'])
        rule8 = control.Rule(self.subject['art'] & (self.skill['art']), self.output['yes'])
        rule9 = control.Rule((self.subject['science'] | self.subject['islamic']) & self.skill['art'],
                             self.output['no'])

        output_control = control.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9])
        self.predictor = control.ControlSystemSimulation(output_control)

    def predict(self, subject, skill):
        self.predictor.input['subject'] = subject
        self.predictor.input['skill'] = skill

        try:
            self.predictor.compute()
            return self.predictor.output['output']
        except:
            return 0
