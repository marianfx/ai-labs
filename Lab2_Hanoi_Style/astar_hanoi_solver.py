
from hanoi_solver import HanoiSolver


class StarState(object):
    """Represents a state, with an attached score."""

    def __init__(self, state, cameFrom=[], score=0):
        self.state = state
        self.score = score
        self.cameFrom = cameFrom

    def copy(self):
        return StarState(tuple(self.state), list(self.cameFrom), self.score)


class AStarHanoiSolver(HanoiSolver):
    """Solves the Hanoi Towers Problem using A*.

    :param n: The number of towers.
    :param m: The number of disks.
    :param only_first: Specifies if alg. should stop at first solution.
    """

    def __init__(self, n, m):
        super(AStarHanoiSolver, self).__init__(n, m)

        self.strategy_name = "A*"

        self.closedSet = []
        start_state = StarState(tuple(self.initial_state))
        self.openSet = [start_state]
        self.openSetForStates = [tuple(self.initial_state)]
        self.end_state = None

    def run_on_final_state(self):
        # print (
        #     "Finished.\nState: {state}."
        #     .format(state=self.get_current_state()))
        self.solution_found = True
        self.number_of_solutions = 1
        path = [self.end_state.state]
        current = self.end_state
        while len(current.cameFrom) != 0:
            path.append(current.cameFrom[0].state)
            current = current.cameFrom[0]
        path.reverse()
        self.solutions = [path]

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

        while len(self.openSet) != 0:
            # get a state and get available moves from it
            current = self.openSet[0].copy()
            the_state = list(current.state)
            the_tuple = tuple(current.state)

            if the_state == self.final_state:
                self.end_state = current.copy()
                self.run_on_final_state()

            del self.openSet[0]             # mark as processed
            del self.openSetForStates[0]
            self.closedSet.append(the_tuple)

            moves = self.get_all_available_moves(the_state)

            for move in moves:
                the_state = list(current.state)
                the_tuple = tuple(current.state)
                self.current_state = the_state  # update/restore current state
                tower_i = move[0]
                tower_j = move[1]

                # get the possible transition from this state
                tentative_transition = tuple(self.do_transition(tower_i, tower_j))

                # get the transition as a state
                tentative_state = StarState(tuple(tentative_transition), [], 0)

                # if it's marked as processed, ignore it
                if tentative_transition in self.closedSet:
                    continue

                tentative_score = current.score + 1  # distance is 1

                if tentative_transition not in self.openSetForStates:
                    self.openSet.append(tentative_state)
                    self.openSetForStates.append(tentative_transition)
                else:  # element exists, check for score
                    query = [x for x in self.openSet if x.state == tentative_transition]
                    # should return value
                    tentative_state = query[0]
                    if tentative_state.score <= tentative_score:
                        continue  #

                # best solution till now, save it
                tentative_state.cameFrom.append(current)
                tentative_state.score = tentative_score

        self.number_of_solutions = 1
