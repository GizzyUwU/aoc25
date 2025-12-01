import readLinesIterator from "../../lib/readLines";
import path from "node:path";

export default async function day1() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    let dial1 = 50;
    let dial2 = 50;
    let part1 = 0;
    let part2 = 0;
    for await (const line of readLinesIterator(inputFile)) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const direction = trimmed[0];
        const distance = parseInt(trimmed.slice(1), 10);
        if (direction === "R") dial1 = (dial1 + distance) % 100;
        else if (direction === "L") dial1 = (dial1 - distance + 100) % 100;
        else continue;

        if (dial1 === 0) part1++;
        if (direction === "R") {
            for (let i = 1; i <= distance; i++) {
                if ((dial2 + i) % 100 === 0) part2++;
            }
            dial2 = (dial2 + distance) % 100;
        } else if (direction === "L") {
            for (let i = 1; i <= distance; i++) {
                if ((dial2 - i + 100) % 100 === 0) part2++;
            }
            dial2 = (dial2 - distance + 100) % 100;
        }
    }

    console.log("Password for part 1:", part1);
    console.log("Password for part 2:", part2);
}