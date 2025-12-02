# Multigrid-inspired linear solver

This repository now contains a small C++ console program that lets you:

- Choose between a V-cycle or W-cycle style iteration effort.
- Enter the number of equations/unknowns (up to 12).
- Fill in the coefficient matrix and right-hand side with a grid-style prompt.
- Trigger the calculation and view the iterative solution along with residual info.

## Build

Compile with any C++17 compiler. For example:

```bash
g++ -std=c++17 -O2 -Wall -Wextra -pedantic main.cpp -o multigrid_solver
```

## Run

Launch the solver and follow the on-screen menus:

```bash
./multigrid_solver
```

After choosing the cycle type and system size, the program asks for each matrix cell
`a[i][j]` and right-hand side `b[i]`. Type `c` when prompted to perform the calculation.
