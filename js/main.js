import { tad, shape } from "../lib/TeachAndDraw.js";
import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";

tad.use(update);
tad.debug = true;

const unit = 64;
tad.w = 640;
tad.h = 640;

// --------- Define Menus ------------------
const MAIN_MENU = 0;
let game_state = MAIN_MENU;


const environment = new EnvironmentManager(unit);
const player = new PlayerManager("player1", 40, 50);

tad.use(update);
tad.debug = true;

function update() {
    environment.update();
    player.update();
    
}
