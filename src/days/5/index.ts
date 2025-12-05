import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";

export default async function day4() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating the parts...").start();
    const part2Log = ora("").start();
    let parsingRanges = true;
    const ranges: Array<{ start: number; end: number }> = [];
    const ids: number[] = [];
    let part1 = 0;
    let part2 = 0;
    for await (const line of readLinesIterator(inputFile)) {
        const trimmed = line.trim();
        if (trimmed === "") {
            parsingRanges = false;
            continue;
        }

        if (parsingRanges) {
            const [a, b] = trimmed.split("-").map(Number);
            if (!a || !b) continue;
            ranges.push({ start: a, end: b });
        } else {
            ids.push(Number(trimmed));
        }
    }


    for (const id of ids) {
        const fresh = ranges.some(r => id >= r.start && id <= r.end);
        if (fresh) part1++
    }

    const sorted = ranges.slice().sort((a, b) => a.start - b.start);
    const merged: Array<{ start: number; end: number }> = [];
    for (const r of sorted) {
        if(merged.length === 0) {
            merged.push({ ...r });
            continue;
        }

        const last = merged[merged.length - 1];
        if(!last) continue;
        if(r.start <= last.end + 1) {
            last.end = Math.max(last.end, r.end);
        } else {
            merged.push({ ...r });
        }
    }

    for (const m of merged) {
        part2 += (m.end - m.start + 1);
    }
    
    part1Log.stopAndPersist({
        text: "- Part 1 result: " + part1
    })
    part2Log.stopAndPersist({
        text: "- Part 2 result: " + part2
    })
}