import { tad, load, text, keys, make } from "../lib/TeachAndDraw.js";
import { EnemyManager } from "./enemy_manager.js";
import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";


// ----------------------------------------- Initialisation for Game -----------------------------------------

const unit = 64;
tad.w = 640;
tad.h = 640;

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
const commands_data = load.json("./data/commands.json");


// --------------------------------------- Initialisation for Screens ---------------------------------------

// ---- Define Screens ----
const INTRO = 0;        // display game name
const MAIN_MENU = 1;    // player selects start OR navigates to COMMANDS OR navigates to LEADERBOARD
const PREPARE = 2;      // after player selects "PREPARE FOR LAUNCH", must select a ship (has default ship); has "PLAY" button
const LEADERBOARD = 3;  // scores so far + stored; accessible from MAIN_MENU or PAUSE_PLAY
const HELP = 4;
const COMMANDS = 5;  // explains game controls, goals, ship options, and enemies; accessible from MAIN_MENU or PAUSE_PLAY
const PLAY = 6;         // actual game
const PAUSE_PLAY = 7;   // pauses game; provides buttons to access "LEADERBOARD" and "COMMANDS"
const END_PLAY = 8;     // after game ends, display encouraging message and score; provides "REPLAY" or "RETURN TO MAIN MENU"
let current_screen = INTRO;      // initial screen


// ---- Button Locations ----
const BUTTON_LRG_LEFT_X = tad.w/10*2;
const BUTTON_LRG_RIGHT_X = tad.w/10*8;
const BUTTON_LRG_BOTTOM_Y = tad.h/50*47;


// ---- Text Colours and Sizes ----
const TXT_COL_1 = "white";
const TXT_COL_2 = "rgb(180,180,180)";


// ---- Load Fonts ----
const fonts = {
    titles: load.font("SmackLaidethDown2024-m2VK2", "./fonts/titles.ttf"),
    pixel_italic: load.font("PixelDigivolveItalic-dV8R", "./fonts/pixel_italic.ttf"),
    pixel_regular: load.font("PixelDigivolve-mOm9", "./fonts/pixel_regular.ttf")

}


// ---- Preload Game Screens ----
const game_screens = {
    intro_screen: load.image(tad.w/2,tad.h/2,"./images/screens/intro.jpeg"),
    main_menu_screen: load.image(tad.w/2,tad.h/2,"./images/screens/main_menu.jpeg"),
    prepare_screen: load.image(tad.w/2,tad.h/2,"./images/screens/prepare.jpeg"),
    leaderboard_screen: load.image(tad.w/2,tad.h/2,"./images/screens/leaderboard.jpeg"),
    help_screen: load.image(tad.w/2,tad.h/2,"./images/screens/help.jpeg"),
    controls_screen: load.image(tad.w/2,tad.h/2,"./images/screens/commands.jpeg")
}


// ---- Create Buttons ----
const buttons = {
    go_to_prepare: create_menu_button("large", "prepare for launch"),
    go_to_leaderboard: create_menu_button("large", "leaderboard"),
    go_to_help: create_menu_button("large", "help"),
    go_to_main_menu: create_menu_button("large", "return to main menu"),
    go_to_play: create_menu_button("large", "play now"),
    go_to_commands: create_menu_button("large", "commands"),
}


// // ---- Start Background Environment ----
// const environment = new EnvironmentManager(unit);

// // ---- Initialise Player and Enemies ----
// const player = new PlayerManager("player1", all_players_images, all_ammo_images, all_ammo_data);
// const enemy = new EnemyManager(unit, all_enemy_images);


// ------------------------------------------------- Update -------------------------------------------------

tad.use(update);
//tad.debug = true;


function update() {

    if (current_screen === INTRO){
        // display game name; press any key to continue
        display_intro_screen();
    } else if (current_screen === MAIN_MENU){
        // player selects start OR navigates to COMMANDS OR navigates to LEADERBOARD
        display_main_menu_screen();
    } else if (current_screen === PREPARE){
        // after player selects "PREPARE FOR LAUNCH", must select a ship (has default ship); has "PLAY" button
        display_prepare_screen();
    } else if (current_screen === LEADERBOARD){
        // scores so far + stored; accessible from MAIN_MENU or PAUSE_PLAY
        display_leaderboard_screen();
    } else if (current_screen === HELP){
        // explains game controls, goals, ship options, and enemies; accessible from MAIN_MENU or PAUSE_PLAY
        display_help_screen();
    } else if (current_screen === COMMANDS){
        // explains game controls, goals, ship options, and enemies; accessible from MAIN_MENU or PAUSE_PLAY
        display_commands_screen();
    } else if (current_screen === PLAY){
        // actual game
    } else if (current_screen === PAUSE_PLAY){
        // pauses game; provides buttons to access "LEADERBOARD" and "COMMANDS"
    } else if (current_screen === END_PLAY){
        // after game ends, display encouraging message and score; provides "REPLAY" or "RETURN TO MAIN MENU"
    }

    // environment.update();
    // player.update();
    // enemy.update();
    
}


// --------------------------------------------- Display Screens ---------------------------------------------

function display_intro_screen(){
    game_screens.intro_screen.draw();

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
    game_screens.main_menu_screen.draw();    // display main menu screen image
    display_menu_title("main menu");    // main menu title text
    check_buttons();        // change screens logic

    // menu buttons
    const GAP_BETW_BUTTONS = buttons.go_to_prepare.h * 1.5;
    text.font = fonts.pixel_regular;
    draw_button(buttons.go_to_prepare, tad.w/2, tad.h/50*28);
    draw_button(buttons.go_to_leaderboard, tad.w/2, buttons.go_to_prepare.y + GAP_BETW_BUTTONS);
    draw_button(buttons.go_to_help, tad.w/2, buttons.go_to_leaderboard.y + GAP_BETW_BUTTONS);
}


function display_prepare_screen(){
    game_screens.prepare_screen.draw();    // display prepare screen image
    display_menu_title("preparations");     // prepare menu title text
    check_buttons()     // change screens logic
    draw_button(buttons.go_to_main_menu, BUTTON_LRG_LEFT_X, BUTTON_LRG_BOTTOM_Y);  // button to return to main menu
    draw_button(buttons.go_to_play, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);     // button to go to game

}


function display_leaderboard_screen(){
    game_screens.leaderboard_screen.draw();    // display leaderboard screen image
    display_menu_title("leaderboard");  // leaderboard menu title text
    check_buttons()     // change screens logic
    draw_button(buttons.go_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);    // button to return to main menu

}


function display_help_screen(){
    game_screens.help_screen.draw();    // display help screen image
    display_menu_title("help");     // help menu title text
    check_buttons()     // change screens logic
    draw_button(buttons.go_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);  // button to return to main menu

}


function display_commands_screen(){
    game_screens.controls_screen.draw();    // display controls screen image
    display_menu_title("commands");     // commands menu title text
    display_commands();
    check_buttons()     // change screens logic
    draw_button(buttons.go_to_main_menu, tad.w/10*8, tad.h/50*47);  // button to return to main menu

}


// ------------------------------------------  Button Helper Functions ------------------------------------------

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


function draw_button(button, desired_x, desired_y){
    text.font = fonts.pixel_regular;
    button.x = desired_x;
    button.y = desired_y;
    button.draw();
}


function check_buttons(){
    if (buttons.go_to_prepare.released){
        current_screen = PREPARE;
    } else if (buttons.go_to_leaderboard.released){
        current_screen = LEADERBOARD;
    } else if (buttons.go_to_help.released){
        current_screen = HELP;
    } else if (buttons.go_to_main_menu.released){
        current_screen = MAIN_MENU;
    } else if (buttons.go_to_play.released){
        current_screen = PLAY;
    } else if (buttons.go_to_commands.released){
        current_screen = COMMANDS;
    } 
}


// ---------------------------------------- Text Display Helper Functions ----------------------------------------

function display_commands(){

    text.colour = TXT_COL_2;
    text.font = fonts.pixel_regular
    const GAP_BETW_H2_LINES = 30;
    const DIST_FROM_VERTICAL_CENTRE = 30; 
    let current_y = tad.h/3;

    // column headers
    text.size = 20;
    text.alignment.x = "right";
    text.print(tad.w/2-DIST_FROM_VERTICAL_CENTRE, current_y, "ACTION");
    text.alignment.x = "left";
    text.print(tad.w/2+DIST_FROM_VERTICAL_CENTRE, current_y, "KEY");

    // info
    text.size = 15;
    for (const command of commands_data.commands){
        current_y += GAP_BETW_H2_LINES;

        text.alignment.x = "right";
        text.print(tad.w/2-DIST_FROM_VERTICAL_CENTRE, current_y, command.action);

        text.alignment.x = "left";
        text.print(tad.w/2+DIST_FROM_VERTICAL_CENTRE, current_y, command.command);
    }
}


function display_menu_title(title){
    text.colour = TXT_COL_1;
    text.size = 60;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/6, title);
}

// --------------------------------------------------------------------------------------------------------------
