import { select } from '@inquirer/prompts';
import fs from "fs/promises";
import path from "path";

async function getAllDays(dir: string, baseDir = dir): Promise<{ name: string; value: { name: string; file: string } }[]> {
    const entries = await fs.readdir(dir);
    const choices: { name: string; value: { name: string; file: string } }[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const fileStat = await fs.stat(fullPath);

        if (fileStat.isDirectory()) {
            const subChoices = await getAllDays(fullPath, baseDir);
            choices.push(...subChoices);
        } else if (entry.endsWith(".ts") || entry.endsWith(".js")) {
            const relativeDir = path.relative(baseDir, dir);
            const relativeFile = path.join(relativeDir, entry);
            choices.push({
                name: relativeDir,
                value: { name: relativeDir, file: relativeFile },
            });
        }
    }

    return choices;
}


const daysDir = path.join(import.meta.dir, "days");
const choices = await getAllDays(daysDir);

const day = await select<{ name: string; file: string }>({
    message: "Choose an AOC 25 day:",
    choices
});

const fullPath = path.resolve(daysDir, day.file);
const dayModule = await import(fullPath);

if (typeof dayModule.default === "function") {
    await dayModule.default();
} else {
    console.warn("Selected module does not export a default function");
}