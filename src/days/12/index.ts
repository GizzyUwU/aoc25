import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";

export default async function day7() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating...").start();
    const part2Log = ora("").start();
    
    let part1 = 0;
    let part2 = 0;

    const lines: string[] = [];
    for await (const line of readLinesIterator(inputFile)) {
        lines.push(line);
    }

    const input = lines.join("\n")
        .replace(/\r/g, "")
        .split("\n\n")
        .filter(x => x.length > 0);

    const regionsSection = input.pop();
    if (!regionsSection) {
        part1Log.stopAndPersist({ text: "- Part 1 result: " + part1 });
        part2Log.stopAndPersist({ text: "- Part 2 result: " + part2 });
        return;
    }

    const regions = regionsSection.split("\n").filter(x => x.length > 0).map(x => {
        const [size, counts] = x.split(": ");
        const [width, height] = size!.split("x").map(x => parseInt(x));
        return { 
            counts: counts!.split(" ").map(x => parseInt(x)), 
            width: width!, 
            height: height! 
        }
    });

    const presents = input.map(x => x.split("\n").slice(1).join(""));

    for (const { counts, width, height } of regions) {
        let size = 0;
        for (let i = 0; i < presents.length; i++) {
            const cellCount = (presents[i]!.split("#").length - 1);
            size += cellCount * counts[i]!;
        }
        if (width * height >= size) {
            part1++;
        }
    }

    part1Log.stopAndPersist({ text: "- Part 1 result: " + part1 });
    part2Log.stopAndPersist({ text: "- Part 2 result: " + part2 });
}