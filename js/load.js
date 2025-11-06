import {tad, load} from "../lib/TeachAndDraw.js";

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
    ice_enemy: load.image(0,0, "./images/enemies/ice_enemy.png"),
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
    const all_ammo_data = load.json("./data/ammo_map.json");
    const all_ship_data = load.json("./data/ships_map.json"); // Seperated into seperate JSON files
    const all_enemies_data = load.json("./data/enemies_map.json");

const assets = { 
    all_players_images, all_ammo_images, 
    all_explosions,
    all_enemy_images, all_environment_images,
    all_ammo_data, all_ship_data, all_enemies_data
};

export {assets};