import * as fs from "fs";
import { Proxy } from "../../../common/interfaces";

export function getProxys(): Proxy[] {
    const data: string = fs.readFileSync("./config/proxys.json", "utf-8");
    return JSON.parse(data);
}

export function setProxys(proxys: Proxy[]): void {
    fs.writeFileSync("./config/proxys.json", JSON.stringify(proxys), "utf-8");
}