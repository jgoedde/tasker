import "reflect-metadata";
import { installDependencies } from "./dependency-injection/bind.inversify.ts";
import { Command } from "@cliffy/command";
import { registerCommands } from "./cli/registerCommands.ts";

installDependencies();

const program = new Command()
    .name("tasker")
    .version("1.0.0")
    .description("A simple task management CLI");

registerCommands(program);

await program.parse(Deno.args);
