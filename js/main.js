import { tad, load } from "../lib/TeachAndDraw.js";
import { EnemyManager } from "./enemy_manager.js";

import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";

const unit = 64;
tad.w = 640;
tad.h = 640;


// ---- Define Screens ----
const LOADING = 0;      // pre-loading assets
const MAIN_MENU = 1;    // player selects start OR navigates to HELP OR navigates to LEADERBOARD
const SELECT_SHIP = 2;  // after player selects "GET READY TO PLAY", must select a ship (has default ship); has "PLAY" button
const LEADERBOARD = 3;  // scores so far + stored; accessible from MAIN_MENU or PAUSED
const HELP = 4;         // explains game controls, goals, ship options, and enemies; accessible from MAIN_MENU or PAUSED
const GAME = 5;         // actual game
const PAUSED = 6;       // pauses game. Provides buttons to access "LEADERBOARD" and "HELP"
const END_GAME = 7;     // after game ends, display encouraging message and score; provides "REPLAY" or "RETURN TO MAIN MENU"
let game_state = LOADING;


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
