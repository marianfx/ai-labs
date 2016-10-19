class Printer():
    def __init__(self, number_of_iterations, tested_solvers):
        self.solvers = tested_solvers
        self.nr_iterations = number_of_iterations
        self.inputs = []
        self.outputs = {}
    def generate_test_cases(self):
        from random import randint
        inputs = []
        for i in range(0, self.nr_iterations):
            number_of_towers = randint(3, 4)
            number_of_disks = randint(3, 8)
            inputs.append(tuple([number_of_towers, number_of_disks]))
        return inputs

    def runt_tests(self):
        from backtrack_hanoi_solver import BacktrackHanoiSolver
        from random_hanoi_solver import RandomHanoiSolver
        from hill_climbing_solver import HillClimbingSolver
        from astar_hanoi_solver import AStarHanoiSolver

        self.inputs = self.generate_test_cases()
        for solver in self.solvers:
            self.outputs[solver]=[]


        for input in self.inputs:
            for strategy in self.solvers:
                if strategy == "backtracking":
                    hanoi_solver = BacktrackHanoiSolver(input[0], input[1], True)
                elif strategy == "random":
                    hanoi_solver = RandomHanoiSolver(input[0],input[1])
                elif strategy == 'hill climbing':
                    hanoi_solver = HillClimbingSolver(input[0],input[1])
                elif strategy == 'astar':
                    hanoi_solver == AStarHanoiSolver(input[0],input[1], True)

            solver_response = hanoi_solver.run_solver()
            self.outputs[strategy].append(solver_response)
            print("=====================================")
            print("input: " + str())
            print(str(solver_response))
        return(self.outputs)
        # print("Time passed: {tt}".format(tt=nice_time(diff)))
if __name__=="__main__":
    print("Starting...")
    printer = Printer(10,['random'])
    outputs = printer.runt_tests()
    print("Done")