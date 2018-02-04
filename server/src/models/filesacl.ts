import * as fs from "fs";
import { FilesAC } from "../../../common/interfaces";

export function getFilesACL(): FilesAC[] {
    const data: string = fs.readFileSync("./config/filesacl.json", "utf-8");
    return JSON.parse(data);
}

export function setFilesACL(filesACL: FilesAC[]): void {
    fs.writeFileSync("./config/filesacl.json", JSON.stringify(filesACL), "utf-8");
}