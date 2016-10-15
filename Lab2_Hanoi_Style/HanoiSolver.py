
class HanoiSolver(object):

    def __init__(self, n, m):
        '''Initializer for The Generic Hanoi Solver Class, for the Hanoi Tower problem.

        :param n: The number of towers (int).
        :param m: The number of disks (int).
        '''
        self.n = n
        self.m = m

        # initial state (n, 1, ..., 1)
        # .............. 0, 1, 2.., m
        # The numbers from the list represent:
        # 1, 2, ..., m = disks, 1 = the smallest, m = the largest.
        # 1, 1, ..., 1 = all of them are on the first tower.
        self.initial_state = [n] + [1] * m
        self.current_state = self.initial_state
        # final state (n, n, ..., n)
        self.final_state = [n] * (m + 1)

    def is_final_state(self, current_state):
        """Checks if current_state is final.

        :param current_state: (n, x, x, ..., x)
        :returns: True if the given state is final.
        """
        return current_state == self.final_state

    def print_current_state(self):
        """Prints the current state."""
        print (self.current_state)

    def is_valid_transition(self, current_state, tower_i, tower_j):
        """Checks wether a transition is valid or not.

        We try to move from tower i to tower j.
        Valid state means (aka RULES):
            - The positions exist.
            - We do not move from same-to-same.
            - The piece from tower i must be smaller than the one from tower j.
        :returns: True if valid state, False otherwise.
        """

        # basic tests
        if not (1 <= tower_i <= self.n):
            return False
        if not (1 <= tower_j <= self.n):
            return False
        if tower_i == tower_j:
            return False

        try:
            top_from_tower_i = current_state[1:].index(tower_i)
            top_from_tower_j = current_state[1:].index(tower_j)

            if(top_from_tower_i > top_from_tower_j):
                return False

        except ValueError:  # Some position is wrong.
            return False

        return True

    def do_transition(self, tower_i, tower_j, current_state=None):
        """Realise a transition from tower i to tower j, given current state.

        :param tower_i: The tower from where the transition starts.
        :param tower_j: The tower to where the transition should end.
        :returns: The modified current state.
        """
        is_valid = False
        if current_state is None:
            current_state = self.current_state

        is_valid = self.is_valid_transition(current_state, tower_i, tower_j)
        if not is_valid:
            return current_state

        top_from_tower_i = current_state[1:].index(tower_i)
        current_state[top_from_tower_i] = tower_j
        self.current_state = current_state
        print ("Moved: disk %10s from %10s to %10s." % (str(top_from_tower_i),
                                                        str(tower_i),
                                                        str(tower_j)))
        self.print_current_state()
        return current_state

    def run_solver(self, strategy):
        """Runs the Hanoi Solver with the given strategy."""
        while (not self.is_final_state(self.current_state)):
            tower_i, tower_j = strategy()  # better derive the class I guess.
            self.do_transition(tower_i, tower_j)
        print("Problem Solved! Maybe...")

    def strategy_random(self):
        """Represents a strategy for H@nOi. Choses towers randomly.

        Only for test, will be implemented in another py.
        :returns: (tower i, tower j) as a transition-tuple.
        """
        from random import randint
        tower_i = randint(1, self.n + 1)
        tower_j = randint(1, self.n + 1)
        return tower_i, tower_j


if __name__ == "__main__":
    import time

    start_time = time.time()

    hanoi_solver = HanoiSolver(3, 2)
    hanoi_solver.run_solver(hanoi_solver.strategy_random)

    print('Time passed: %s seconds.' % (time.time() - start_time))
