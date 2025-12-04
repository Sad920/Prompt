#include <cctype>
#include <iostream>
#include <string>
#include <vector>

// A tiny text-mode control panel for a virtual robot. The program mimics the
// idea of pressing buttons on a remote by accepting key presses from the user
// and translating them into movements on a small grid.

namespace {

enum class Direction { North, East, South, West };

std::string toString(Direction dir) {
    switch (dir) {
    case Direction::North: return "North";
    case Direction::East: return "East";
    case Direction::South: return "South";
    case Direction::West: return "West";
    }
    return "Unknown";
}

struct Robot {
    int x{2};
    int y{2};
    Direction facing{Direction::North};
    bool carrying{false};
};

constexpr int kGridSize = 5;

void wrapPosition(int &coordinate) {
    if (coordinate < 0) coordinate = kGridSize - 1;
    if (coordinate >= kGridSize) coordinate = 0;
}

void stepForward(Robot &robot, int direction) {
    // direction: +1 for forward, -1 for backward
    switch (robot.facing) {
    case Direction::North: robot.y -= direction; break;
    case Direction::South: robot.y += direction; break;
    case Direction::East: robot.x += direction; break;
    case Direction::West: robot.x -= direction; break;
    }
    wrapPosition(robot.x);
    wrapPosition(robot.y);
}

void turnLeft(Robot &robot) {
    robot.facing = static_cast<Direction>((static_cast<int>(robot.facing) + 3) % 4);
}

void turnRight(Robot &robot) {
    robot.facing = static_cast<Direction>((static_cast<int>(robot.facing) + 1) % 4);
}

void toggleCarry(Robot &robot) {
    robot.carrying = !robot.carrying;
}

void renderMap(const Robot &robot) {
    std::cout << "\nMap (" << kGridSize << "x" << kGridSize << ")" << "\n";
    for (int y = 0; y < kGridSize; ++y) {
        for (int x = 0; x < kGridSize; ++x) {
            if (x == robot.x && y == robot.y) {
                switch (robot.facing) {
                case Direction::North: std::cout << " ^ "; break;
                case Direction::East: std::cout << " > "; break;
                case Direction::South: std::cout << " v "; break;
                case Direction::West: std::cout << " < "; break;
                }
            } else {
                std::cout << " . ";
            }
        }
        std::cout << '\n';
    }
    std::cout << '\n';
}

void displayPanel(const Robot &robot) {
    std::cout << "================ ROBOT CONTROL PANEL ================\n";
    std::cout << "Position : (" << robot.x << ", " << robot.y << ")\n";
    std::cout << "Facing   : " << toString(robot.facing) << "\n";
    std::cout << "Carrying : " << (robot.carrying ? "Item grabbed" : "Nothing") << "\n";
    std::cout << "-----------------------------------------------------\n";
    std::cout << "Buttons\n";
    std::cout << "  [W] Move forward    [S] Move backward\n";
    std::cout << "  [A] Turn left       [D] Turn right\n";
    std::cout << "  [G] Grab/Release    [M] Record macro\n";
    std::cout << "  [P] Play macro      [R] Reset\n";
    std::cout << "  [Q] Quit\n";
    std::cout << "-----------------------------------------------------\n";
    std::cout << "Press a button: ";
}

void reset(Robot &robot) {
    robot = Robot{};
}

void applyButton(Robot &robot, char input) {
    switch (std::toupper(static_cast<unsigned char>(input))) {
    case 'W': stepForward(robot, +1); break;
    case 'S': stepForward(robot, -1); break;
    case 'A': turnLeft(robot); break;
    case 'D': turnRight(robot); break;
    case 'G': toggleCarry(robot); break;
    case 'R': reset(robot); break;
    default: break;  // Ignore unknown input.
    }
}

std::vector<char> recordMacro() {
    std::vector<char> macro;
    std::cout << "Enter a sequence of buttons (W/A/S/D/G), end with '.' : ";
    char c{};
    while (std::cin >> c) {
        if (c == '.') break;
        c = static_cast<char>(std::toupper(static_cast<unsigned char>(c)));
        if (c == 'W' || c == 'A' || c == 'S' || c == 'D' || c == 'G') {
            macro.push_back(c);
        }
    }
    return macro;
}

void playMacro(Robot &robot, const std::vector<char> &macro) {
    for (char c : macro) {
        applyButton(robot, c);
    }
}

}  // namespace

int main() {
    Robot robot;
    std::vector<char> macro;

    while (true) {
        renderMap(robot);
        displayPanel(robot);
        char input{};
        if (!(std::cin >> input)) break;

        if (std::toupper(static_cast<unsigned char>(input)) == 'Q') {
            std::cout << "Goodbye!\n";
            break;
        }
        if (std::toupper(static_cast<unsigned char>(input)) == 'P') {
            std::cout << "\n-- Macro playback --\n";
            if (macro.empty()) {
                std::cout << "No macro recorded yet. Use the prompt below to create one.\n";
            }
            playMacro(robot, macro);
            continue;
        }
        if (std::toupper(static_cast<unsigned char>(input)) == 'M') {
            macro = recordMacro();
            continue;
        }
        if (std::toupper(static_cast<unsigned char>(input)) == 'R') {
            reset(robot);
            continue;
        }

        applyButton(robot, input);
        std::cout << "\nAction performed!\n";
    }

    return 0;
}
