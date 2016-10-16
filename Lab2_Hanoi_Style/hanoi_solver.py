
class HanoiSolver(object):
    '''The Generic Hanoi Solver Class, for the Hanoi Tower problem.

    :param n: The number of towers (int).
    :param m: The number of disks (int).
    '''

    def __init__(self, n, m):
        self.n = n
        self.m = m

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
        self.number_of_solutions = 0
        self.solutions = []
        self.tempsolutions = []

    def is_in_final_state(self):
        """Checks if current_state is final.

        :param current_state: (n, x, x, ..., x)
        :returns: True if the given state is final.
        """
        return cmp(self.current_state, self.final_state) == 0

    def get_current_state(self):
        """:returns: the current state."""
        return (self.current_state)

    def is_valid_transition(self, tower_i, tower_j):
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
            top_from_tower_i = self.current_state[1:].index(tower_i) + 1
        except ValueError:  # Not found means tryin to move inexistent.
            return False

        try:
            top_from_tower_j = self.current_state[1:].index(tower_j) + 1
        except ValueError:  # Not found means empty.
            return True

        if(top_from_tower_i > top_from_tower_j):
            return False

        return True

    def do_transition(self, tower_i, tower_j):
        """Realise a transition from tower i to tower j, given current state.

        :param tower_i: The tower from where the transition starts.
        :param tower_j: The tower to where the transition should end.
        :returns:   The modified current state.
                    False if the move is impossible.
        """
        top_from_tower_i = self.current_state[1:].index(tower_i) + 1
        self.current_state[top_from_tower_i] = tower_j
        print ("Moved: disk {d} from {s} to {f}.".format(
            d=str(top_from_tower_i),
            s=str(tower_i),
            f=str(tower_j)))
        print (self.get_current_state())
        self.tempsolutions.append((tower_i, tower_j))
        return self.current_state

    def undo_transition(self, tower_i, tower_j):
        """Used for the return from the recursion.

        Undo the transition from tower i to tower j.
        :param tower_i: The tower from where the transition starts.
        :param tower_j: The tower to where the transition should end.
        """
        top_from_tower_j = self.current_state[1:].index(tower_j) + 1
        self.current_state[top_from_tower_j] = tower_i
        print ("Undo: disk {d} from {s} to {f}.".format(
            d=str(top_from_tower_j),
            s=str(tower_j),
            f=str(tower_i)))
        print (self.get_current_state())
        del self.tempsolutions[-1]
        return self.current_state

    def run_on_final_state(self):
        print (
            "Finished.\nState: {state}."
            .format(state=self.get_current_state()))
        self.number_of_solutions += 1
        self.solutions.append(list(self.tempsolutions))

    def run_solver(self):
        print ("No strategy to run. I do not know what to do. :(")
        # """Runs the Hanoi Solver with the given strategy."""
        # while (not self.is_final_state(self.current_state)):
        #     tower_i, tower_j = strategy()  # better derive the class I guess.
        #     self.do_transition(tower_i, tower_j)
        # print("Problem Solved! Maybe...")


if __name__ == "__main__":

    from backtrack_hanoi_solver import BacktrackHanoiSolver
    from nice_timings import *

    start_time = ctime_millis()

    hanoi_solver = BacktrackHanoiSolver(10, 2)
    hanoi_solver.run_solver()
    diff = ctime_millis() - start_time
    print("Time passed: {tt}".format(tt=nice_time(diff)))
