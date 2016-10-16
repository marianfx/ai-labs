
from hanoi_solver import HanoiSolver
import sys


class BacktrackHanoiSolver(HanoiSolver):
    """Solves the Hanoi using backtrack."""

    def __init__(self, n, m, only_first = False):
        super(BacktrackHanoiSolver, self).__init__(n, m)
        sys.setrecursionlimit(2 ** 20)
        self.previous = []
        self.strategy_name = "Backtracking"
        self.only_first = only_first
        self.solution_found = False

    def get_all_starting_disks(self):
        """:returns: A list of disks which can be moves."""
        output = []
        for tower in range(1, self.n + 1):
            try:
                top_from_tower = self.current_state[1:].index(tower) + 1
                output.append(top_from_tower)
            except ValueError:
                continue
        return output

    def get_moves_for_a_disk(self, disk):
        output = []
        its_tower = self.current_state[disk]
        for tower in range(1, self.n + 1):
            if self.is_valid_transition(its_tower, tower):
                output.append((its_tower, tower))
        return output

    def get_all_available_moves(self):
        """Given current state, returns all possible moves available."""
        output = []
        valid_disks = self.get_all_starting_disks()
        for disk in valid_disks:
            moves = self.get_moves_for_a_disk(disk)
            output.extend(moves)
        return output

    def strategy(self):
        """The strategy uses backtracking for transitioning.

        Details: 
            - If we encountered the final state, we have a solution.
            - We get a list with all the available moves from the current state.
            - For each move:
                - We check if it's valid (should be).
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

            # Stop if invalid transition
            #if self.is_valid_transition(tower_i, tower_j) is False:
            #    continue

            transition = self.do_transition(tower_i, tower_j)

            # Stop if existing transition
            if tuple(transition) in self.previous:
                self.undo_transition(i, tower_i, tower_j)
                continue
            
            self.previous.append(tuple(transition))
            self.strategy()
            del self.previous[-1]
            self.undo_transition(i, tower_i, tower_j)
