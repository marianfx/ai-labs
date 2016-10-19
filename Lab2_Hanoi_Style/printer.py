class Printer():
    def __init__(self, number_of_iterations, tested_solvers):
        self.solvers = tested_solvers
        self.nr_iterations = number_of_iterations
        self.inputs = []
        self.outputs = {}

    def generate_test_cases(self):
        from random import randint
        inputs = []
        f = open("inputs.txt", 'w')
        f.write("Nr   Towers    Disks\n")
        for i in range(0, self.nr_iterations):
            number_of_towers = randint(3, 4)
            number_of_disks = randint(3, 8)
            inputs.append(tuple([number_of_towers, number_of_disks]))
            f.write("%d     %d          %d\n" % (i, number_of_towers, number_of_disks))
        f.close()
        return inputs

    def runt_tests(self):
        from backtrack_hanoi_solver import BacktrackHanoiSolver
        from random_hanoi_solver import RandomHanoiSolver
        from hill_climbing_solver import HillClimbingSolver
        from astar_hanoi_solver import AStarHanoiSolver

        self.inputs = self.generate_test_cases()
        for solver in self.solvers:
            self.outputs[solver] = []

        for input in self.inputs:
            for strategy in self.solvers:
                if strategy == "backtracking":
                    hanoi_solver = BacktrackHanoiSolver(input[0], input[1], True)
                elif strategy == "random":
                    hanoi_solver = RandomHanoiSolver(input[0], input[1])
                elif strategy == 'hill climbing':
                    hanoi_solver = HillClimbingSolver(input[0], input[1])
                elif strategy == 'astar':
                    hanoi_solver == AStarHanoiSolver(input[0], input[1], True)

            solver_response = hanoi_solver.run_solver()
            self.outputs[strategy].append(solver_response)
        return (self.outputs)
        # print("Time passed: {tt}".format(tt=nice_time(diff)))

    def get_summary(self):
        solvers_info = []
        for solver in self.solvers:
            all_results = self.outputs[solver]
            total_time = sum([result[0] for result in all_results])
            total_passed = sum([result[1] for result in all_results])
            total_fail = self.nr_iterations - total_passed
            total_moves = sum([len(result[2]) for result in all_results])
            solver_summary = {"name":solver,
                              "nr fails": total_fail,
                              "nr successes": total_passed,
                              "average time": total_time / self.nr_iterations,
                              "average moves": total_moves / total_passed
                              }
            solvers_info.append(solver_summary)
        return solvers_info
    def write_to_file(self, file_name):
        f = open(file_name, 'w')
        dates = self.get_summary()

        for data in dates:
            txt_result = """
The result for %(name)s strategy, after running %(nr_iteration)d  inputs from inputs.txt are:
        *Nr Fails: %(fails)d
        *Nr Success: %(success)d
        *Average Moves: %(moves)d
        *Average Time: %(time)d

            """%({"name": data['name'],
                  "nr_iteration":self.nr_iterations,
                  "fails":data["nr fails"],
                  "success": data["nr successes"],
                  "moves": data["average moves"],
                  "time":data["average time"]
                    })
            f.write(txt_result)
        f.close()


if __name__ == "__main__":
    print("Starting...")
    printer = Printer(10, ['random'])
    outputs = printer.runt_tests()
    printer.write_to_file("output_summary.txt")
    print("Done")
