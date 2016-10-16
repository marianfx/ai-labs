
from hanoi_solver import HanoiSolver
import sys


class BacktrackHanoiSolver(HanoiSolver):
    """Solves the Hanoi using backtrack."""

    def __init__(self, n, m):
        super(BacktrackHanoiSolver, self).__init__(n, m)
        sys.setrecursionlimit(2 ** 20)

    def run_solver(self):
        print ("Starting bactracking.")
        self.back(1, 1)
        print("Details:")
        print("Nr. of solutions: {s}.".format(s=self.number_of_solutions))
        print("Solutions:")
        for sol in self.solutions:
            print (sol)

    def back(self, ti, tj):
        """The backtracking for transitioning.

        :param ti: The tower to start from.
        :param tj: The tower to end in.
        """

        # transitions achieved final state
        if self.is_in_final_state():
            self.run_on_final_state()
            return True

        # continue generating transitions (towers, so 1 .. n)
        for i in list(set(self.current_state[1:])):
            for j in range(tj, self.n + 1):
                if self.is_valid_transition(i, j) is True:
                    self.do_transition(i, j)
                    # print ("Done transition.")
                    self.back(i, j)
                    # print ("Back again.")
                    self.undo_transition(i, j)
