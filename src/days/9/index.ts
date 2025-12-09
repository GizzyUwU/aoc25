import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";

export default async function day7() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating...").start();
    const part2Log = ora("").start();
    type tile = {
        x: number;
        y: number;
    }

    const redTiles: tile[] = [];
    let part1 = 0;
    let part2 = 0;

    for await (const line of readLinesIterator(inputFile)) {
        const t = line.trim();
        if (!t) continue;
        const [x, y] = t.split(",").map(Number);
        if (!x || !y) continue;
        redTiles.push({ x, y });
    }

    function makePolygon(points: tile[]) {
        const shift = points.slice();
        shift.push(shift.shift()!);
        return points.map((p, i) => [p, shift[i]] as const);
    }

    function intersect(a: tile, b: tile, c: any, d: tile) {
        const ccw = (a: tile, b: tile, c: tile) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
        return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
    }

    const segments = makePolygon(redTiles);

    function invalid(iTile: tile, jTile: tile) {
        let corners = [
            { y: iTile.y, x: iTile.x },
            { y: iTile.y, x: iTile.x - (iTile.x - jTile.x) },
            { y: iTile.y - (iTile.y - jTile.y), x: iTile.x },
            { y: jTile.y, x: jTile.x }
        ].sort((a, b) => a.y - b.y || a.x - b.x) as [tile, tile, tile, tile];
        const innerCorners = [
            { y: corners[0].y + 1, x: corners[0]!.x + 1 },
            { y: corners[1].y + 1, x: corners[1]!.x - 1 },
            { y: corners[2]!.y - 1, x: corners[2]!.x + 1 },
            { y: corners[3]!.y - 1, x: corners[3]!.x - 1 }
        ];

        const innerEdges = makePolygon(innerCorners);
        for (const [a, b] of innerEdges) {
            if (!a || !b) continue;
            let hits = 0;
            for (const [c, d] of segments) {
                if (!c || !d) continue;
                if (intersect(a, b, c, d)) hits++;
            }
            if (hits > 0) return true;
        }

        return false;
    }

    for (let i = 0; i < redTiles.length; i++) {
        for (let j = i + 1; j < redTiles.length; j++) {
            const iTile = redTiles[i];
            const jTile = redTiles[j];
            if (!iTile || !jTile) continue;
            const area = (Math.abs(iTile.y - jTile.y) + 1) * (Math.abs(iTile.x - jTile.x) + 1);
            part1 = Math.max(part1, area);
            if (area > part2 && !invalid(iTile, jTile)) part2 = area;
        }
    }

    part1Log.stopAndPersist({ text: "- Part 1 result: " + part1 });
    part2Log.stopAndPersist({ text: "- Part 2 result: " + part2 });
}
