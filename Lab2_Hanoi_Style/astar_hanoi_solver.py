
from hanoi_solver import HanoiSolver


class StarState(object):
    """Represents a state, with an attached score."""

    def __init__(self, state, score=0):
        self.state = state
        self.score = score


class AStarHanoiSolver(HanoiSolver):
    """Solves the Hanoi Towers Problem using A*.

    :param n: The number of towers.
    :param m: The number of disks.
    :param only_first: Specifies if alg. should stop at first solution.
    """

    def __init__(self, n, m, only_first=False):
        super(AStarHanoiSolver, self).__init__(n, m)
        # initial state reversed with final state
        self.initial_state = [n] * (m + 1)
        self.current_state = list(self.initial_state)
        self.final_state = [n] + [1] * m

        self.strategy_name = "A*"
        self.only_first = only_first
        self.solution_found = False

        self.previous = []
        self.states = []  # let's make this a matrix, a[i][j], with i = score

    def strategy(self):
        """The strategy uses A*.

        Details:
            - The main idea is: compute the whole problem space, assign scores.
            - We start from the final state, try to reach the initial
            - For each state (eg. state X):
                - We compute the reachable states from state X
                - We assign scores to all the states achievable and not visited
                    - state Y score = state X score + 1
            - To get the optimal solution:
                - we start from the initial state
                - we chose the lowest-score states, until we reach the end
                - we have achieved the optimal solution
        """
        # get a list of all the valid available moves; #initial
        moves = self.get_all_available_moves()
        score = 1

        for move in moves:
            tower_i = move[0]
            tower_j = move[1]

            transition = tuple(self.do_transition(tower_i, tower_j))

            if transition in self.previous:
                continue
