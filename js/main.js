import { tad, load, text, keys } from "../lib/TeachAndDraw.js";

import { EnemyManager } from "./enemy_manager.js";
import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";


const unit = 64;
tad.w = 640;
tad.h = 640;


// ---- Define Screens ----
const INTRO = 0;        // display game name
const MAIN_MENU = 1;    // player selects start OR navigates to HELP OR navigates to LEADERBOARD
const SELECT_SHIP = 2;  // after player selects "GET READY TO PLAY", must select a ship (has default ship); has "PLAY" button
const LEADERBOARD = 3;  // scores so far + stored; accessible from MAIN_MENU or PAUSED
const HELP = 4;         // explains game controls, goals, ship options, and enemies; accessible from MAIN_MENU or PAUSED
const GAME = 5;         // actual game
const PAUSED = 6;       // pauses game; provides buttons to access "LEADERBOARD" and "HELP"
const END_GAME = 7;     // after game ends, display encouraging message and score; provides "REPLAY" or "RETURN TO MAIN MENU"
let current_screen = INTRO;      // initial screen


// ---- Load Fonts ----
const fonts = {
    titles: load.font("SmackLaidethDown2024-m2VK2", "./fonts/titles.ttf"),
    pixel_italic: load.font("PixelDigivolveItalic-dV8R", "./fonts/pixel_italic.ttf"),
    pixel_regular: load.font("PixelDigivolve-mOm9", "./fonts/pixel_regular.ttf")

}

// ---- Preload Game Screens ----
const game_screens = {
    loading_screen: load.image(tad.w/2,tad.h/2,"./images/screens/loading.jpeg"),
    main_menu_screen: load.image(tad.w/2,tad.h/2,"./images/screens/main_menu.jpeg")
}


// ---- Preload Game Images ----
// Player images
const all_players_images = {    // Player ship images
    player1: load.image(0,0,"./images/player/player1.png"),
    player2: load.image(0,0,"./images/player/player2.png")
}
const all_ammo_images = {       // Ammo images
    bullet: load.image(0,0,"./images/ammo/bullet.png"),
    missile: load.image(0,0,"./images/ammo/missile.png")
}
const all_enemy_images = {      // Enemy images
    grunt: load.image(0,0, "./images/enemies/enemy1.png")
}

// ---- Preload Ammo-Mapping Data ----
const all_ammo_data = load.json("./data/ammo_map.json");


// // ---- Start Background Environment ----
// const environment = new EnvironmentManager(unit);

// // ---- Initialise Player and Enemies ----
// const player = new PlayerManager("player1", all_players_images, all_ammo_images, all_ammo_data);
// const enemy = new EnemyManager(unit, all_enemy_images);

tad.use(update);
//tad.debug = true;


function update() {

    if (current_screen === INTRO){
        // display game name; press any key to continue
        if (keys.down(" ")){
            current_screen = MAIN_MENU;
        }
        display_load_screen();
    } else if (current_screen === MAIN_MENU){
        // player selects start OR navigates to HELP OR navigates to LEADERBOARD
        display_main_menu_screen();
    } else if (current_screen === SELECT_SHIP){
        // after player selects "GET READY TO PLAY", must select a ship (has default ship); has "PLAY" button
    } else if (current_screen === LEADERBOARD){
        // scores so far + stored; accessible from MAIN_MENU or PAUSED
    } else if (current_screen === HELP){
        // explains game controls, goals, ship options, and enemies; accessible from MAIN_MENU or PAUSED
    } else if (current_screen === GAME){
        // actual game
    } else if (current_screen === PAUSED){
        // pauses game; provides buttons to access "LEADERBOARD" and "HELP"
    } else if (current_screen === END_GAME){
        // after game ends, display encouraging message and score; provides "REPLAY" or "RETURN TO MAIN MENU"
    }

    // environment.update();
    // player.update();
    // enemy.update();
    
}


function display_load_screen(){
    game_screens.loading_screen.draw();

    // game name text
    text.colour = "white";
    text.size = 90;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/5, "game name");

    // directions to continue text
    text.colour = "white";
    text.size = 18;
    text.font = fonts.pixel_italic;
    text.print(tad.w/2, tad.h/5*4, "press space key to continue");
}

function display_main_menu_screen(){
    game_screens.main_menu_screen.draw();

    // main menu title text
    text.colour = "white";
    text.size = 64;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/6, "main menu");

}
