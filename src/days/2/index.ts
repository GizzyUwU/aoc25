import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";

function repeated(id: string, minRepeats: number, maxRepeats?: number): boolean {
    if (id.startsWith("0")) return false;
    for (let chunk = 1; chunk <= Math.floor(id.length / 2); chunk++) {
        if (id.length % chunk !== 0) continue;
        const repeats = id.length / chunk;
        if (repeats < minRepeats) continue;
        if (maxRepeats && repeats > maxRepeats) continue;
        const piece = id.slice(0, chunk);
        if (piece.startsWith("0")) continue;
        if (piece.repeat(repeats) === id) return true;
    }

    return false;
}

export default async function day2() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating the parts...").start();
    const part2Log = ora("").start();
    let part1 = 0;
    let part2 = 0;

    for await (const line of readLinesIterator(inputFile)) {
        if (!line.trim()) continue;
        const ranges = line.trim().split(",");

        for (const r of ranges) {
            const [startStr, endStr] = r.split("-");
            const start = Number(startStr);
            const end = Number(endStr);

            for (let n = start; n <= end; n++) {
                const id = String(n);
                if (repeated(id, 2, 2)) {
                    part1 += n;
                }
                if (repeated(id, 2)) {
                    part2 += n;
                }
            }
        }
    }

    part1Log.succeed("Part 1 sum: " + part1);
    part2Log.succeed("Part 2 sum: " + part2);
}