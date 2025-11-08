import { tad, text, keys, make, time } from "../lib/TeachAndDraw.js";
import { EnemyManager } from "./enemy_manager.js";
import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";
import { ProjectileManager } from "./projectile_manager.js";
import { assets } from "./load.js";


// ----------------------------------------- Initialisation for Game -----------------------------------------

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
const all_enemies_data = assets.all_enemies_data;
let leaderboard = assets.leaderboard;

let new_score_added = false;


// --------------------------------------- Initialisation for Screens ---------------------------------------

// ---- Define Screens ----
const INTRO = 0;            // display game name; press space key to continue
const MAIN_MENU = 1;        // player selects start OR navigates to CONTROLS OR navigates to LEADERBOARD
const PREPARE = 2;          // after player selects "PREPARE FOR LAUNCH", must select a ship (has default ship); provides "PLAY" button
const LEADERBOARD = 3;      // scores so far + stored
const TUTORIAL = 4;         // explains how game works
const CONTROLS = 5;         // explains game controls
const PLAY = 6;             // actual game
const PAUSE = 7;            // pauses game; provides "RETURN TO GAME" or "END GAME"
const END_GAME = 8;         // after game ends: show message and score; provides "RETURN TO MAIN MENU" or "PLAY AGAIN"

// ---- Preload Assets ----
// Images
const game_screens = assets.game_screens;
const img_pause_button = assets.img_pause_button;
// Files
const game_commands_data = assets.game_commands_data;
const game_tutorial_txt = assets.game_tutorial_txt;
// Fonts
const fonts = assets.fonts;

// ---- Text Settings ----
const TXT_COL_1 = "white";
const TXT_COL_2 = "rgb(180,180,180)";
const GAP_BETW_LINES = 30;
const HIGHEST_NON_TITLE_TEXT = tad.h/4 - GAP_BETW_LINES;
const LEFT_X_NON_TITLE_TEXT = tad.w/100*15;
const RIGHT_X_NON_TITLE_TEXT = tad.w - LEFT_X_NON_TITLE_TEXT;

// ---- Buttons ----
// Locations
const BUTTON_LRG_LEFT_X = tad.w/10*2.5;
const BUTTON_LRG_RIGHT_X = tad.w/10*7.5;
const BUTTON_SMALL_RIGHT_X = tad.w/50*47;
const BUTTON_SMALL_BOTTOM_Y = tad.h - (tad.w-BUTTON_SMALL_RIGHT_X);
const BUTTON_LRG_BOTTOM_Y = tad.h - (tad.w-BUTTON_LRG_RIGHT_X) + 100;
// Creation
const buttons = {
    go_to_prepare: create_menu_button("large", "prepare for launch"),
    go_to_leaderboard: create_menu_button("large", "leaderboard"),
    go_to_tutorial: create_menu_button("large", "tutorial"),
    return_to_main_menu: create_menu_button("large", "return to main menu"),
    go_to_play: create_menu_button("large", "play now"),
    return_to_pause: create_menu_button("large", "return"),
    go_to_commands: create_menu_button("large", "review controls"),
    go_to_pause: create_menu_button("small", ""),
    return_to_game: create_menu_button("large", "return to game"),
    end_game: create_menu_button("large", "end game"),
    play_again: create_menu_button("large", "play again"),
}

// ---- Dropdown ----
const ship_name_map = {
    "Default Ship": "default_ship",
    "Tank Ship": "tank_ship"
};
const player_ship_dropdown = create_ship_dropwdown(Object.keys(ship_name_map));

// --- Global Variables ----
let environment, player, enemies, projectiles;      // manager variables
let prep_frame_count;       // hold starting frame of PREPARE screen
let game_in_progress = false;       // is game being played or paused OR has game ended or not begun
let end_game_time;
let current_screen = INTRO;      // initial screen


// ------------------------------------------------- Update -------------------------------------------------

tad.use(update);
//tad.debug = true;


// Main draw loop
function update() {
    if (time.frameCount===0){
        leaderboard = Object.values(leaderboard) // convert to array
    }

    if (current_screen === INTRO){
        // display game name; press space key to continue
        display_intro_screen();
    } else if (current_screen === MAIN_MENU){
        // player selects start OR navigates to CONTROLS OR navigates to LEADERBOARD
        display_main_menu_screen();
    } else if (current_screen === PREPARE){
        // after player selects "PREPARE FOR LAUNCH", must select a ship (has default ship); provides "PLAY" button
        display_prepare_screen();
    } else if (current_screen === LEADERBOARD){
        // scores so far + stored
        display_leaderboard_screen();
    } else if (current_screen === TUTORIAL){
        // explains how game works
        display_tutorial_screen();
    } else if (current_screen === CONTROLS){
        // explains game controls
        display_commands_screen();
    } else if (current_screen === PLAY){
        // actual game
        display_play_screen();
    } else if (current_screen === PAUSE){
        // pauses game; provides "RETURN TO GAME" or "END GAME"
        display_pause_screen();
    } else if (current_screen === END_GAME){
        // after game ends: show message and score; provides "RETURN TO MAIN MENU" or "PLAY AGAIN"
        display_end_game_screen();
    }
    
}


// --------------------------------------------- Display Screens ---------------------------------------------

function display_intro_screen(){
    game_screens.intro_screen.draw();

    // game name text
    text.colour = TXT_COL_1;
    text.size = 90;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/10*1.25, "game name");

    // directions to continue text
    text.size = 18;
    text.font = fonts.pixel_italic;
    text.print(tad.w/2, tad.h/10*9, "press space key to continue");

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
    const TOP_BUTTON_POSITION = tad.h/50*38;
    const GAP_BETW_BUTTONS = buttons.go_to_prepare.h * 1.5;
    text.font = fonts.pixel_regular;
    draw_button(buttons.go_to_prepare, tad.w/2, TOP_BUTTON_POSITION);
    draw_button(buttons.go_to_leaderboard, tad.w/2, buttons.go_to_prepare.y + GAP_BETW_BUTTONS);
    draw_button(buttons.go_to_tutorial, tad.w/2, buttons.go_to_leaderboard.y + GAP_BETW_BUTTONS);
}


function display_prepare_screen(){
    game_screens.prepare_screen.draw();    // display prepare screen image
    display_menu_title("preparations");     // prepare menu title text
    display_instruction_txt("select your ship", HIGHEST_NON_TITLE_TEXT);
    display_instruction_txt("to control your ship:", HIGHEST_NON_TITLE_TEXT + 185);
    display_commands(220);
    player_ship_dropdown.draw();
    check_buttons();     // change screens logic
    draw_button(buttons.return_to_main_menu, BUTTON_LRG_LEFT_X, BUTTON_LRG_BOTTOM_Y);  // button to return to main menu
    draw_button(buttons.go_to_play, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);     // button to go to game
}


function display_play_screen(){
    // update game elements
    environment.update();
    projectiles.update(player, enemies);
    player.update();
    enemies.update();
    check_buttons();     // change screens logic
    // pause button
    draw_button(buttons.go_to_pause, BUTTON_SMALL_RIGHT_X, BUTTON_SMALL_BOTTOM_Y);  // button to got to pause screen
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
    display_menu_title("game paused");     // pause menu title text
    check_buttons();     // change screens logic
    draw_button(buttons.go_to_commands, tad.w/2, BUTTON_LRG_BOTTOM_Y-80);      // button to review game controls
    draw_button(buttons.return_to_game, BUTTON_LRG_LEFT_X, BUTTON_LRG_BOTTOM_Y);     // button to return to game
    draw_button(buttons.end_game, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);     // button to delte current game progress and return to main menu
    new_score_added = false;
}


function display_end_game_screen(){
    // after game ends: show message and score; provides "RETURN TO MAIN MENU" or "PLAY AGAIN"
    game_screens.end_game_screen.draw();
    display_menu_title("game over!");     // game over menu title text
    if (!new_score_added){
        store_results();
    }
    display_results();
    check_buttons();     // change screens logic
    draw_button(buttons.play_again, BUTTON_LRG_LEFT_X, BUTTON_LRG_BOTTOM_Y);     // button to return to game
    draw_button(buttons.return_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);     // button to delte current game progress and return to main menu
}


function display_leaderboard_screen(){
    game_screens.leaderboard_screen.draw();    // display leaderboard screen image
    display_menu_title("leaderboard");  // leaderboard menu title text
    display_leaderboard();
    check_buttons();     // change screens logic
    draw_button(buttons.return_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);    // button to return to main menu
}


function display_tutorial_screen(){
    game_screens.tutorial_screen.draw();    // display tutorial screen image
    display_menu_title("tutorial");     // tutorial menu title text
    display_instruction_txt(game_tutorial_txt[0]);
    check_buttons();     // change screens logic
    draw_button(buttons.return_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);  // button to return to main menu
}


function display_commands_screen(){
    game_screens.controls_screen.draw();    // display controls screen image
    display_menu_title("controls");     // controls menu title text
    display_commands();
    check_buttons();     // change screens logic
    draw_button(buttons.return_to_pause, BUTTON_LRG_LEFT_X, BUTTON_LRG_BOTTOM_Y);  // button to return to main menu
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

    if (buttons.go_to_prepare.released || buttons.play_again.released){
        prep_frame_count = time.frameCount + 1;
        current_screen = PREPARE;

    } else if (buttons.go_to_leaderboard.released){
        current_screen = LEADERBOARD;

    } else if (buttons.go_to_tutorial.released){
        current_screen = TUTORIAL;

    } else if (buttons.return_to_main_menu.released){
        current_screen = MAIN_MENU;

    } else if (buttons.end_game.released){
        end_game_time = new Date();
        current_screen = END_GAME;
        game_in_progress = false;

    } else if (buttons.go_to_play.released){
        if (!game_in_progress){
            initial_setup(ship_name_map[player_ship_dropdown.value]);
            game_in_progress = true;
        }
        current_screen = PLAY;
        
    } else if (buttons.return_to_game.released){
        // initial_setup(ship_name_map[player_ship_dropdown.value]);
        current_screen = PLAY;
        environment.play();
        player.play();
        enemies.play();
        projectiles.play();
        
    } else if (buttons.go_to_commands.released){
        current_screen = CONTROLS;
        
    } else if (buttons.go_to_pause.released || buttons.return_to_pause.released){
        current_screen = PAUSE;
    } 
}


// -----------------------------------------  Dropdown Helper Functions -----------------------------------------
function create_ship_dropwdown(options){
    text.font = fonts.pixel_regular;
    const dropdown_width = 300;
    const tmp = make.dropdown(
        LEFT_X_NON_TITLE_TEXT + dropdown_width/2, 
        HIGHEST_NON_TITLE_TEXT+50, 
        dropdown_width, 
        options);
    tmp.openDirection = "down";
    return tmp;
}


// ---------------------------------------- Text Display Helper Functions ----------------------------------------

function display_commands(y_offset=0){
    text.colour = TXT_COL_2;
    text.font = fonts.pixel_regular
    const DIST_FROM_VERTICAL_CENTRE = 30; 
    let current_y = HIGHEST_NON_TITLE_TEXT+y_offset;
    
    // column headers
    text.size = 20;
    text.alignment.x = "right";
    text.print(tad.w/2-DIST_FROM_VERTICAL_CENTRE, current_y, "ACTION");
    text.alignment.x = "left";
    text.print(tad.w/2+DIST_FROM_VERTICAL_CENTRE, current_y, "KEY");
    
    // info
    text.size = 15;
    for (const command of game_commands_data.commands){
        
        current_y += GAP_BETW_LINES;
        
        text.alignment.x = "right";
        text.print(tad.w/2-DIST_FROM_VERTICAL_CENTRE, current_y, command.action);
        
        text.alignment.x = "left";
        text.print(tad.w/2+DIST_FROM_VERTICAL_CENTRE, current_y, command.command);
        
    }
}

function display_instruction_txt(display_text, y_position){
    // Precondition: Assumes tutorial is written using only one line
    text.size=16;
    text.alignment.x = "left";
    text.alignment.y = "top";
    text.colour = TXT_COL_2;
    text.font = fonts.pixel_regular;
    text.maxWidth = tad.w/8*6;
    
    text.print(LEFT_X_NON_TITLE_TEXT, y_position, display_text);
}


function display_menu_title(title){
    text.colour = TXT_COL_1;
    text.size = 60;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/8, title);
}


function display_results(){
    text.alignment.x = "center";
    text.alignment.y = "top";
    text.colour = TXT_COL_1;
    text.maxWidth = tad.w/8*6;

    // display a dynamic message
    let messg;
    if (projectiles.player_score < 50){
        messg = "Good Effort!"
    } else if (projectiles.player_score < 75){
        messg = "Nice Job!"
    } else if (projectiles.player_score < 100){
        messg = "Congratulations!"
    } else if (projectiles.player_score > 100){
        messg = "Wow!! Fantastic Job!"
    }
    text.font = fonts.pixel_regular;
    text.size=25;
    text.print(tad.w/2, HIGHEST_NON_TITLE_TEXT-40, messg);
    
    text.font = fonts.pixel_italic;
    text.size=20;
    text.print(tad.w/2, HIGHEST_NON_TITLE_TEXT+10, "your score is:");

    text.font = fonts.pixel_regular;
    text.size=40;
    text.print(tad.w/2, HIGHEST_NON_TITLE_TEXT+40, projectiles.player_score.toString());
}


function display_leaderboard(){
    const top_scores = leaderboard.slice(0,20);  // get top 20 by score
    let current_y = HIGHEST_NON_TITLE_TEXT - GAP_BETW_LINES;
    text.colour = TXT_COL_2;

    // print banner
    text.font = fonts.pixel_regular;
    text.size = 20;
    text.alignment.x = "center";
    text.print(tad.w/2, current_y, "top 20 scores");

    // player name | date played | score

    // column headings
    text.font = fonts.pixel_italic;
    text.size = 17;
    current_y += GAP_BETW_LINES + GAP_BETW_LINES;

    text.alignment.x = "left";
    text.print(LEFT_X_NON_TITLE_TEXT, current_y, "player name");

    text.alignment.x = "center";
    text.print(tad.w/2+50, current_y, "time");

    text.alignment.x = "right";
    text.print(RIGHT_X_NON_TITLE_TEXT, current_y, "score");

    
    // actual scores
    text.font = fonts.pixel_regular;
    text.size = 15;
    for (const this_player of top_scores){
        current_y += GAP_BETW_LINES;

        text.alignment.x = "left";
        text.print(LEFT_X_NON_TITLE_TEXT, current_y, this_player.player_name.toLowerCase());

        text.alignment.x = "right";
        text.print(tad.w/2+125, current_y, this_player.time);

        text.alignment.x = "right";
        text.print(RIGHT_X_NON_TITLE_TEXT, current_y, this_player.score.toString());
    }
}

// --------------------------------------------------------------------------------------------------------------


function initial_setup(player_ship_name) {
    // Asset loading & manager initialization
    // check if all JSON assets are loaded
    if (all_ship_data && all_ammo_data) {
        // Create managers AFTER data has loaded
        // ---- Start Background Environment ----
        environment = new EnvironmentManager(unit, all_environment_images);

        // ---- Initialise Player and Enemies ----
        player = new PlayerManager(player_ship_name, all_players_images, all_ship_data);  // updated for new parameters
        enemies = new EnemyManager(all_enemy_images, all_enemies_data);

        // ---- Initialize Projectiles -----
        projectiles = new ProjectileManager(unit, all_ammo_data, all_enemies_data, all_ammo_images, all_explosions);
    }
    return; // skip until it's loaded
}


function store_results(){
    const formatted_time = `${String(end_game_time.getHours()).padStart(2,'0')}:${String(end_game_time.getMinutes()).padStart(2,'0')} ${String(end_game_time.getDate()).padStart(2,'0')}-${String(end_game_time.getMonth()+1).padStart(2,'0')}-${end_game_time.getFullYear()}`;
    const new_player = {
        player_name: "you",
        time: formatted_time,
        score: projectiles.player_score
    };

    leaderboard.push(new_player);
    leaderboard.sort((a, b) => b.score - a.score); // descending

    new_score_added = true;
}
