from hanoi_solver import HanoiSolver
from random import randint
import copy


class RandomHanoiSolver(HanoiSolver):
    """Solves The Hanoi Towers Problem using Random Choices (Optimized)

    :param n: The number of towers.
    :param m: The number of disks.
    """

    def __init__(self, n, m):
        super(RandomHanoiSolver, self).__init__(n, m)
        self.last_good = m
        self.strategy_name = "Random (Optimized)"

    def do_transition(self, tower_i, tower_j):
        """Realise a transition from tower i to tower j, given current state.

        Overrides The Transition Method from main class.
        Now does the transition taking in account the last good pos.
        :param tower_i: The tower from where the transition starts.
        :param tower_j: The tower to where the transition should end.
        :returns:   The modified current state.
        """
        try:
            top_from_tower_i = self.current_state[1:self.last_good + 1].index(tower_i) + 1
            self.current_state[top_from_tower_i] = tower_j
        except ValueError:
            pass
        self.tempsolutions.append((tower_i, tower_j))
        return self.current_state

    def strategy(self):
        """The strategy uses optimised random  for transitioning.

        Details:
            - if the greatest disk reaches last position
            then transition for this after is invalide.
            do thesame for next lowest disk so on,
            until all disks don't reach the final state.
            - in this way transition space and the time are reduced.
            - last_good = index of the lowest disk that reached final position
        """
        while not self.is_in_final_state():
            tower_i, tower_j = self.get_random_towers()
            if self.is_valid_transition(tower_i, tower_j) is True:
                self.do_transition(tower_i, tower_j)

                if self.current_state[self.last_good] == self.n:
                    self.last_good -= 1

        self.run_on_final_state()

    def get_random_towers(self):
        tower_i = randint(1, self.n + 1)
        tower_j = randint(1, self.n + 1)
        return tower_i, tower_j
