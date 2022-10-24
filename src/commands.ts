import { readdirSync } from "fs";
import path from "path";
import { ICommand } from "./ICommand";

const files: string[] = readdirSync(path.resolve(__dirname, "commands")).filter((file: string) => file.endsWith(".ts"));
let cmds: ICommand[] = new Array<ICommand>();

for (const file of files) {
    import(path.resolve(__dirname, `commands/${file}`)).then((obj: any) => {
        cmds.push(obj[Object.keys(obj)[0]]);
    })
}

export const commands: ICommand[] = cmds;