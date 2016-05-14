import Application from "../../kernel/Application";
import {bindGenerator, isGenerator} from "../../utils/GeneratorUtil";
import colors from "colors";
import minimist from "minimist";
import CommandCompilerPass from "./DependencyInjection/Compiler/CommandCompilerPass";

/**
 * Console bundle
 */
export default class Bundle
{
    /**
     * Constructor
     */
    constructor()
    {
        // Initialize properties
        this.application;
        this.container;
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath()
    {
        return __dirname;
    }

    /**
     * Initialize the bundle
     *
     * @param   {solfegejs/kernel/Application}  application     Solfege application
     */
    *initialize(application)
    {
        this.application = application;

        // Listen the application start
        this.application.on(Application.EVENT_START, bindGenerator(this, this.onStart));
    }

    /**
     * Configure service container
     *
     * @param   {Container}     container       Service container
     */
    *configureContainer(container)
    {
        this.container = container;

        // Add the compiler pass that handle command tags
        this.container.addCompilerPass(new CommandCompilerPass());
    }

    /**
     * The application is started
     *
     * @param   {solfege/kernel/Application}    application     The application
     * @param   {Array}                         parameters      The parameters
     */
    *onStart(application, parameters)
    {
        // Get commands
        let commandsRegistry = yield this.container.get("solfege_console_commands_registry");
        let commands = commandsRegistry.getCommands();

        // Configure commands
        // and create a map
        let commandMap = new Map;
        for (let command of commands) {
            // Check signature requirements
            if (!isGenerator(command.configure)) {
                throw new Error(`Command must implement "configure" method.`);
            }
            if (typeof command.getName !== "function") {
                throw new Error(`Command must implement "getName" method.`);
            }

            yield command.configure();
            let name = command.getName();
            commandMap.set(name, command);
        }

        // Check if the user executes a command
        if (parameters.length > 0) {
            let commandName = parameters[0];

            if (commandMap.has(commandName)) {
                let command = commandMap.get(commandName);

                // Execute the command
                yield command.execute();
                return;
            }
        }


        // Display the header
        let title = "SolfegeJS CLI";
        console.info(title.bgBlack.cyan);
        console.info("-".repeat(title.length).bgBlack.cyan+"\n");

        // Display command list
        yield this.displayAvailableCommands(commands);
    }

    /**
     * Display available commands
     *
     * @param   {Set}   commands    Commands
     */
    *displayAvailableCommands(commands:Set)
    {
        for (let command of commands) {
            let name = command.getName();
            let description = command.getDescription();

            console.info(`${name.green}   ${description}`);
        }
    }
}
