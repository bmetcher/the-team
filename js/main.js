import { tad, load, time } from "../lib/TeachAndDraw.js";
import { EnemyManager } from "./enemy_manager.js";
import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";
import { ProjectileManager } from "./projectile_manager.js";


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
    default_ship: load.image(0,0,"./images/player/default_ship.png"),
    tank_ship: load.image(0,0,"./images/player/tank_ship.png")  // Added the ships here with correct names
}

// Ammo images
const all_ammo_images = {
    bullet: load.image(0,0,"./images/ammo/bullet.png"),
    missile: load.image(0,0,"./images/ammo/missile.png")
}

// Enemy images
const all_enemy_images = {
    grunt: load.image(0,0, "./images/enemies/grunt.png"),
    enemy2: load.image(0,0, "./images/enemies/enemy2.png"),
}
// Environment images
const all_environment_images = {
    space1: load.image(tad.w/2, 0, "./images/background/space1.jpeg"),
    space2: load.image(tad.w/2, tad.h, "./images/background/space2.jpeg")
}

// Animations
const all_explosions = {
    player: load.animation(0,0,
        "./images/explosions/player_explosion_animation/step_1.png",
        // "./images/explosions/player_explosion_animation/step_2.png",
        // "./images/explosions/player_explosion_animation/step_3.png",
        // "./images/explosions/player_explosion_animation/step_4.png",
        // "./images/explosions/player_explosion_animation/step_5.png",
        // "./images/explosions/player_explosion_animation/step_6.png",
        // "./images/explosions/player_explosion_animation/step_7.png",
        // "./images/explosions/player_explosion_animation/step_8.png"
    ),
    grunt: load.animation(0,0,
        "./images/explosions/enemy_explosion_animation/step_1.png",
        "./images/explosions/enemy_explosion_animation/step_2.png",
        "./images/explosions/enemy_explosion_animation/step_3.png",
        "./images/explosions/enemy_explosion_animation/step_4.png",
        // "./images/explosions/enemy_explosion_animation/step_5.png",
        // "./images/explosions/enemy_explosion_animation/step_6.png",
        // "./images/explosions/enemy_explosion_animation/step_7.png",
        // "./images/explosions/enemy_explosion_animation/step_8.png"
    )
}

// Files
const files = {
    all_ammo_data: load.json("./data/ammo_map.json"),
    all_ship_data: load.json("./data/ships_map.json"),  // Seperated into seperate JSON files
    all_enemies_data: load.json("./data/enemies_map.json")
}


// Declare manager variables
let environment, player, enemies, projectiles;

// Asset loading & manager initialization
function initial_setup() {

    if (time.frameCount === 0) {
        // check if all JSON assets are loaded
        if (files.all_ship_data && files.all_ammo_data) {
            // Create managers AFTER data has loaded
            console.log("Assets loaded! Initializing game...");

            // ---- Start Background Environment ----
            environment = new EnvironmentManager(unit, all_environment_images);

            // ---- Initialise Player and Enemies ----
            player = new PlayerManager("default_ship", all_players_images, files.all_ship_data);  // updated for new parameters
            enemies = new EnemyManager(all_enemy_images, files.all_enemies_data);

            // ---- Initialize Projectiles -----
            projectiles = new ProjectileManager(unit, files.all_ammo_data, files.all_enemies_data, all_ammo_images, all_explosions);

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

