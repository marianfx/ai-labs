from nice_timings import *
class HanoiSolver(object):
    '''The Generic Hanoi Solver Class, for the Hanoi Tower problem.

    :param n: The number of towers (int).
    :param m: The number of disks (int).
    '''

    def __init__(self, n, m):
        self.n = n
        self.m = m
        self.strategy_name = "None"

        # initial state (n, 1, ..., 1)
        # .............. 0, 1, 2.., m
        # The numbers from the list represent:
        # 1, 2, ..., m = disks, 1 = the smallest, m = the largest.
        # 1, 1, ..., 1 = all of them are on the first tower.
        self.initial_state = [n] + [1] * m
        self.current_state = list(self.initial_state)
        # final state (n, n, ..., n)
        self.final_state = [n] * (m + 1)

        # Stateeztics
        self.solution_found = False
        self.number_of_solutions = 0
        self.solutions = []
        self.tempsolutions = []

    def get_current_state(self):
        """:returns: the current state."""
        return (self.current_state)

    def get_all_starting_disks(self, state):
        """:returns: A list of disks which can be moves."""
        output = []
        for tower in range(1, self.n + 1):
            try:
                top_from_tower = state[1:].index(tower) + 1
                output.append(top_from_tower)
            except ValueError:
                continue
        return output

    def get_moves_for_a_disk(self, disk, state):
        """:returns: A list of available moves for a disk."""
        output = []
        its_tower = state[disk]
        for tower in range(1, self.n + 1):
            if self.is_valid_transition(its_tower, tower, state):
                output.append((its_tower, tower))
        return output

    def get_all_available_moves(self, state=None):
        """:returns: A list of all available moves, given current state.
                     The result is a tuple list of (tower_i, tower_j)"""
        if state is None:
            state = self.current_state
        output = []
        valid_disks = self.get_all_starting_disks(state)
        for disk in valid_disks:
            moves = self.get_moves_for_a_disk(disk, state)
            output.extend(moves)
        return output

    def is_valid_transition(self, tower_i, tower_j, state=None):
        """Checks wether a transition is valid or not.

        We try to move from tower i to tower j.
        Valid state means (aka RULES):
            - The positions exist.
            - We do not move from same-to-same.
            - The piece from tower i must be smaller than the one from tower j.
        :returns: True if valid state, False otherwise.
        """
        if state is None:
            state = self.current_state
        # basic tests
        if not (1 <= tower_i <= self.n):
            return False
        if not (1 <= tower_j <= self.n):
            return False
        if tower_i == tower_j:
            return False

        try:
            top_from_tower_i = state[1:].index(tower_i) + 1
        except ValueError:  # Not found means tryin to move inexistent.
            return False

        try:
            top_from_tower_j = state[1:].index(tower_j) + 1
        except ValueError:  # Not found means empty.
            return True

        if (top_from_tower_i > top_from_tower_j):
            return False

        return True

    def do_transition(self, tower_i, tower_j):
        """Realise a transition from tower i to tower j.

        :param tower_i: The tower from where the transition starts.
        :param tower_j: The tower to where the transition should end.
        :returns:   The modified current state.
        """
        top_from_tower_i = self.current_state[1:].index(tower_i) + 1
        self.current_state[top_from_tower_i] = tower_j
        # print ("Moved: disk {d} from {s} to {f}.".format(
        #     d=str(top_from_tower_i),
        #     s=str(tower_i),
        #     f=str(tower_j)))
        # print (self.get_current_state())
        self.tempsolutions.append((tower_i, tower_j))
        return self.current_state

    def is_in_final_state(self):
        """Checks if current_state is final.

        :param current_state: (n, x, x, ..., x)
        :returns: True if the given state is final.
        """
        return self.current_state == self.final_state

    def run_on_final_state(self):
        # print (
        #     "Finished.\nState: {state}."
        #     .format(state=self.get_current_state()))
        self.solution_found = True
        self.number_of_solutions += 1
        self.solutions.append(list(self.tempsolutions))

    def strategy():
        pass

    def run_solver(self):

        start_time = ctime_millis()

        print("I am trying to solve the problem.")
        print("Using strategy: {s}".format(s=self.strategy_name))
        print("Please wait....")
        self.strategy()
        print("Finished.")
        print("Nr. of solutions: {s}.".format(s=self.number_of_solutions))
        print("Details in file.")
        solution = None
        if len(self.solutions) > 0:
            # I have at least one solution
            solution = self.solutions[0]
        # print("Solutions:")
        # for sol in self.solutions:
        #     print (sol)
        diff = ctime_millis() - start_time
        print("Time passed: {tt}".format(tt=nice_time(diff)))

        return (diff, self.number_of_solutions, solution)


if __name__ == "__main__":

    from backtrack_hanoi_solver import BacktrackHanoiSolver
    from random_hanoi_solver import RandomHanoiSolver
    from hill_climbing_solver import HillClimbingSolver
    from astar_hanoi_solver import AStarHanoiSolver


    strategy = "a*"
    # strategy = "backtracking"
    # strategy = "hill_climbing"
    if strategy == "backtracking":
        hanoi_solver = BacktrackHanoiSolver(3, 1)
    elif strategy == "random":
        hanoi_solver = RandomHanoiSolver(3, 8)
    elif strategy == 'hill_climbing':
        hanoi_solver = HillClimbingSolver(3, 2)
    elif strategy == "a*":
        hanoi_solver = AStarHanoiSolver(3, 6)
    hanoi_solver.run_solver()

