import { tad, shape } from "../lib/TeachAndDraw.js";
import { EnvironmentManager } from "./environment_manager.js";

tad.use(update);
tad.debug = true;

console.log("hi")

const unit = 64;
tad.w = 640;
tad.h = 640;

const environment = new EnvironmentManager(unit);

tad.use(update);
tad.debug = true;

function update() {
    environment.update();
    
}
