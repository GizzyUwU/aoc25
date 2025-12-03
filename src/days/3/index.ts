import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";

export default async function day2() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating the parts...").start();
    const part2Log = ora("").start();
    let part1 = 0;
    let part2 = 0;
    for await (const line of readLinesIterator(inputFile)) {
        const digits = line.trim().split("").map(Number);
        const n = digits.length;
        const maxRight = new Array(n).fill(0);
        const stack: number[] = [];
        let removals = n - 12;

        maxRight[n - 1] = digits[n - 1];
        for (let i = n - 2; i >= 0; i--) {
            maxRight[i] = Math.max(digits[i]!, maxRight[i + 1])
        }

        let best = -1;
        for (let i = 0; i < n - 1; i++) {
            const first = digits[i];
            if (first === undefined) return;
            const second = maxRight[i + 1];
            const value = first * 10 + second;
            if (value > best) best = value;
        }

        part1 += best;

        for (let i = 0; i < n; i++) {
            const d = digits[i]!;
            while (stack.length > 0 && removals > 0) {
                const last = stack[stack.length - 1];
                if (last! < d) {
                    stack.pop();
                    removals--;
                } else break;
            }

            stack.push(d)
        }

        while (removals > 0) {
            stack.pop();
            removals--;
        }

        const selected = stack.slice(0, 12);
        const num = BigInt(selected.join(""))
        part2 += Number(num)
    }

    part1Log.succeed("Part 1 sum: " + part1);
    part2Log.succeed("Part 2 sum: " + part2);
}