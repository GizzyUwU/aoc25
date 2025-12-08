import readLinesIterator from "../../lib/readLines";
import path from "node:path";
import ora from "ora";

export default async function day7() {
    const inputFile = path.join(import.meta.dir, "input.txt");
    const part1Log = ora("Calculating the parts...").start();
    const part2Log = ora("").start();
    const coords: [number, number, number][] = [];
    let part1 = 0;
    let part2 = 0;

    for await (const line of readLinesIterator(inputFile)) {
        if (!line.trim()) continue;
        const parts = line.split(",").map(s => Number(s.trim()));
        if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) continue;
        coords.push([parts[0]!, parts[1]!, parts[2]!]);
    }

    const edges: { a: number, b: number, dist: number }[] = [];
    for (let i = 0; i < coords.length; i++) {
        const [x, y, z] = coords[i]!;
        for (let j = i + 1; j < coords.length; j++) {
            const [x2, y2, z2] = coords[j]!;
            const dx = x - x2;
            const dy = y - y2;
            const dz = z - z2;
            edges.push({ a: i, b: j, dist: Math.sqrt((dx * dx) + (dy * dy) + (dz * dz)) })
        }
    }

    edges.sort((a, b) => a.dist - b.dist);

    const parent = Array.from({ length: coords.length }, (_, i) => i);
    const size = Array.from({ length: coords.length }, () => 1);

    const find = (x: number): number => {
        let p = parent[x]!;
        while (p !== x) {
            const pp = parent[p]!;
            parent[x] = pp;
            x = pp;
            p = parent[x]!;
        }
        return x;
    };

    const unite = (a: number, b: number): boolean => {
        let ra = find(a);
        let rb = find(b);
        if (ra === rb) return false;

        if (size[ra]! < size[rb]!) {
            parent[ra] = rb;
            size[rb]! += size[ra]!;
        } else {
            parent[rb] = ra;
            size[ra]! += size[rb]!;
        }
        return true;
    };

    for (let i = 0; i < Math.min(1000, edges.length); i++) {
        unite(edges[i]!.a, edges[i]!.b);
    }

    const counts = new Map<number, number>();
    for (let i = 0; i < coords.length; i++) {
        const r = find(i);
        counts.set(r, (counts.get(r) ?? 0) + 1)
    }

    const sorted = [...counts.values()].sort((a, b) => b - a);
    part1 = sorted[0]! * sorted[1]! * sorted[2]!

    for (let i = 0; i < coords.length; i++) parent[i] = i;
    for (let i = 0; i < coords.length; i++) size[i] = 1;
    let components = coords.length;
    let lastA = -1;
    let lastB = -1;
    for (const e of edges) {
        if(unite(e.a, e.b)) {
            components--;
            if(components === 1) {
                lastA = e.a;
                lastB = e.b;
                break;
            }
        }
    }

    const x1 = coords[lastA]![0];
    const x2 = coords[lastB]![0];
    part2 = x1 * x2;

    part1Log.stopAndPersist({
        text: "- Part 1 result: " + part1
    })
    part2Log.stopAndPersist({
        text: "- Part 2 result: " + part2
    })
}