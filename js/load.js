import { tad, load } from "../lib/TeachAndDraw.js";

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

// Load an animation from a given directory with some amount of frames
function load_frames(directory, length) {
    return Array.from({length: length}, (_, i) =>
        `./images/${directory}/frame_${i}.png`
    );
}
// Animations
const all_explosions = {
    player_explosion: load.animation(0,0,
        "./images/explosions/player_explosion_animation/step_1.png",
        "./images/explosions/player_explosion_animation/step_2.png",
        "./images/explosions/player_explosion_animation/step_3.png",
        "./images/explosions/player_explosion_animation/step_4.png",
        "./images/explosions/player_explosion_animation/step_5.png",
        "./images/explosions/player_explosion_animation/step_6.png",
        "./images/explosions/player_explosion_animation/step_7.png",
        "./images/explosions/player_explosion_animation/step_8.png"
    ),
    enemy_explosion: load.animation(0,0,
        "./images/explosions/enemy_explosion_animation/step_1.png",
        "./images/explosions/enemy_explosion_animation/step_2.png",
        "./images/explosions/enemy_explosion_animation/step_3.png",
        "./images/explosions/enemy_explosion_animation/step_4.png",
        "./images/explosions/enemy_explosion_animation/step_5.png",
        "./images/explosions/enemy_explosion_animation/step_6.png",
        "./images/explosions/enemy_explosion_animation/step_7.png",
        "./images/explosions/enemy_explosion_animation/step_8.png"
    ),
}
// Effect Animations
const all_effects = {
    bubbles: load.animation(0,0, ...load_frames("effects/bubbles", 61)),
    casting: load.animation(0,0, ...load_frames("effects/casting", 73)),
    // emit: load.animation(0,0, ...load_frames("effects/emit", 31)),
    // felspell: load.animation(0,0, ...load_frames("effects/felspell", 91)),
    // fire: load.animation(0,0, ...load_frames("effects/fire", 61)),
    // firespin: load.animation(0,0, ...load_frames("effects/firespin", 61)),
    // flamelash: load.animation(0,0, ...load_frames("effects/flamelash", 46)),
    // freezing: load.animation(0,0, ...load_frames("effects/freezing", 86)),
    // magic8: load.animation(0,0, ...load_frames("effects/magic8", 61)),
    // magicka: load.animation(0,0, ...load_frames("effects/magicka", 41)),
    // midnight: load.animation(0,0, ...load_frames("effects/midnight", 61)),
    // nebula: load.animation(0,0, ...load_frames("effects/nebula", 61)),
    // phantom: load.animation(0,0, ...load_frames("effects/phantom", 61)),
    // protection: load.animation(0,0, ...load_frames("effects/protection", 61)),
    // spell: load.animation(0,0, ...load_frames("effects/spell", 75)),
    // sunburn: load.animation(0,0, ...load_frames("effects/sunburn", 61)),
    // vortex: load.animation(0,0, ...load_frames("effects/vortex", 61))
}

// Enemy images
const all_enemy_images = {
    grunt: load.image(0,0, "./images/enemies/enemy1.png")
}
// Environment images
const all_environment_images = {
    space: load.image(0, 0, "./images/background/space1.png"),
    rock: load.image(0, 0, "./images/background/rock.png")
}

// Ship-Ammo data
const all_ammo_data = load.json("./data/ammo_map.json");
const all_ship_data = load.json("./data/ships_map.json");  // Seperated into seperate JSON files

const assets = { 
    all_players_images, all_ammo_images, 
    all_explosions, all_effects,
    all_enemy_images, all_environment_images,
    all_ammo_data, all_ship_data
};

export { assets };