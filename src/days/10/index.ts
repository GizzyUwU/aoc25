import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";
import { python } from "bun_python";

export default async function day7() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating...").start();
    const part2Log = ora("").start();
    const z3 = python.import("z3");
    const { Optimize, Int, Sum, And, IntVal } = z3;
    let part1 = 0;
    let part2 = 0;

    for await (const line of readLinesIterator(inputFile)) {
        const t = line.trim();
        if (!t) continue;
        const pattern = t.match(/\[(.*?)\]/)?.[1] ?? "";
        const target = [...pattern].map(char => (char === "#" ? 1 : 0));
        const buttonMatches = [...t.matchAll(/\((.*?)\)/g)];
        const buttons = buttonMatches.map(m => {
            if (!m[1]?.trim()) return [];
            return m[1].split(",").map(v => Number(v.trim()));
        })

        const arr: number[][] = Array.from({ length: target.length }, () => Array(buttons.length).fill(0));
        buttons.forEach((toggles, j) => {
            toggles.forEach(i => {
                if (i >= 0 && i < target.length) arr[i]![j] = 1;
            })
        })

        const mat = arr.map((row, i) => [...row, target[i]]);
        let rank = 0;
        const where = Array(buttons.length).fill(-1);
        for (let col = 0; col < buttons.length && rank < target.length; col++) {
            let sel = rank;
            while (sel < target.length && mat[sel]![col] === 0) sel++;
            if (sel === target.length) continue;
            const temp = mat[rank]!;
            mat[rank] = mat[sel]!;
            mat[sel] = temp;
            where[col] = rank;
            for (let i = 0; i < target.length; i++) {
                if (i === rank) continue;
                if (mat[i]![col] === 1) {
                    for (let j = col; j <= buttons.length; j++) {
                        mat[i]![j]! ^= mat[rank]![j]!;
                    }
                }
            }

            rank++
        }

        for (let i = rank; i < target.length; i++) {
            if (mat[i]![buttons.length] === 1) return null;
        }

        const freeVars = [];
        for (let j = 0; j < buttons.length; j++) {
            if (where[j] === -1) freeVars.push(j);
        }

        let best = Infinity;
        const totalComb = 1 << freeVars.length;
        for (let mask = 0; mask < totalComb; mask++) {
            const freeAssignment = freeVars.map((_, i) => (mask >> i) & 1);
            const x = Array(buttons.length).fill(0);
            for (let k = 0; k < freeVars.length; k++) {
                x[freeVars[k]!] = freeAssignment[k]
            }
            for (let j = 0; j < buttons.length; j++) {
                if (where[j] !== -1) {
                    const row = where[j];
                    let sum = mat[row]![buttons.length] ?? 0;
                    for (let k = j + 1; k < buttons.length; k++) {
                        sum ^= (mat[row]![k]! & x[k]);
                    }
                    x[j] = sum;
                }
            }
            const hamming = x.reduce((s, v) => s + v, 0);
            if (hamming < best) best = hamming
        }
        part1 += best
        
        const joltageMatch = t.match(/\{(.*?)\}/)?.[1];
        const targetPart2 = joltageMatch
            ? joltageMatch.split(",").map(v => Number(v.trim()))
            : [];

        if (targetPart2.length > 0) {
            const opt = Optimize();
            const matrices = buttons.map(btn => {
                const row = Array(targetPart2.length).fill(0);
                for (const i of btn) {
                    if (i >= 0 && i < targetPart2.length) row[i] = 1;
                }
                return row;
            });

            const coeffs = buttons.map((_, i) => Int(`p${i}`));
            const eqs = [];

            for (let r = 0; r < targetPart2.length; r++) {
                const terms = [];
                for (let j = 0; j < coeffs.length; j++) {
                    const matVal = matrices[j]![r];
                    if (matVal === 1) terms.push(coeffs[j]);
                }

                if (terms.length > 0) {
                    const targetVal = IntVal(targetPart2[r]);
                    eqs.push(Sum(...terms).__eq__(targetVal));
                } else if (targetPart2[r] !== 0) return;
            }

            for (const c of coeffs) {
                eqs.push(c.__ge__(IntVal(0)));
            }

            opt.add(And(...eqs));
            const presses = Int("presses");
            opt.add(presses.__eq__(Sum(...coeffs)));
            opt.minimize(presses);

            const result = opt.check();
            if (result.toString() !== "sat") return;
            const model = opt.model();
            const evaluated = model.eval(presses);
            part2 += Number(evaluated.as_long());
        }
    }

    part1Log.stopAndPersist({ text: "- Part 1 result: " + part1 });
    part2Log.stopAndPersist({ text: "- Part 2 result: " + part2 });
}