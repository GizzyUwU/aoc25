import { select } from '@inquirer/prompts';
import fs from "fs/promises";
import path from "path";
import ora from 'ora';
async function getAllDays(dir: string, baseDir = dir, topLevel = true): Promise<{ name: string; value: { name: string; file: string } }[]> {
    const entries = await fs.readdir(dir);
    const choices: { name: string; value: { name: string; file: string } }[] = [];
    if (topLevel && !choices.find((p) => p.name === "All")) {
        choices.push({ name: "All", value: { name: dir, file: "all" } });
    }

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const fileStat = await fs.stat(fullPath);

        if (fileStat.isDirectory()) {
            const subChoices = await getAllDays(fullPath, baseDir, false);
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
    message: "Select an Advent of Code day:",
    choices
});


if (day.file === "all") {
    console.time("All days finished their calculations.")
    for (const choice of choices) {
        if (choice.name === "All") continue;
        const fullPath = path.resolve(daysDir, choice.value.file);
        const dayModule = await import(fullPath);

        if (typeof dayModule.default === "function") {
            const now = new Date();
            const time = now.toTimeString().split(" ")[0];
            console.info(`\x1b[90m[${time}]\x1b[0m Day ${choice.name} has started running.`)
            console.time(`Day ${choice.name} finished its calculations.`);
            await dayModule.default();
            console.timeEnd(`Day ${choice.name} finished its calculations.`);
        } else {
            console.warn(`Module ${choice.name} does not export a default function`);
        }
    }
    console.timeEnd("All days finished their calculations.")
} else {
    const fullPath = path.resolve(daysDir, day.file);
    const dayModule = await import(fullPath);
    if (typeof dayModule.default === "function") {
        const now = new Date();
        const time = now.toTimeString().split(" ")[0];
        console.info(`\x1b[90m[${time}]\x1b[0m Day ${day.name} has started running.`)
        console.time("Day " + day.name + " finished its calculations.")
        await dayModule.default();
        console.timeEnd("Day " + day.name + " finished its calculations.")
    } else {
        console.warn("Selected module does not export a default function");
    }
}