
from hanoi_solver import HanoiSolver
import sys


class BacktrackHanoiSolver(HanoiSolver):
    """Solves the Hanoi Towers Problem using backtrack.

    :param n: The number of towers.
    :param m: The number of disks.
    :param only_first: Specifies if alg. should stop at first solution.
    """

    def __init__(self, n, m, only_first=False):
        super(BacktrackHanoiSolver, self).__init__(n, m)
        sys.setrecursionlimit(2 ** 20)
        self.previous = []
        self.strategy_name = "Backtracking"
        self.only_first = only_first
        self.solution_found = False

    def undo_transition(self, i, tower_i, tower_j):
        """Undo the transition from tower i to tower j.

        Assumed that disk i was moved (we need to know the disk to revert).
        :param i: The disk which was moved.
        """
        self.current_state[i] = tower_i
        # print ("Undo: disk {d} from {s} to {f}.".format(
        #     d=str(top_from_tower_j),
        #     s=str(tower_j),
        #     f=str(tower_i)))
        # print (self.get_current_state())
        del self.tempsolutions[-1]
        return self.current_state

    def strategy(self):
        """The strategy uses backtracking for transitioning.

        Details:
            - If we encountered the final state, we have a solution.
            - We get a list with all the available moves from the current state
            - For each move:
                - We check for cycles (no return to previous states)
                - we save the transition as visited (if it's not)
                - we update the current state
                - we move on
        """

        if self.solution_found and self.only_first:
            return

        # transitions achieved final state
        if self.is_in_final_state():
            self.solution_found = True
            self.run_on_final_state()
            return True

        moves = self.get_all_available_moves()

        for move in moves:
            tower_i = move[0]
            tower_j = move[1]
            i = self.current_state[1:].index(tower_i) + 1

            transition = self.do_transition(tower_i, tower_j)

            # Stop if existing transition
            if tuple(transition) in self.previous:
                self.undo_transition(i, tower_i, tower_j)
                continue

            self.previous.append(tuple(transition))
            self.strategy()
            del self.previous[-1]
            self.undo_transition(i, tower_i, tower_j)
