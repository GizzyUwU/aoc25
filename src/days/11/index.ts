import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";

export default async function day7() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating...").start();
    const part2Log = ora("").start();
    const graph = new Map<string, string[]>();
    let part1 = 0;
    let part2 = 0;

    for await (const line of readLinesIterator(inputFile)) {
        const t = line.trim();
        if (!t) continue;
        const [dev, output] = t.split(":");
        if (!dev || !output) continue;
        const outputs = output.trim().split(/\s+/)
        graph.set(dev.trim(), outputs)
    }

    function countPaths(current: string, target: string, visited: Set<string>): number {
        if (current === target) return 1;
        const outputs = graph.get(current);
        if (!outputs) return 0;
        let totalPaths = 0;

        for (const next of outputs) {
            if (!visited.has(next)) {
                visited.add(next);
                totalPaths += countPaths(next, target, visited);
                visited.delete(next);
            }
        }

        return totalPaths;
    }

    const visited = new Set<string>();
    visited.add("you");
    part1 = countPaths("you", "out", visited)

    const memo = new Map<string, number>();
    function countSpecialPaths(
        current: string,
        seenDac: boolean,
        seenFft: boolean
    ): number {
        if (current === "out") return (seenDac && seenFft) ? 1 : 0;
        const outputs = graph.get(current);
        if (!outputs) return 0;

        const key = `${current}|${seenDac}|${seenFft}`;
        if (memo.has(key)) return memo.get(key)!;

        let total = 0;

        for (const next of outputs) {
            const nextDac = seenDac || next === "dac";
            const nextFft = seenFft || next === "fft";
            total += countSpecialPaths(next, nextDac, nextFft);
        }

        memo.set(key, total);
        return total;
    }

    part2 = countSpecialPaths("svr", false, false);

    part1Log.stopAndPersist({ text: "- Part 1 resulht: " + part1 });
    part2Log.stopAndPersist({ text: "- Part 2 result: " + part2 });
}