from hanoi_solver import HanoiSolver
import copy
from random import randint


class HillClimbingSolver(HanoiSolver):
    """
        Solves the Hanoi Towers Problem using Hill Climbing principles

        :param n : The number of towers.
        :param m: The number of disks
    """

    def __init__(self, n, m):
        super(HillClimbingSolver, self).__init__(n, m)
        self.strategy_name = "Hill Climbing"
        self.solution_found = False
        self.last_good = m
        self.key_state_last_good = m
        self.current_score = self.score(self.current_state)  # score of initial state
        self.key_state = copy.copy(self.current_state)  # first key state is initial state
        self.key_state_index = 0  # that means we go back to the key state index in
        self.nr_returns = 0
        self.previous_down = False
        self.nr_down = 0

    def score(self, state=None):
        score = 0
        if state is None:
            state = self.current_state

        for i in range(1, len(state)):
            score += i * state[i]
        return score

    def save_key_state(self):
        self.key_state = copy.copy(self.current_state)
        self.key_state_last_good = self.last_good
        self.key_state_index = len(self.tempsolutions)

    def return_to_key_state(self):
        # print("RETURN")
        # print(str(self.current_state) + " " + str(self.key_state))
        self.current_state = copy.copy(self.key_state)
        self.current_score = self.score(self.current_state)
        self.last_good = self.key_state_last_good
        self.tempsolutions = self.tempsolutions[:self.key_state_index]

    def strategy(self):
        """The strategy uses Hill Climbing for transitioning.

        Details:
            - Score function is sum of elements from list(state)
                ex sum([3,1,1,1]) sum of initial  state
                   sum([3,3,3,3]) sum of final state

            - If we encountered the final state, we have a solution.
            - We get a list with all the available moves from the current state
            - For each move:
                - We compute for each available move score ==> f(state)
                - we chose first option that have greater score that score of current state
                - we update the current state
                - we move on
        """

        # while transition hasn't achieved final state
        while not self.is_in_final_state():

            # get a list of all the valid available moves from current state
            moves = self.get_all_available_moves()

            # filter available moves by score

            moves = [move for move in moves if self.score(self.get_target_state(move[0], move[1])) > self.current_score]

            # I have no state to higer score from current state
            # if len(moves)==0  return to the key state key state is optimal state greatest(s) diskt are on n'th tower()

            if len(moves) == 0:
                if self.previous_down or self.nr_down > 1:

                    self.nr_down = 0
                    self.return_to_key_state()
                    self.nr_returns += 1
                    if self.nr_returns > 1000:
                        break
                    continue
                else:
                    moves = self.get_all_available_moves()
                    moves = [move for move in moves if
                             self.score(self.get_target_state(move[0], move[1])) <= self.current_score]

                    self.previous_down = True
                    self.nr_down += 1
            else:
                self.previous_down = False

            move_index = self.get_random_move(len(moves))
            tower_i, tower_j = moves[move_index]
            # we have chose a transition that move us to state with greater score so we  call do_transition

            transition = self.do_transition(tower_i, tower_j)

            self.current_score = self.score()



            if self.current_state[self.last_good] == self.n:
                # print("SAVE KEY STATE =======>>>>" + str(self.current_state))
                self.last_good -= 1
                self.save_key_state()

        self.run_on_final_state()

    def run_on_final_state(self):
        if self.is_in_final_state():
            super(HillClimbingSolver, self).run_on_final_state()
        else:
            pass
    def get_random_move(self, number_of_moves):
        return randint(0, number_of_moves - 1)

    def get_target_state(self, tower_i, tower_j):
        '''
        Function returns state in which we'll be after transition from tower_i to tower_j
        :param tower_i: tower from we move disk
        :param tower_j: tower where we move disk
        :return: state represented by list
        '''
        top_from_tower_i = self.current_state[1:].index(tower_i) + 1
        new_state = copy.copy(self.current_state)
        new_state[top_from_tower_i] = tower_j

        return new_state
