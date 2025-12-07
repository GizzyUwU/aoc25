import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";

export default async function day7() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating the parts...").start();
    const part2Log = ora("").start();
    const lines: string[] = [];
    let part1 = 0;
    let part2 = 0;
    let startR = -1;
    let startC = -1;
    let splits = 0;
    let beamsCurrent = new Set<number>();
    let beamsTimeline = new Set<number>();

    for await (const line of readLinesIterator(inputFile)) {
        lines.push(line)
    }

    const grid = lines.map(l => l.padEnd(Math.max(...lines.map(l => l.length))), ".".split(""));
    for (let r = 0; r < lines.length; r++) {
        for (let c = 0; c < Math.max(...lines.map(l => l.length)); c++) {
            if (grid[r]![c] === "S") {
                startR = r;
                startC = c;
                break;
            }
        }
        break;
    }

    if (startR === -1) return;
    if (startR + 1 < lines.length) beamsCurrent.add(startC);
    if (startR + 1 < lines.length) beamsTimeline.add(startC);

    for (let r = startR + 1; r < lines.length; r++) {
        if (beamsCurrent.size === 0) break;
        let beams = new Set([...beamsCurrent].filter(c => c >= 0 && c < Math.max(...lines.map(l => l.length))));
        const processed = new Set<string>();
        while (true) {
            const newBeams = new Set<number>();
            for (const c of beams) {
                if (c < 0 || c >= Math.max(...lines.map(l => l.length))) continue;
                if (grid[r]![c] === "^") {
                    const key = r + "," + c;
                    if (!processed.has(key)) {
                        processed.add(key);
                        splits++;
                        if (c - 1 >= 0 && c - 1 < Math.max(...lines.map(l => l.length))) newBeams.add(c - 1);
                        if (c + 1 >= 0 && c + 1 < Math.max(...lines.map(l => l.length))) newBeams.add(c + 1);
                    }
                }
            }

            let add = false;
            for (const nb of newBeams) {
                if (!beams.has(nb)) {
                    beams.add(nb);
                    add = true;
                }
            }
            if (!add) break;
        }

        beamsCurrent = new Set([...beams].filter(c => grid[r]![c] !== "^"))
        part1 = splits;
    }

    function countT(r: number, c: number, memo = new Map<string, number>()): number {
        const key = r + "," + c;
        if (memo.has(key)) return memo.get(key)!;
        if (c < 0 || c >= Math.max(...lines.map(l => l.length))) return 0;
        if (r === lines.length - 1) return 1;
        let res = 0;
        if (grid[r]![c] === "^") {
            res =
                countT(r + 1, c - 1, memo) +
                countT(r + 1, c + 1, memo);
        } else {
            res = countT(r + 1, c, memo);
        }

        memo.set(key, res);
        return res;
    }

    part2 = countT(startR + 1, startC)

    part1Log.stopAndPersist({
        text: "- Part 1 result: " + part1
    })
    part2Log.stopAndPersist({
        text: "- Part 2 result: " + part2
    })
}