import {
  Kernel,
  args,
  flags,
  BaseCommand,
  ListLoader,
  HelpCommand,
} from "@adonisjs/ace";

const kernel = Kernel.create();

class Configure extends BaseCommand {
  static commandName = "configure";
  static aliases = ["invoke"];
  static description = "Configure one or more AdonisJS packages";

  public async run() {}
}

class Build extends BaseCommand {
  static commandName = "build";
  static description =
    "Compile project from Typescript to Javascript. Also compiles the frontend assets if using webpack encore";
}

class Repl extends BaseCommand {
  static commandName = "repl";
  static description = "Start a new REPL session";
}

class Serve extends BaseCommand {
  static commandName = "serve";
  static description =
    "Start the AdonisJS HTTP server, along with the file watcher. Also starts the webpack dev server when webpack encore is installed";
}

class MakeController extends BaseCommand {
  @args.string({ description: "Name of the controller" })
  name!: string;

  @flags.boolean({ description: "Add resourceful methods", default: false })
  resource!: boolean;

  static commandName = "make:controller";

  static aliases = ["mc"];

  static description = "Make a new HTTP controller";
}

class MakeModel extends BaseCommand {
  static commandName = "make:model";
  static aliases = ["mm"];

  static description = "Make a new Lucid model";
}

class DbSeed extends BaseCommand {
  static commandName = "db:seed";

  static description = "Execute database seeders";
}

class DbTruncate extends BaseCommand {
  static commandName = "db:truncate";

  static description = "Truncate all tables in database";
}

class DbWipe extends BaseCommand {
  static commandName = "db:wipe";

  static description = "Drop all tables, views and types in database";
}

kernel.addLoader(
  new ListLoader([
    HelpCommand,
    Configure,
    Build,
    Serve,
    Repl,
    MakeController,
    MakeModel,
    DbSeed,
    DbTruncate,
    DbWipe,
  ])
);

kernel.addAlias("md", "make:model");
kernel.addAlias("start", "serve");

kernel.defineFlag("help", {
  type: "boolean",
  alias: "h",
  description:
    "Display help for the given command. When no command is given display help for the list command",
});

kernel.defineFlag("env", {
  type: "string",
  description: "The environment the command should run under",
});

kernel.defineFlag("ansi", {
  type: "boolean",
  showNegatedVariantInHelp: true,
  description: "Enable/disable colorful output",
});

kernel.on("ansi", (_, $kernel, options) => {
  if (options.flags.ansi === false) {
    $kernel.ui.switchMode("silent");
  }

  if (options.flags.ansi === true) {
    $kernel.ui.switchMode("normal");
  }
});

kernel.on("help", async (command, $kernel, options) => {
  options.args.unshift(command.commandName);
  await new HelpCommand($kernel, options, kernel.ui, kernel.prompt).exec();
  return true;
});

kernel.info.set("binary", "node ace");
kernel.info.set("Framework version", "9.1");
kernel.info.set("App version", "1.1.1");

await kernel.handle(process.argv.splice(2));
