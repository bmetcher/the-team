import { tad, load } from "../lib/TeachAndDraw.js";
import { EnemyManager } from "./enemy_manager.js";

import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";

const unit = 64;
tad.w = 640;
tad.h = 640;


// ---- Define Menus ----
const MAIN_MENU = 0;
let game_state = MAIN_MENU;


// ---- Preload Assets ----
// Player images
const all_players_images = {
    player1: load.image(0,0,"./images/player/player1.png"),
    player2: load.image(0,0,"./images/player/player2.png")
}
// Ammo images
const all_ammo_images = {
    bullet: load.image(0,0,"./images/ammo/bullet.png"),
    missile: load.image(0,0,"./images/ammo/missile.png")
}
// Enemy images
const all_enemy_images = {
    grunt: load.image(0,0, "./images/enemies/enemy1.png")
}
// Ship-Ammo data
const all_ships_ammo_data = load.json("./data/ammo_map.json");


// ---- Start Background Environment ----
const environment = new EnvironmentManager(unit);

// ---- Initialise Player and Enemies ----
const player = new PlayerManager("player1", all_players_images, all_ammo_images, all_ships_ammo_data);
const enemy = new EnemyManager(unit, all_enemy_images);

tad.use(update);
tad.debug = true;

function update() {
    environment.update();
    player.update();
    enemy.update();
    
}
