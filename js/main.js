import { tad, text, keys, make, time, camera } from "../lib/TeachAndDraw.js";
import { EnemyManager } from "./enemy_manager.js";
import { EnvironmentManager } from "./environment_manager.js";
import { PlayerManager } from "./player_manager.js";
import { ProjectileManager } from "./projectile_manager.js";
import { assets } from "./load.js";
import { Timer } from "./timer.js";

// ----------------------------------------- Initialisation for Game -----------------------------------------

// ---- Game Size ----
const unit = 64;        // for projectile and environment initialisation
tad.w = 720;
tad.h = 1080;

// ---- Preload Assets ----
const menu_intro_txt = assets.menu_intro_txt;
const all_players_images = assets.all_players_images;
const all_ammo_images = assets.all_ammo_images;
const all_explosions = assets.all_explosions;
const all_effects = assets.all_effects;
const all_sounds = assets.all_sounds;
const all_enemy_images = assets.all_enemy_images;
const all_environment_images = assets.all_environment_images;
const all_ammo_data = assets.all_ammo_data;
const all_ship_data = assets.all_ship_data;
const all_enemies_data = assets.all_enemies_data;
let leaderboard = assets.leaderboard;

let new_score_added = false;    // to ensure only adding new player scores once per game (instead of updating every frme)


// --------------------------------------- Initialisation for Screens ---------------------------------------

// ---- Define Screens ----
const INTRO = 0;            // display game name; press space key to continue (i.e. initial screen)
const MAIN_MENU = 1;        // player selects prepare OR navigates to LEADERBOARD OR navigates to TUTORIAL
const PREPARE = 2;          // player selects a ship + displays ship controls; navigates to MAIN MENU or GAME
const LEADERBOARD = 3;      // displays top scores so far + stored; navigate to MAIN MENU
const TUTORIAL = 4;         // explains how game works
const CONTROLS = 5;         // explains ship game controls
const PLAY = 6;             // actual game
const PAUSE = 7;            // pauses game + shows game statrs; navigates to review controls OR return to game OR end game
const END_GAME = 8;         // after game ends: show message and score; navigate to PREPARE (to play again) or MAIN MENU

// ---- Preload Assets ----
// Images
const game_screens = assets.game_screens;
const img_pause_button = assets.img_pause_button;
// Files
const game_controls_data = assets.game_controls_data;
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
const BUTTON_SMALL_BOTTOM_Y =  tad.h - (tad.w-BUTTON_SMALL_RIGHT_X);
const BUTTON_LRG_BOTTOM_Y = tad.h - (tad.w-BUTTON_LRG_RIGHT_X) + 100;
// Creation
const buttons = {
    go_to_prepare: create_menu_button("large", "prepare for launch"),
    go_to_leaderboard: create_menu_button("large", "galactic leaderboard"),
    go_to_tutorial: create_menu_button("large", "briefing"),
    return_to_main_menu: create_menu_button("large", "return to mission base"),
    go_to_play: create_menu_button("large", "launch now"),
    return_to_pause: create_menu_button("large", "return"),
    go_to_controls: create_menu_button("large", "review controls"),
    go_to_pause: create_menu_button("small", "p"),
    return_to_game: create_menu_button("large", "resume mission"),
    end_game: create_menu_button("large", "end mission"),
    play_again: create_menu_button("large", "play again"),
}

// ---- Dropdown ----
const ship_name_map = {
    "Default Ship": "default_ship",
    "Tank Ship": "tank_ship"
};
const DROPDOWN_Y = HIGHEST_NON_TITLE_TEXT+50;
const player_ship_dropdown = create_dropwdown(Object.keys(ship_name_map), DROPDOWN_Y);

// ---- Global Variables ----
let environment, player, enemies, projectiles;      // game elements manager variables
let game_in_progress = false;                       // to determine if game elements should be initialised: is game in progress
let end_game_time;                                  // holds time game ended to add as state to leaderboard
let current_screen = INTRO;                         // track current screen; initialise to intro screen


// ---- Camera Global Variables ----
let camera_start_x = tad.w/2;
let camera_start_y = tad.h/2;
let camera_prev_x = camera_start_x
let camera_prev_y = camera_start_y;


// ------------------------------------------------- Update -------------------------------------------------

tad.use(update);
// tad.debug = true;

// Main draw loop
function update() {
    
    if (time.frameCount===0){
        leaderboard = Object.values(leaderboard) // convert to array
    }

    if (current_screen === INTRO){
        // display game name; press space key to continue (i.e. initial screen)
        display_intro_screen();
    } else if (current_screen === MAIN_MENU){
        // player selects prepare OR navigates to LEADERBOARD OR navigates to TUTORIAL
        display_main_menu_screen();
        play_music(current_screen);
    } else if (current_screen === PREPARE){
        // player selects a ship + displays ship controls; navigates to MAIN MENU or GAME
        display_prepare_screen();
    } else if (current_screen === LEADERBOARD){
        // displays top scores so far + stored; navigate to MAIN MENU
        display_leaderboard_screen();
    } else if (current_screen === TUTORIAL){
        // explains how game works
        display_tutorial_screen();
    } else if (current_screen === CONTROLS){
        // explains ship game controls
        display_controls_screen();
    } else if (current_screen === PLAY){
        // actual game
        display_play_screen();
        play_music(current_screen);
    } else if (current_screen === PAUSE){
        // pauses game + shows game statrs; navigates to review controls OR return to game OR end game
        display_pause_screen();
        play_music(current_screen);
    } else if (current_screen === END_GAME){
        // after game ends: show message and score; navigate to PREPARE (to play again) or MAIN MENU
        display_end_game_screen();
        play_music(current_screen);
    }
    
}


// --------------------------------------------- Display Screens ---------------------------------------------

function display_intro_screen(){
    // intro screen image
    game_screens.intro_screen.draw();

    // game name text
    text.colour = TXT_COL_1;
    text.alignment.x = "center";
    text.size = 175;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/10*1.5, "agalag");

    // directions to continue text
    text.size = 18;
    text.font = fonts.pixel_italic;
    text.print(tad.w/2, tad.h/10*8.6, "press space key to continue");

    // change screens logic
    if (keys.down(" ")){
        current_screen = MAIN_MENU;
    }
}


function display_main_menu_screen(){
    // main menu screen image
    game_screens.main_menu_screen.draw();

    // menu title text
    display_menu_title("mission base");

    // welcome message
    display_txt(menu_intro_txt[0], 35, TXT_COL_1, 74, tad.w/8*5, "center", tad.w/2);

    // display intro text
    display_txt(menu_intro_txt[1], 228, TXT_COL_1, 23, tad.w/8*5, "center", tad.w/2, fonts.pixel_italic);

    // change screens logic
    check_buttons();        

    // menu buttons
    const TOP_BUTTON_POSITION = tad.h/50*36;
    const GAP_BETW_BUTTONS = buttons.go_to_prepare.h * 1.5;
    draw_button(buttons.go_to_prepare, tad.w/2, TOP_BUTTON_POSITION);                                   // to prepare for game
    draw_button(buttons.go_to_tutorial, tad.w/2, buttons.go_to_prepare.y + GAP_BETW_BUTTONS);       // to view game tutorial
    draw_button(buttons.go_to_leaderboard, tad.w/2, buttons.go_to_tutorial.y + GAP_BETW_BUTTONS);        // to view leaderboard
}


function display_prepare_screen(){
    // prepare menu screen image
    game_screens.prepare_screen.draw();    

    // menu title text
    display_menu_title("preparations");   
    
    // dropdown menu to select player ship
    display_txt("select your ship");
    player_ship_dropdown.draw();

    // draw selected ship
    draw_ship();

    // display instruction on how to control ship
    display_txt("to control your ship:", 330);
    display_controls(365);

    // change screens logic
    check_buttons();

    // menu buttons
    draw_button(buttons.return_to_main_menu, BUTTON_LRG_LEFT_X, BUTTON_LRG_BOTTOM_Y);   // to return to main menu
    draw_button(buttons.go_to_play, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);           // to go to game
}


function display_leaderboard_screen(){
    // leaderboard screen image
    game_screens.leaderboard_screen.draw();

    // menu title text
    display_menu_title("galactic leaderboard");

    // display leaderboard statistics
    display_leaderboard();

    // change screens logic
    check_buttons();    

    // menu buttons
    draw_button(buttons.return_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);    // to return to main menu
}


function display_tutorial_screen(){
    // tutorial screen image
    game_screens.tutorial_screen.draw();

    // menu title text
    display_menu_title("briefing");

    // display tutorial instructions from tutorial.txt
    let offset = 30;
    for (const this_line of game_tutorial_txt){
        display_txt(this_line, offset);
        offset +=30;
    }

    // change screens logic
    check_buttons();    

    // menu buttons
    draw_button(buttons.return_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);  // to return to main menu
}


function display_controls_screen(){
    // controls screen image
    game_screens.controls_screen.draw();

    // menu title text
    display_menu_title("controls");

    // display game controls for ship (from controls.json)
    display_controls();

    // change screens logic
    check_buttons();  
    
    // menu buttons
    draw_button(buttons.return_to_pause, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);   // to return to pause screen
}


function display_play_screen(){
    // update game elements
    environment.update();
    projectiles.update(player, enemies);
    player.update();
    enemies.update();

    // change screens logic
    check_buttons(projectiles.game_over, enemies.won);   

    // pause button
    // coords to stay fixed on screen
    const fixedScreenX = tad.w - 50;
    const fixedScreenY = 50;
    const worldPos = camera.screenToWorld(fixedScreenX, fixedScreenY);  // convert screen coords to world coords
    draw_button(buttons.go_to_pause, worldPos.x, worldPos.y);      // to go to pause screen

    // image for pause button
    //img_pause_button.movedByCamera = false;
    img_pause_button.x = worldPos.x;
    img_pause_button.y = worldPos.y;
    img_pause_button.scale = 80;
    img_pause_button.draw();
}


function display_pause_screen(){
    // Reset the camera from in-game effects
    camera.zoom = 1;
    camera.rotation = 0;
    camera_prev_x = camera.x;
    camera.x = camera_start_x;
    camera_prev_y = camera.y;
    camera.y = camera_start_y;
        
    // pause screen image
    game_screens.pause_screen.draw()    // display pause screen image

    // menu title text
    display_menu_title("mission paused");     // pause menu title text

    // display player performance statistics so far
    display_stats();

    // change screens logic
    check_buttons();  
    
    // menu buttons
    draw_button(buttons.go_to_controls, tad.w/2, BUTTON_LRG_BOTTOM_Y-70);           // to review game controls
    draw_button(buttons.return_to_game, BUTTON_LRG_LEFT_X, BUTTON_LRG_BOTTOM_Y);    // to return to game
    draw_button(buttons.end_game, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);         // to end current game

    // variable to ensure adding player score for this game to leaderboard only once (instead of once every frame)
    new_score_added = false;
}


function display_end_game_screen(){
    // Reset the camera from in-game effects
    camera.zoom = 1;
    camera.rotation = 0;
    camera.x = tad.w/2;
    camera.y = tad.h/2;

    // end game screen image
    if (enemies.won){
        game_screens.victory_screen.draw();
        // menu title text
        display_menu_title("you won!");     // game over menu title text
    } else {
        game_screens.end_game_screen.draw();
        // menu title text
        display_menu_title("game over!");     // game over menu title text
    }


    // if not alread added, add new player score to game results
    if (!new_score_added){
        store_results();
    }

    // display player results for this game just finished
    display_results(enemies.won);

    // change screens logic
    check_buttons();   
    
    // menu buttons
    draw_button(buttons.play_again, BUTTON_LRG_LEFT_X, BUTTON_LRG_BOTTOM_Y);            // to got to prepare screen to play again
    draw_button(buttons.return_to_main_menu, BUTTON_LRG_RIGHT_X, BUTTON_LRG_BOTTOM_Y);  // to return to main menu
}

// ------------------------------------------  Button Helper Functions ------------------------------------------

function create_menu_button(button_size, button_text){
    // Generic method to create all game buttons

    let button_width;
    let button_height;

    // set dimensions for large buttons
    if (button_size==="large"){
        button_width = 225;
        button_height = 40;
    } else {    // set dimensions for small button
        button_width = 38;
        button_height = 38;
    }

    const tmp = make.button(0,0, button_width, button_height, button_text);
    tmp.background = "rgb(2,12,27)";
    tmp.textColour = TXT_COL_2;
    return tmp;
}


function draw_button(button, desired_x, desired_y){
    // Generic method to draw each game button to specified x,y position

    text.font = fonts.pixel_regular;
    text.size = 16;
    button.x = desired_x;
    button.y = desired_y;
    button.draw();
}


function check_buttons(game_over, player_won){
    // Checks to see if any button has been pressed, and performs relevant state changes and redirects.

    if (buttons.go_to_prepare.released || buttons.play_again.released){     // to prepare screen
        current_screen = PREPARE;

    } else if (buttons.go_to_leaderboard.released){     // to leaderboard screen
        current_screen = LEADERBOARD;

    } else if (buttons.go_to_tutorial.released){        // to tutorial screen
        current_screen = TUTORIAL;
    
    } else if (buttons.return_to_main_menu.released){   // to main menu screen
        current_screen = MAIN_MENU;

    } else if (buttons.end_game.released || game_over || player_won){              // to end game screen
        end_game_time = new Date();     // to hold time game ended, for leaderboard stat
        game_in_progress = false;       // to ensure that, if new game started, game elements are re-initialised
        current_screen = END_GAME;

    } else if (buttons.go_to_play.released){            // to play screen (to start new game)
        if (!game_in_progress){
            initial_setup(ship_name_map[player_ship_dropdown.value]);       // initialise game elements
            game_in_progress = true;    // to ensure that game is not re-initialised every frame
        }
        current_screen = PLAY;
        
    } else if (buttons.return_to_game.released || (current_screen===PAUSE && keys.released("Escape"))){        // to play screen (to resume existing game)
        current_screen = PLAY;
        camera.x = camera_prev_x;
        camera.y = camera_prev_y;
        // return all game elements to play mode
        environment.play();
        player.play();
        enemies.play();
        projectiles.play();
        
    } else if (buttons.go_to_controls.released){        // to player ship controls screen
        current_screen = CONTROLS;
        
    } else if (buttons.go_to_pause.released || buttons.return_to_pause.released || (current_screen===PLAY && keys.released("Escape"))){   // to pause game screen
        current_screen = PAUSE;
        // pause all game elements
        environment.pause();
        player.pause();
        enemies.pause();
        projectiles.pause();
    } 
}


// -----------------------------------------  Dropdown Helper Functions -----------------------------------------
function create_dropwdown(options, y_position){
    // Generic method to create dropdown menus

    text.font = fonts.pixel_regular;
    const dropdown_width = 300;
    const tmp = make.dropdown( LEFT_X_NON_TITLE_TEXT + dropdown_width/2, y_position, dropdown_width, options);
    tmp.openDirection = "down";
    return tmp;
}


// ---------------------------------------- Text Display Helper Functions ----------------------------------------

function display_txt(
    display_text,
     y_offset=0, 
     text_colour=TXT_COL_2, 
     text_size=16, 
     text_width=tad.w/8*6, 
     x_alignment="left", 
     start_x=LEFT_X_NON_TITLE_TEXT, 
     font=fonts.pixel_regular){
    // Generic method to display (paragraph) text on game screens; used in TUTORIAL and PREPARE 
    //      Precondition: Assumes display_text is written using only one line

    text.size = text_size;
    text.font = font;
    text.alignment.x = x_alignment;
    text.alignment.y = "top";
    text.colour = text_colour;
    text.maxWidth = text_width;
    
    text.print(start_x, HIGHEST_NON_TITLE_TEXT+y_offset, display_text);
}


function display_menu_title(title){
    // Generic method to display menu titles

    text.colour = TXT_COL_1;
    text.size = 60;
    text.font = fonts.titles;
    text.print(tad.w/2, tad.h/8, title);
}


function display_controls(y_offset=0){
    // Used to display player ship controls; used in PREPARE and CONTROLS screens

    text.colour = TXT_COL_2;
    text.font = fonts.pixel_regular;
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
    for (const this_control of game_controls_data.controls){
        current_y += GAP_BETW_LINES;
        
        text.alignment.x = "right";
        text.print(tad.w/2-DIST_FROM_VERTICAL_CENTRE, current_y, this_control.action);
        
        text.alignment.x = "left";
        text.print(tad.w/2+DIST_FROM_VERTICAL_CENTRE, current_y, this_control.control);
    }
}


function display_stats(){
    // Displays player's statistics; used in PAUSE screen.

    let current_y = HIGHEST_NON_TITLE_TEXT;
    text.font = fonts.pixel_regular;
    text.colour = TXT_COL_2;

    // title 1
    text.size = 20;
    text.alignment.x = "center";
    text.print(tad.w/2, current_y, "Great Job!");

    // title 2
    text.size = 18;
    current_y += GAP_BETW_LINES + GAP_BETW_LINES;
    text.print(tad.w/2, current_y, "your stats so far:");

    // current score
    text.font = fonts.pixel_italic;
    current_y += GAP_BETW_LINES + GAP_BETW_LINES;
    text.print(tad.w/2, current_y, "your score");
    current_y += GAP_BETW_LINES;
    text.size = 30;
    text.print(tad.w/2, current_y, projectiles.player_score.toString());
}


function display_results(won){
    // Used to display results at end of game; used in END_GAME

    text.alignment.x = "center";
    text.alignment.y = "top";
    text.colour = TXT_COL_1;
    text.maxWidth = tad.w/8*6;

    // display a dynamic congratulatory message
    let messg;
    if (won){
        messg = ""
    } else {
        if (projectiles.player_score < 50){
            messg = "Good Effort!"
        } else if (projectiles.player_score < 75){
            messg = "Nice Job!"
        } else if (projectiles.player_score < 100){
            messg = "Congratulations!"
        } else if (projectiles.player_score > 100){
            messg = "Wow!! Fantastic Job!"
        }
    }
    text.font = fonts.pixel_regular;
    text.size=25;
    text.print(tad.w/2, HIGHEST_NON_TITLE_TEXT-40, messg);
    
    // display score
    text.font = fonts.pixel_italic;
    text.size=20;
    text.print(tad.w/2, HIGHEST_NON_TITLE_TEXT+10, "your score is:");
    text.font = fonts.pixel_regular;
    text.size=40;
    text.print(tad.w/2, HIGHEST_NON_TITLE_TEXT+40, projectiles.player_score.toString());
}


function display_leaderboard(){
    // Used to display stats from leaderboard; used in LEADERBOARD

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

    
    // actual scores for each player
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
        environment = new EnvironmentManager(all_environment_images);

        // ---- Initialise Player and Enemies ----
        player = new PlayerManager(player_ship_name, all_players_images, all_ship_data, all_effects, all_sounds);  // updated for new parameters
        enemies = new EnemyManager(all_enemy_images, all_enemies_data);

        // ---- Initialize Projectiles -----
        projectiles = new ProjectileManager(all_ammo_data, all_enemies_data, all_ammo_images, all_explosions, all_effects, all_sounds);
    }
    return; // skip until it's loaded
}


function store_results(){
    // Helper method to store player's new performance statistic
    //      Note: this data is not saved to leaderboard.json; it is only saved during runtime in 'leaderboard' array

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

function draw_ship(){
    const selected_ship = ship_name_map[player_ship_dropdown.value];
    let temp = all_players_images[selected_ship];
    temp.x = tad.w/2;
    temp.y = DROPDOWN_Y + 115 + all_ship_data[selected_ship].menu_offset;
    temp.scale = all_ship_data[selected_ship].menu_scale;
    temp.draw()
}

// Initialize as null
let current_music_playing = null;
// ---- Background Music Playing ----
function play_music(current) {
    if (current === MAIN_MENU) {
        // Menu Theme
        if (current_music_playing !== 'menu') {
            stop_all_music();
            all_sounds.menu.volume = 12;
            all_sounds.menu.maxCopies = 1;
            all_sounds.menu.play();
            current_music_playing = 'menu';
        }
    } else if (current === PLAY) {
        // Ingame Theme
        if (current_music_playing !== 'ingame') {
            stop_all_music();
            all_sounds.ingame.volume = 12;
            all_sounds.ingame.maxCopies = 1;
            all_sounds.ingame.play();
            current_music_playing = 'ingame';
        }
    } else if (current === PAUSE) {
        // Pause Theme
        if (current_music_playing !== 'pause') {
            stop_all_music();
            all_sounds.pause.volume = 12;
            all_sounds.pause.maxCopies = 1;
            all_sounds.pause.play();
            current_music_playing = 'pause';
        }
    } else if (current === END_GAME) {
        // Ending Theme
        if (current_music_playing !== 'ending') {
            stop_all_music();
            all_sounds.ending.volume = 12;
            all_sounds.ending.maxCopies = 1;
            all_sounds.ending.play();
            current_music_playing = 'ending';
        }
    }
}
// Helper for the music playing
function stop_all_music() {
    all_sounds.menu.stop();
    all_sounds.ingame.stop();
    all_sounds.pause.stop();
    all_sounds.ending.stop();
}