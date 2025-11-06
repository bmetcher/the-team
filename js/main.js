import { tad, load, text, keys, make, time } from "../lib/TeachAndDraw.js";
import { EnemyManager } from "./enemy_manager.js";
import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";
import { ProjectileManager } from "./projectile_manager.js";



// ----------------------------------------- Initialisation for Game -----------------------------------------

const unit = 64;
tad.w = 640;
tad.h = 640;

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
    space1: load.image(tad.w/2, 0, "./images/game_background/space1.jpeg"),
    space2: load.image(tad.w/2, tad.h, "./images/game_background/space2.jpeg")
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

// ---- Preload FILE Data ----
const files = {
    all_ammo_data: load.json("./data/ammo_map.json"),
    all_ship_data: load.json("./data/ships_map.json"),  // Seperated into seperate JSON files
    all_enemies_data: load.json("./data/enemies_map.json"),
    game_commands_data: load.json("./data/commands.json"),
    game_tutorial_txt: load.text("./data/tutorial.txt")
}

// --------------------------------------- Initialisation for Screens ---------------------------------------
// NOTE: game files are loaded above

// ---- Define Screens ----
const INTRO = 0;            // display game name
const MAIN_MENU = 1;        // player selects start OR navigates to COMMANDS OR navigates to LEADERBOARD
const PREPARE = 2;          // after player selects "PREPARE FOR LAUNCH", must select a ship (has default ship); has "PLAY" button
const LEADERBOARD = 3;      // scores so far + stored; accessible from MAIN_MENU or PAUSE
const TUTORIAL = 4;         // explains how game works
const COMMANDS = 5;         // explains game controls; accessible from PAUSE
const PLAY = 6;             // actual game
const PAUSE = 7;       // pauses game; provides buttons to access "LEADERBOARD" and "COMMANDS"
const END_PLAY = 8;         // after game ends, display encouraging message and score; provides "REPLAY" or "RETURN TO MAIN MENU"
let current_screen = INTRO;      // initial screen

// ---- Button Locations ----
const BUTTON_LRG_LEFT_X = tad.w/10*2;
const BUTTON_LRG_RIGHT_X = tad.w/10*8;
const BUTTON_SMALL_RIGHT_X = tad.w/50*47;
const BUTTON_LRG_BOTTOM_Y = tad.h/50*47;

// ---- Text Constants ----
const TXT_COL_1 = "white";
const TXT_COL_2 = "rgb(180,180,180)";
const GAP_BETW_LINES = 30;
const HIGHEST_NON_TITLE_TEXT = tad.h/3 - GAP_BETW_LINES;

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
    tutorial_screen: load.image(tad.w/2,tad.h/2,"./images/screens/tutorial.jpeg"),
    controls_screen: load.image(tad.w/2,tad.h/2,"./images/screens/commands.jpeg"),
    pause_screen: load.image(tad.w/2,tad.h/2,"./images/screens/pause.jpeg"),
}

// ---- Create Buttons ----
const buttons = {
    go_to_prepare: create_menu_button("large", "prepare for launch"),
    go_to_leaderboard: create_menu_button("large", "leaderboard"),
    go_to_tutorial: create_menu_button("large", "tutorial"),
    go_to_main_menu: create_menu_button("large", "return to main menu"),
    go_to_play: create_menu_button("large", "play now"),
    go_to_commands: create_menu_button("large", "commands"),
    go_to_pause: create_menu_button("small", ""),
    return_to_game: create_menu_button("large", "return to game")
}
const img_pause_button = load.image(tad.w/2,tad.h/2,"./images/screens/pause_button.png")


// ---- Create Dropdown ----
const ship_name_map = {
    "Default Ship": "default_ship",
    "Tank Ship": "tank_ship"
};
const player_ship_dropdown = create_ship_dropwdown(Object.keys(ship_name_map));

// Declare manager variables
let environment, player, enemies, projectiles;

// Declare var to hold starting frame of PREPARE screen
let prep_frame_count;


// ------------------------------------------------- Update -------------------------------------------------

tad.use(update);
//tad.debug = true;


// Main draw loop
function update() {

    if (current_screen === INTRO){
        // display game name; press space key to continue
        display_intro_screen();
    } else if (current_screen === MAIN_MENU){
        // player selects start OR navigates to COMMANDS OR navigates to LEADERBOARD
        display_main_menu_screen();
    } else if (current_screen === PREPARE){
        // after player selects "PREPARE FOR LAUNCH", must select a ship (has default ship); has "PLAY" button
        display_prepare_screen();
    } else if (current_screen === LEADERBOARD){
        // scores so far + stored; accessible from MAIN_MENU or PAUSE
        display_leaderboard_screen();
    } else if (current_screen === TUTORIAL){
        // explains how game works
        display_tutorial_screen();
    } else if (current_screen === COMMANDS){
        // explains game controls; accessible from PAUSE
        display_commands_screen();
    } else if (current_screen === PLAY){
        // actual game
        display_play_screen();
    } else if (current_screen === PAUSE){
        // pauses game; provides buttons to access "LEADERBOARD" and "COMMANDS"
        display_pause_screen();
    } else if (current_screen === END_PLAY){
        // after game ends, display encouraging message and score; provides "REPLAY" or "RETURN TO MAIN MENU"
    }
    
    // initial_setup();
    
    // environment.update();
    // projectiles.update(player, enemies);

    // player.update();
    // enemies.update();

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
    draw_button(buttons.go_to_tutorial, tad.w/2, buttons.go_to_leaderboard.y + GAP_BETW_BUTTONS);
}


function display_prepare_screen(){
    game_screens.prepare_screen.draw();    // display prepare screen image
    display_menu_title("preparations");     // prepare menu title text
    player_ship_dropdown.draw();
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


function display_tutorial_screen(){
    game_screens.tutorial_screen.draw();    // display help screen image
    display_menu_title("tutorial");     // help menu title text
    display_tutorial_txt();
    check_buttons()     // change screens logic
    draw_button(buttons.go_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);  // button to return to main menu
}


function display_commands_screen(){
    game_screens.controls_screen.draw();    // display controls screen image
    display_menu_title("commands");     // commands menu title text
    display_commands_json();
    check_buttons()     // change screens logic
    draw_button(buttons.go_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);  // button to return to main menu
}


function display_play_screen(){
    // update game elements
    environment.update();
    projectiles.update(player, enemies);
    player.update();
    enemies.update();
    check_buttons()     // change screens logic
    // pause button
    draw_button(buttons.go_to_pause, BUTTON_SMALL_RIGHT_X, BUTTON_LRG_BOTTOM_Y);  // button to got to pause screen
    img_pause_button.x = buttons.go_to_pause.x;
    img_pause_button.y = buttons.go_to_pause.y;
    img_pause_button.scale = 80;
    img_pause_button.draw();
}


function display_pause_screen(){
    game_screens.pause_screen.draw()    // display pause screen image
    environment.pause();
    player.pause();
    enemies.pause();
    projectiles.pause();
    display_menu_title("game paused");     // commands menu title text
    check_buttons()     // change screens logic
    draw_button(buttons.return_to_game, BUTTON_LRG_LEFT_X, BUTTON_LRG_BOTTOM_Y);     // button to return to game
    draw_button(buttons.go_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);     // button to delte current game progress and return to main menu
}


// ------------------------------------------  Button Helper Functions ------------------------------------------

function create_menu_button(button_size, button_text){

    let button_width;
    let button_height;
    if (button_size==="large"){
        button_width = 225;
        button_height = 40;
    } else {
        button_width = 38;
        button_height = 38;
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
        prep_frame_count = time.frameCount + 1;
        current_screen = PREPARE;

    } else if (buttons.go_to_leaderboard.released){
        current_screen = LEADERBOARD;

    } else if (buttons.go_to_tutorial.released){
        current_screen = TUTORIAL;

    } else if (buttons.go_to_main_menu.released){
        current_screen = MAIN_MENU;

    } else if (buttons.go_to_play.released || buttons.return_to_game.released){
        initial_setup(ship_name_map[player_ship_dropdown.value]);
        console.log(ship_name_map[player_ship_dropdown.value])
        current_screen = PLAY;
        environment.play();
        player.play();
        enemies.play();
        projectiles.play();

    } else if (buttons.go_to_commands.released){
        current_screen = COMMANDS;

    } else if (buttons.go_to_pause.released){
        current_screen = PAUSE;
    } 
}


// -----------------------------------------  Dropdown Helper Functions -----------------------------------------
function create_ship_dropwdown(options){
    text.font = fonts.pixel_regular;
    const tmp = make.dropdown(tad.w/2, tad.h/2, 150, options);
    tmp.openDirection = "down";
    return tmp;
}


// ---------------------------------------- Text Display Helper Functions ----------------------------------------

function display_commands_json(){
    text.colour = TXT_COL_2;
    text.font = fonts.pixel_regular
    const DIST_FROM_VERTICAL_CENTRE = 30; 
    let current_y = HIGHEST_NON_TITLE_TEXT;

    // column headers
    text.size = 20;
    text.alignment.x = "right";
    text.print(tad.w/2-DIST_FROM_VERTICAL_CENTRE, current_y, "ACTION");
    text.alignment.x = "left";
    text.print(tad.w/2+DIST_FROM_VERTICAL_CENTRE, current_y, "KEY");

    // info
    text.size = 15;
    for (const command of files.game_commands_data.commands){

        current_y += GAP_BETW_LINES;

        text.alignment.x = "right";
        text.print(tad.w/2-DIST_FROM_VERTICAL_CENTRE, current_y, command.action);

        text.alignment.x = "left";
        text.print(tad.w/2+DIST_FROM_VERTICAL_CENTRE, current_y, command.command);

    }
}


function display_tutorial_txt(){
    // Precondition: Assumes tutorial is written using only one line
    text.alignment.x = "left";
    text.alignment.y = "top";
    text.colour = TXT_COL_2;
    text.font = fonts.pixel_regular;
    text.maxWidth = tad.w/8*6;
    let current_y = HIGHEST_NON_TITLE_TEXT;

    text.print(tad.w/8, current_y, files.game_tutorial_txt[0]);
}


function display_menu_title(title){
    text.colour = TXT_COL_1;
    text.size = 60;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/6, title);
}

// --------------------------------------------------------------------------------------------------------------


function initial_setup(player_ship_name) {
    // Asset loading & manager initialization

    if (time.frameCount === prep_frame_count) {
        // check if all JSON assets are loaded
        if (files.all_ship_data && files.all_ammo_data) {
            // Create managers AFTER data has loaded
            // ---- Start Background Environment ----
            environment = new EnvironmentManager(unit, all_environment_images);

            // ---- Initialise Player and Enemies ----
            player = new PlayerManager(player_ship_name, all_players_images, files.all_ship_data);  // updated for new parameters
            enemies = new EnemyManager(all_enemy_images, files.all_enemies_data);

            // ---- Initialize Projectiles -----
            projectiles = new ProjectileManager(unit, files.all_ammo_data, all_ammo_images, all_explosions);

            // ?? Set game state here ??
            // game_state = MAIN_MENU;
        }
        return; // skip until it's loaded
    }
}
