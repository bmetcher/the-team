import { tad, load, text, keys, make } from "../lib/TeachAndDraw.js";

import { EnemyManager } from "./enemy_manager.js";
import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";


const unit = 64;
tad.w = 640;
tad.h = 640;


// ---- Define Screens ----
const INTRO = 0;        // display game name
const MAIN_MENU = 1;    // player selects start OR navigates to CONTROLS OR navigates to LEADERBOARD
const PREPARE = 2;      // after player selects "PREPARE FOR LAUNCH", must select a ship (has default ship); has "PLAY" button
const LEADERBOARD = 3;  // scores so far + stored; accessible from MAIN_MENU or PAUSE_PLAY
const CONTROLS = 4;  // explains game controls, goals, ship options, and enemies; accessible from MAIN_MENU or PAUSE_PLAY
const PLAY = 5;         // actual game
const PAUSE_PLAY = 6;   // pauses game; provides buttons to access "LEADERBOARD" and "CONTROLS"
const END_PLAY = 7;     // after game ends, display encouraging message and score; provides "REPLAY" or "RETURN TO MAIN MENU"
let current_screen = CONTROLS;      // initial screen


// ---- Load Fonts ----
const fonts = {
    titles: load.font("SmackLaidethDown2024-m2VK2", "./fonts/titles.ttf"),
    pixel_italic: load.font("PixelDigivolveItalic-dV8R", "./fonts/pixel_italic.ttf"),
    pixel_regular: load.font("PixelDigivolve-mOm9", "./fonts/pixel_regular.ttf")

}


// ---- Text Colours ----
const TXT_COL_1 = "white";
const TXT_COL_2 = "rgb(180,180,180)";


// ---- Preload Game Screens ----
const game_screens = {
    loading_screen: load.image(tad.w/2,tad.h/2,"./images/screens/loading.jpeg"),
    main_menu_screen: load.image(tad.w/2,tad.h/2,"./images/screens/main_menu.jpeg"),
    prepare_screen: load.image(tad.w/2,tad.h/2,"./images/screens/prepare.jpeg"),
    leaderboard_screen: load.image(tad.w/2,tad.h/2,"./images/screens/leaderboard.jpeg"),
    controls_screen: load.image(tad.w/2,tad.h/2,"./images/screens/controls.jpeg")
}

// ---- Create Buttons ----
const buttons = {
    go_to_prepare: create_menu_button("large", "prepare for launch"),
    go_to_leaderboard: create_menu_button("large", "leaderboard"),
    go_to_help: create_menu_button("large", "help"),
    go_to_main_menu: create_menu_button("large", "return to main menu"),
    go_to_play: create_menu_button("large", "play now")
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

// ---- Preload FILE Data ----
const all_ammo_data = load.json("./data/ammo_map.json");
const how_to_play_info = load.json("./data/commands.json")


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
        display_load_screen();
    } else if (current_screen === MAIN_MENU){
        // player selects start OR navigates to CONTROLS OR navigates to LEADERBOARD
        display_main_menu_screen();
    } else if (current_screen === PREPARE){
        // after player selects "PREPARE FOR LAUNCH", must select a ship (has default ship); has "PLAY" button
        display_prepare_screen();
    } else if (current_screen === LEADERBOARD){
        // scores so far + stored; accessible from MAIN_MENU or PAUSE_PLAY
        display_leaderboard_screen();
    } else if (current_screen === CONTROLS){
        // explains game controls, goals, ship options, and enemies; accessible from MAIN_MENU or PAUSE_PLAY
        display_how_to_play_screen();
    } else if (current_screen === PLAY){
        // actual game
    } else if (current_screen === PAUSE_PLAY){
        // pauses game; provides buttons to access "LEADERBOARD" and "CONTROLS"
    } else if (current_screen === END_PLAY){
        // after game ends, display encouraging message and score; provides "REPLAY" or "RETURN TO MAIN MENU"
    }

    // environment.update();
    // player.update();
    // enemy.update();
    
}


function create_menu_button(button_size, button_text){

    let button_width;
    let button_height;
    if (button_size==="large"){
        button_width = 225;
        button_height = 40;
    } else {
        button_width = 200;
        button_height = 50;
    }

    const tmp = make.button(0,0, button_width, button_height, button_text);
    tmp.background = "rgb(2,12,27)";
    tmp.textColour = TXT_COL_2;
    return tmp;
}


function draw_button(button, desired_x, desired_y)
{
    button.x = desired_x;
    button.y = desired_y;
    button.draw();
}


function display_load_screen(){
    game_screens.loading_screen.draw();

    // game name text
    text.colour = TXT_COL_1;
    text.size = 90;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/5, "game name");

    // directions to continue text
    text.colour = TXT_COL_1;
    text.size = 18;
    text.font = fonts.pixel_italic;
    text.print(tad.w/2, tad.h/5*4, "press space key to continue");

    // change screens logic
    if (keys.down(" ")){
        current_screen = MAIN_MENU;
    }
}


function display_main_menu_screen(){
    game_screens.main_menu_screen.draw();

    // main menu title text
    text.colour = TXT_COL_1;
    text.size = 60;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/6, "main menu");

    // change screens logic
    if (buttons.go_to_prepare.released === true){
        current_screen = PREPARE;
    } else if (buttons.go_to_leaderboard.released === true){
        current_screen = LEADERBOARD;
    } else if (buttons.go_to_help.released === true){
        current_screen = CONTROLS;
    }

    // menu buttons
    const GAP_BETW_BUTTONS = buttons.go_to_prepare.h * 1.5;
    text.font = fonts.pixel_regular;
    draw_button(buttons.go_to_prepare, tad.w/2, tad.h/50*28);
    draw_button(buttons.go_to_leaderboard, tad.w/2, buttons.go_to_prepare.y + GAP_BETW_BUTTONS);
    draw_button(buttons.go_to_help, tad.w/2, buttons.go_to_leaderboard.y + GAP_BETW_BUTTONS);
}


function display_prepare_screen(){
    game_screens.prepare_screen.draw();

    // prepare menu title text
    text.colour = TXT_COL_1;
    text.size = 60;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/6, "preparations");

    // change screens logic
    if (buttons.go_to_main_menu.released === true){
        current_screen = MAIN_MENU;
    } else if (buttons.go_to_play.released === true){
        current_screen = PLAY;
    }

    // buttons
    text.font = fonts.pixel_regular;
    draw_button(buttons.go_to_main_menu, tad.w/10*2, tad.h/50*47);
    draw_button(buttons.go_to_play, tad.w/10*8, tad.h/50*47);

}


function display_leaderboard_screen(){
    game_screens.leaderboard_screen.draw();

    // leaderboard menu title text
    text.colour = TXT_COL_1;
    text.size = 60;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/6, "leaderboard");

    // change screens logic
    if (buttons.go_to_main_menu.released === true){
        current_screen = PREPARE;
    }

    // buttons
    text.font = fonts.pixel_regular;
    draw_button(buttons.go_to_main_menu, tad.w/10*2, tad.h/50*47);

}


function display_how_to_play_screen(){
    game_screens.controls_screen.draw();

    // commands menu title text
    text.colour = TXT_COL_1;
    text.size = 60;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/6, "commands");

    // commands info
    const KEY_X = tad.w/7 * 1.25;
    const ACTION_X = KEY_X + 150;
    const HEADING2_size = 15;
    const GAP_BETW_H2_LINES = 30;
    let current_y = tad.h/3;

    // info
    text.size = HEADING2_size;
    console.log(how_to_play_info);
    // for (const command of how_to_play_info){
    //     current_y += GAP_BETW_H2_LINES;

    //     text.alignment.x = "right";
    //     text.print(KEY_X, current_y, command.key);

    //     text.alignment.x = "left";
    //     text.print(ACTION_X, current_y, command.action);
    // }

    // change screens logic
    if (buttons.go_to_prepare.released === true){
        current_screen = PREPARE;
    }

    // buttons
    text.font = fonts.pixel_regular;
    draw_button(buttons.go_to_main_menu, tad.w/10*2, tad.h/50*47);

}
