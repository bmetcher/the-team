import { tad, load, time } from "../lib/TeachAndDraw.js";
import { EnemyManager } from "./enemy_manager.js";
import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";
import { ProjectileManager } from "./projectile_manager.js";
import { assets } from "./load.js";

// ---- Game Size ----
const unit = 64;
tad.w = 720;
tad.h = 1080;

// ---- Preload Assets ----
const all_players_images = assets.all_players_images;
const all_ammo_images = assets.all_ammo_images;
const all_explosions = assets.all_explosions;
// const all_effects = assets.all_effects;
const all_enemy_images = assets.all_enemy_images;
const all_environment_images = assets.all_environment_images;
const all_ammo_data = assets.all_ammo_data;
const all_ship_data = assets.all_ship_data;
const all_enemy_data = assets.all_enemies_data;


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


// Declare manager variables
let environment, player, enemies, projectiles;

// Asset loading & manager initialization
function initial_setup() {

    if (time.frameCount === 0) {
        // check if all JSON assets are loaded
        if (all_ship_data && all_ammo_data) {
            // Create managers AFTER data has loaded
            console.log("Assets loaded! Initializing game...");

            // ---- Start Background Environment ----
            environment = new EnvironmentManager(unit, all_environment_images);

            // ---- Initialise Player and Enemies ----
            player = new PlayerManager("default_ship", all_players_images, all_ship_data);  // updated for new parameters
            enemies = new EnemyManager(all_enemy_images, all_enemy_data);

            // ---- Initialize Projectiles -----
            projectiles = new ProjectileManager(unit, all_ammo_data, all_enemy_data, all_ammo_images, all_explosions);

            // ?? Set game state here ??
            // game_state = MAIN_MENU;
        }
        return; // skip until it's loaded
    }
}


tad.use(update);
tad.debug = true;


// Main draw loop
function update() {
    initial_setup();
    
    environment.update();
    projectiles.update(player, enemies);

    player.update();
    enemies.update();
}

