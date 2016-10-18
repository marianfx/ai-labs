from hanoi_solver import HanoiSolver
from random import randint
import copy


class RandomHanoiSolver(HanoiSolver):
    """Solver the hanoi uising random chose"""

    def __init__(self, n, m):
        super(RandomHanoiSolver, self).__init__(n, m)
        self.last_good = m
        self.strategy_name = "Random"

    def do_transition(self, tower_i, tower_j):
        """Realise a transition from tower i to tower j, given current state.

        :param tower_i: The tower from where the transition starts.
        :param tower_j: The tower to where the transition should end.
        :returns:   The modified current state.
                    False if the move is impossible.
        """
        try:
            top_from_tower_i = self.current_state[1:self.last_good + 1].index(tower_i) + 1
            self.current_state[top_from_tower_i] = tower_j
        except ValueError:
            pass
            # print('Nu gaseste un element de pe turnul 3 ca sa mute')
        self.tempsolutions.append((tower_i, tower_j))
        return self.current_state

    def strategy(self):
        """The strategy uses optimised random  for transitioning.

        Details:
            - if the greatest disk reaches last position
            then transition for this after is invalide.
            do thesame for next lowest disk so on,
            until all disks don't reach the final state.
            - We reduce in this way transition space and get some time and .
            - last_good = index of the lowest disk that reached final position
        """
        while not self.is_in_final_state():
            tower_i, tower_j = self.random()
            if self.is_valid_transition(tower_i, tower_j) is True:
                self.do_transition(tower_i, tower_j)

                if self.current_state[self.last_good] == self.n:
                    self.last_good -= 1
                    # print(len(self.visited_states))
        self.run_on_final_state()

    def random(self):
        tower_i = randint(1, self.n + 1)
        tower_j = randint(1, self.n + 1)
        return tower_i, tower_j
