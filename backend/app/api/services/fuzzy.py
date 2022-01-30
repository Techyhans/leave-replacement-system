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
        self.subject['islamic'] = fuzz.trapmf(self.subject.universe, [5, 6, 7, 8])
        self.subject['science'] = fuzz.trapmf(self.subject.universe, [7, 8, 12, 13])
        self.subject['economics'] = fuzz.trapmf(self.subject.universe, [12, 13, 14, 15])

        self.skill['language'] = fuzz.trapmf(self.skill.universe, [0, 1, 5, 6])
        self.skill['islamic'] = fuzz.trapmf(self.skill.universe, [5, 6, 7, 8])
        self.skill['science'] = fuzz.trapmf(self.skill.universe, [7, 8, 12, 13])
        self.skill['economics'] = fuzz.trapmf(self.skill.universe, [12, 13, 14, 15])

        self.output['no'] = fuzz.zmf(self.output.universe, 0, 1)
        self.output['yes'] = fuzz.smf(self.output.universe, 0, 1)

        rule1 = control.Rule((self.subject['language'] | self.subject['islamic']) & (self.skill['language']),
                             self.output['yes'])
        rule2 = control.Rule(self.subject['science'] & (self.skill['language']), self.output['no'])
        rule3 = control.Rule(self.subject['islamic'] & (self.skill['islamic']), self.output['yes'])
        rule4 = control.Rule((self.subject['science'] | self.subject['economics']) & (self.skill['islamic']),
                             self.output['no'])
        rule5 = control.Rule(
            (self.subject['science'] | self.subject['economics'] | self.subject['language']) & (self.skill['science']),
            self.output['yes'])
        rule6 = control.Rule((self.subject['islamic']) & (self.skill['science']), self.output['no'])
        rule7 = control.Rule(self.subject['economics'] & (self.skill['economics']), self.output['yes'])
        rule8 = control.Rule((self.subject['science'] | self.subject['islamic']) & self.skill['economics'],
                             self.output['no'])

        output_control = control.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8])
        self.predictor = control.ControlSystemSimulation(output_control)

    def predict(self, subject, skill):
        self.predictor.input['subject'] = subject
        self.predictor.input['skill'] = skill

        try:
            self.predictor.compute()
            return self.predictor.output['output']
        except:
            return 0
