/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from "chalk";

class Logger {
    info(...messages: any[]) {
        console.log(
            "[ " +
                new Date().toLocaleTimeString() +
                " ] - " +
                chalk.cyanBright("[INFO] - ", ...messages)
        );
    }

    warn(...messages: any[]) {
        console.warn(
            "[ " +
                new Date().toLocaleTimeString() +
                " ] - " +
                chalk.yellowBright("[WARNING] - ", ...messages)
        );
    }

    error(...messages: any[]) {
        console.error(
            "[ " +
                new Date().toLocaleTimeString() +
                " ] - " +
                chalk.redBright("[ERROR] - ", ...messages)
        );
    }

    debug(...messages: any[]) {
        console.debug(
            "[ " +
                new Date().toLocaleTimeString() +
                " ] - " +
                chalk.blueBright("[DEBUG] - ", ...messages)
        );
    }
}

export const logger = new Logger();
