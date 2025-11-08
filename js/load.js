import {tad, load} from "../lib/TeachAndDraw.js";

// Same as in main.js :
tad.w = 720;
tad.h = 1080;

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
    boss_grunt: load.image(0,0, "./images/enemies/boss_grunt.png"),
    big_boss: load.image(0,0, "./images/enemies/big_boss.png"),
    ice_enemy: load.image(0,0, "./images/enemies/ice_enemy.png"),
    boss_ice_enemy: load.image(0,0, "./images/enemies/boss_ice_enemy.png"),
}

// Environment images
const all_environment_images = {
    space1: load.image(tad.w/2, 0, "./images/game_background/space1.jpeg"),
    space2: load.image(tad.w/2, tad.h, "./images/game_background/space2.jpeg")
}

// Game Screen images
const game_screens = {
    intro_screen: load.image(tad.w/2,tad.h/2,"./images/screens/intro.jpeg"),
    main_menu_screen: load.image(tad.w/2,tad.h/2,"./images/screens/main_menu.jpeg"),
    prepare_screen: load.image(tad.w/2,tad.h/2,"./images/screens/prepare.jpeg"),
    leaderboard_screen: load.image(tad.w/2,tad.h/2,"./images/screens/leaderboard.jpeg"),
    tutorial_screen: load.image(tad.w/2,tad.h/2,"./images/screens/tutorial.jpeg"),
    controls_screen: load.image(tad.w/2,tad.h/2,"./images/screens/commands.jpeg"),
    pause_screen: load.image(tad.w/2,tad.h/2,"./images/screens/pause.jpeg"),
    end_game_screen: load.image(tad.w/2,tad.h/2,"./images/screens/end_game.png"),
}

// Game Pause Button image
const img_pause_button = load.image(tad.w/2,tad.h/2,"./images/screens/pause_button.png")

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
const game_controls_data = load.json("./data/controls.json");
const game_tutorial_txt = load.text("./data/tutorial.txt");
const leaderboard = load.json("./data/leaderboard.json");

// Fonts
const fonts = {
    titles: load.font("SmackLaidethDown2024-m2VK2", "./fonts/titles.ttf"),
    pixel_italic: load.font("PixelDigivolveItalic-dV8R", "./fonts/pixel_italic.ttf"),
    pixel_regular: load.font("PixelDigivolve-mOm9", "./fonts/pixel_regular.ttf")

}

const assets = { 
    all_players_images, all_ammo_images, all_enemy_images, all_environment_images, game_screens, img_pause_button,
    all_explosions,
    all_ammo_data, all_ship_data, all_enemies_data,
    game_controls_data, game_tutorial_txt,
    leaderboard,
    fonts
};

export {assets};