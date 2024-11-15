import { Command } from "@cliffy/command";
import { Confirm, prompt } from "@cliffy/prompt";
import { container } from "../../dependency-injection/bind.inversify.ts";
import { PathProvider } from "../../services/PathProvider.ts";
import { colors } from "@cliffy/ansi/colors";

export function createPruneDbCommand() {
    return new Command()
        .description("Clear local database")
        .option("-v, --verbose", "Includes more information", {
            default: false,
            required: false,
        })
        .action(onAction);
}

async function onAction({ verbose }: { verbose: boolean }) {
    const result = await prompt([{
        name: "shouldPrune",
        message: "Are you sure you want to prune the database?",
        type: Confirm,
        hideDefault: false,
        hint:
            "This deletes the tasks.json file in your home directory, thus all your tasks will be gone irreversibly.",
        default: false,
    }]);

    if (result.shouldPrune) {
        try {
            await Deno.remove(
                container.resolve(PathProvider).getAppDirectory(),
                {
                    recursive: true,
                },
            );
            console.log(colors.brightGreen("removed everything!"));
        } catch (e) {
            if (e instanceof Deno.errors.NotFound) {
                console.warn(colors.brightRed("The file does not exist."));
                if (verbose && e.stack != null) {
                    console.info(colors.red(e.stack));
                }
            }
        }
    }
}
