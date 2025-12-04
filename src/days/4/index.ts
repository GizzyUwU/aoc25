import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";

export default async function day2() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating the parts...").start();
    const part2Log = ora("").start();
    let grid: string[][] = [];
    let part1 = 0;
    let part2 = 0;
    for await (const line of readLinesIterator(inputFile)) {
        grid.push(line.split(""))
    }

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0]!.length; x++) {
            if (grid[y]![x] !== "@") continue;
            if (!grid[0]) continue;
            let adj = 0;
            if (y > 0 && x > 0 && grid[y - 1]![x - 1] === "@") adj++;
            if (y > 0 && grid[y - 1]![x] === "@") adj++;
            if (y > 0 && x < grid[0]!.length - 1 && grid[y - 1]![x + 1] === "@") adj++;
            if (x > 0 && grid[y]![x - 1] === "@") adj++;
            if (x < grid[0]!.length - 1 && grid[y]![x + 1] === "@") adj++;
            if (y < grid.length - 1 && x > 0 && grid[y + 1]![x - 1] === "@") adj++;
            if (y < grid.length - 1 && grid[y + 1]![x] === "@") adj++;
            if (y < grid.length - 1 && x < grid.length - 1 && grid[y + 1]![x + 1] === "@") adj++;
            if (adj < 4) {
                part1++;
            }
        }
    }
    
    while (true) {
        const remove: [number, number][] = [];
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0]!.length; x++) {
                if (grid[y]![x] !== "@") continue;
                if (!grid[0]) continue;
                let adj = 0;
                if (y > 0 && x > 0 && grid[y - 1]![x - 1] === "@") adj++;
                if (y > 0 && grid[y - 1]![x] === "@") adj++;
                if (y > 0 && x < grid[0]!.length - 1 && grid[y - 1]![x + 1] === "@") adj++;
                if (x > 0 && grid[y]![x - 1] === "@") adj++;
                if (x < grid[0]!.length - 1 && grid[y]![x + 1] === "@") adj++;
                if (y < grid.length - 1 && x > 0 && grid[y + 1]![x - 1] === "@") adj++;
                if (y < grid.length - 1 && grid[y + 1]![x] === "@") adj++;
                if (y < grid.length - 1 && x < grid.length - 1 && grid[y + 1]![x + 1] === "@") adj++;
                if (adj < 4) {
                    remove.push([y, x])
                }
            }
        }

        if(remove.length === 0) break;
        for (const [y, x] of remove) {
            grid[y]![x] = ".";
        }

        part2 += remove.length;
    }
    part1Log.stopAndPersist({
        text: "- Part 1 result: " + part1
    })
    part2Log.stopAndPersist({
        text: "- Part 2 result: " + part2
    })
}