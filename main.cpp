#include <cmath>
#include <iomanip>
#include <iostream>
#include <limits>
#include <optional>
#include <string>
#include <vector>

enum class CycleType { V, W };

struct SolveResult {
    std::vector<double> x;
    int iterations{};
    double residual{};
    bool converged{};
};

// Print a simple grid to hint the user which values are being requested.
void printInputGrid(int n) {
    std::cout << "\nEnter the coefficients for your system (A)";
    std::cout << "\nEach cell is a_ij in: a_11 x1 + a_12 x2 + ... = b1";
    std::cout << "\n\n    |";
    for (int j = 0; j < n; ++j) {
        std::cout << "  x" << (j + 1) << "  |";
    }
    std::cout << '\n';
    std::cout << std::string(6 + 6 * n, '-') << '\n';
    for (int i = 0; i < n; ++i) {
        std::cout << "x" << (i + 1) << " |";
        for (int j = 0; j < n; ++j) {
            std::cout << std::setw(5) << ' ' << " |";
        }
        std::cout << "  =  b" << (i + 1) << '\n';
    }
    std::cout << '\n';
}

double promptNumber(const std::string &message) {
    while (true) {
        std::cout << message;
        double value{};
        if (std::cin >> value) {
            return value;
        }
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "Please enter a valid number.\n";
    }
}

int promptInt(const std::string &message, int minValue, int maxValue) {
    while (true) {
        std::cout << message;
        int value{};
        if (std::cin >> value && value >= minValue && value <= maxValue) {
            return value;
        }
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "Please enter an integer between " << minValue << " and " << maxValue << ".\n";
    }
}

CycleType promptCycle() {
    while (true) {
        std::cout << "\nChoose multigrid cycle type:\n";
        std::cout << "  1) V-cycle (lighter, faster)\n";
        std::cout << "  2) W-cycle (extra smoothing)\n";
        std::cout << "Select 1 or 2: ";
        int choice{};
        if (std::cin >> choice) {
            if (choice == 1) return CycleType::V;
            if (choice == 2) return CycleType::W;
        }
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "Invalid choice, please try again.\n";
    }
}

void gaussSeidelSweep(const std::vector<std::vector<double>> &A, const std::vector<double> &b,
                      std::vector<double> &x) {
    const int n = static_cast<int>(A.size());
    for (int i = 0; i < n; ++i) {
        double sigma = 0.0;
        for (int j = 0; j < n; ++j) {
            if (j == i) continue;
            sigma += A[i][j] * x[j];
        }
        const double diag = A[i][i];
        if (std::abs(diag) < 1e-12) {
            continue;  // Avoid division by zero; iteration will fail to converge.
        }
        x[i] = (b[i] - sigma) / diag;
    }
}

std::vector<double> computeResidual(const std::vector<std::vector<double>> &A,
                                    const std::vector<double> &b,
                                    const std::vector<double> &x) {
    const int n = static_cast<int>(A.size());
    std::vector<double> r(n, 0.0);
    for (int i = 0; i < n; ++i) {
        double Ax = 0.0;
        for (int j = 0; j < n; ++j) {
            Ax += A[i][j] * x[j];
        }
        r[i] = b[i] - Ax;
    }
    return r;
}

double norm(const std::vector<double> &v) {
    double sum = 0.0;
    for (double value : v) sum += value * value;
    return std::sqrt(sum);
}

SolveResult multigridInspiredSolve(const std::vector<std::vector<double>> &A,
                                   const std::vector<double> &b, CycleType cycle) {
    const int n = static_cast<int>(A.size());
    std::vector<double> x(n, 0.0);
    const int maxIterations = (cycle == CycleType::V) ? 60 : 120;
    const int smoothingSweeps = (cycle == CycleType::V) ? 2 : 4;
    const double tolerance = 1e-8;

    SolveResult result;
    result.x = x;

    for (int iter = 0; iter < maxIterations; ++iter) {
        // Pre- and post-smoothing sweeps; W-cycle simply doubles the work.
        for (int s = 0; s < smoothingSweeps; ++s) {
            gaussSeidelSweep(A, b, result.x);
        }
        auto r = computeResidual(A, b, result.x);
        double resNorm = norm(r);
        result.residual = resNorm;
        result.iterations = iter + 1;
        if (resNorm < tolerance) {
            result.converged = true;
            break;
        }
        if (cycle == CycleType::W) {
            // Extra relaxation to mimic the heavier W-cycle effort.
            for (int s = 0; s < smoothingSweeps; ++s) {
                gaussSeidelSweep(A, b, result.x);
            }
        }
    }

    return result;
}

void printSummary(const SolveResult &res) {
    std::cout << "\nSolution" << (res.converged ? " (converged)" : " (stopped)") << ":\n";
    std::cout << std::fixed << std::setprecision(6);
    for (size_t i = 0; i < res.x.size(); ++i) {
        std::cout << "  x" << (i + 1) << " = " << std::setw(12) << res.x[i] << '\n';
    }
    std::cout << "Iterations: " << res.iterations << "\n";
    std::cout << "Residual  : " << res.residual << " (Euclidean norm)\n";
}

int main() {
    std::cout << "Multigrid-inspired iterative solver for linear systems" << '\n';
    std::cout << "This program uses Gauss-Seidel smoothing and treats the chosen cycle" << '\n';
    std::cout << "(V or W) as a hint for how much relaxation work to perform." << '\n';

    CycleType cycle = promptCycle();

    const int maxEquations = 12;
    int n = promptInt("\nEnter the number of equations/unknowns (1-" + std::to_string(maxEquations) + "): ",
                      1, maxEquations);

    printInputGrid(n);

    std::vector<std::vector<double>> A(n, std::vector<double>(n, 0.0));
    std::vector<double> b(n, 0.0);

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            std::string prompt = "Enter coefficient a[" + std::to_string(i + 1) + "][" +
                                 std::to_string(j + 1) + "]: ";
            A[i][j] = promptNumber(prompt);
        }
        b[i] = promptNumber("Enter right-hand side b[" + std::to_string(i + 1) + "]: ");
    }

    std::cout << "\nType 'c' and press Enter to calculate the solution, or any other key to quit: ";
    std::string action;
    std::cin >> action;
    if (action != "c" && action != "C") {
        std::cout << "Exiting without solving.\n";
        return 0;
    }

    auto result = multigridInspiredSolve(A, b, cycle);
    printSummary(result);

    if (!result.converged) {
        std::cout << "\nNote: The solver stops after a fixed effort. If it did not converge,"
                     " try the W-cycle for stronger smoothing or adjust your system" << '\n';
    }

    return 0;
}
