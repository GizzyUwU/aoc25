import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";

export default async function day6() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating the parts...").start();
    const part2Log = ora("").start();
    let part1 = 0;
    let part2 = 0;
    const lines: string[] = [];

    for await (const line of readLinesIterator(inputFile)) {
        lines.push(line)
    }

    const grid = lines.map(l => l.padEnd(Math.max(...lines.map(l => l.length))), " ");
    const problems: number[][] = [];
    let inProblem = false;
    let start = 0;

    for (let col = 0; col < Math.max(...lines.map(l => l.length)); col++) {
        let empty = false;
        for (let row = 0; row < lines.length; row++) {
            if (grid[row]![col] !== " ") {
                empty = true;
                break;
            }
        }

        if (empty && !inProblem) {
            inProblem = true;
            start = col;
        } else if (!empty && inProblem) {
            inProblem = false;
            problems.push([start, col - 1])
        }
    }

    if (inProblem) {
        problems.push([start, Math.max(...lines.map(l => l.length)) - 1])
    }

    for (const [cStart, cEnd] of problems) {
        const values: number[] = [];
        for (let row = 0; row < lines.length - 1; row++) {
            const slice = grid[row]?.slice(cStart, cEnd! + 1).trim();
            if (slice !== "") {
                const n = Number(slice);
                if (!Number.isNaN(n)) values.push(n);
            }
        }

        const op = grid[lines.length - 1]?.slice(cStart, cEnd! + 1).trim();
        let res = values[0];
        for (let i = 1; i < values.length; i++) res = eval(`${res} ${op} ${values[i]}`)

        part1 += res!;
    }

    for (const [cStart, cEnd] of problems) {
        const values: number[] = [];

        for (let col = cStart; col! <= cEnd!; col!++) {
            let hasDigit = false;
            let digits = "";

            for (let row = 0; row < lines.length - 1; row++) {
                const ch = grid[row]![col!];
                if (ch! >= "0" && ch! <= "9") {
                    digits += ch;
                    hasDigit = true;
                }
            }

            if (hasDigit) values.push(Number(digits));
        }

        values.reverse()

        const op = grid[lines.length - 1]?.slice(cStart, cEnd! + 1).trim();
        let res = values[0];
        for (let i = 1; i < values.length; i++) res = eval(`${res} ${op} ${values[i]}`)
        part2 += res!;
    }

    part1Log.stopAndPersist({
        text: "- Part 1 result: " + part1
    })
    part2Log.stopAndPersist({
        text: "- Part 2 result: " + part2
    })
}