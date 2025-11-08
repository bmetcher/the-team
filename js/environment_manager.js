import { tad, make, time, math } from "../lib/TeachAndDraw.js";

let fly_in_time = 300;

const INIT_SPEED = 2;
const FINAL_SPEED = 0.4;
const AMT_TO_REDUCE_BY = (INIT_SPEED - FINAL_SPEED) / fly_in_time;

export class EnvironmentManager {
    constructor(all_environment_images) {
        // ---- Load all background images ----
        this.images = all_environment_images;
        // Read background image size (for later)
        this.bg_height = this.images.stars1.h;  // should be 1620        this.game_paused = false;

        this.speed = INIT_SPEED
        this.stored_speed = this.speed;

        this.bg_width = this.images.stars1.w;   // should be 1080
        //console.log("bg_height: ", this.bg_height, " & bg_width: ", this.bg_width);

        // ---- Load Background Images ----
        this.stars1 = this.images.stars1;
        this.stars2 = this.images.stars2;
        this.dust1 = this.images.dust1;
        this.dust2 = this.images.dust2;
        this.nebula1 = this.images.nebula1; // ** nebula not implemented yet
        this.nebula2 = this.images.nebula2;

        // ---- Generating Environment Debris ----
        this.rate = 8;          // how many generators
        this.chaos = 1000;     // '1 in "chaos" chance' to generate debris (per frame)
        
        // Generators to create debris (8 by default above the canvas)
        this.generators = this.create_generators(this.rate);   

        // Groups for tracking randomly-generated debris
        this.all_debris = make.group();
        this.debris_one = make.group();
        this.debris_two = make.group();
        this.debris_three = make.group();
    }

    create_background() {
        this.add_image_pair("stars");
    }


    pause(){
        if (!this.game_paused){
            this.stored_speed = this.speed;
            this.game_paused = true;
        }
        this.speed = 0;
    }


    play(){
        this.game_paused = false;
        this.speed = this.stored_speed;
    }



    pause(){
        if (!this.game_paused){
            this.stored_speed = this.speed;
            this.game_paused = true;
        }
        this.speed = 0;
    }


    play(){
        this.game_paused = false;
        this.speed = this.stored_speed;
    }

    draw_space(type) {
        // move grass down
        if (!this.game_paused && fly_in_time > 0){
            this.speed -= AMT_TO_REDUCE_BY;
            fly_in_time--;
        }
        this.stars1.y+=speed;
        this.stars2.y+=speed;
        this.dust1.y+=speed*2;
        this.dust2.y+=speed*2;

        this.nebula1.y+=speed*3;
        this.nebula2.y+=speed*3;

        // when it moves below the bottom -> move above the top
        if (this.stars1.y > tad.h * 1.8) {
            this.stars1.y -= this.bg_height * 2;
        }
        if (this.stars2.y > tad.h * 1.8) {
            this.stars2.y -= this.bg_height * 2;
        }
        if (this.nebula1.y > tad.h * 1.8) {
            this.nebula1.y -= this.bg_height * 2;
        }
        if (this.nebula2.y > tad.h * 1.8) {
            this.nebula2.y -= this.bg_height * 2;
        }
        if (this.dust1.y > tad.h * 1.8) {
            this.dust1.y -= this.bg_height * 2;
        }
        if (this.dust2.y > tad.h * 1.8) {
            this.dust2.y -= this.bg_height * 2;
        }


        // Draw all background items in order of their layers
        this.stars1.draw();
        this.stars2.draw();
        this.debris_one.draw();

        this.dust1.draw();
        this.dust2.draw();
        this.debris_two.draw();

        //this.nebula1.draw();
        //this.nebula2.draw();
        this.debris_three.draw();
    }

    // DRAW updated background elements
    update() {
        if (time.frameCount === 0) {
            this.create_background();
        }

        this.draw_space();

        // Have generators create debris
        this.activate_generators();
        // clean up out-of-bounds debris
        this.clean_up_debris();

        
    }

    // Create a line of invisible debris generators just above the canvas
    create_generators(amount) {
        const result = make.group();
        let unit = tad.width / amount;  // based on the amount of generators to make

        for (let i = 0; (i * unit) < tad.width; i++) {
            const temp = make.boxCollider(i * unit, 0 - unit * 2, unit, unit);
            temp.x += unit/2;
            temp.static = true;
            temp.color = null;
            temp.speed = 0;
            result.push(temp);
        }

        return result;
    }


    // Trigger each generator to try and generate a debris  (per frame)
    activate_generators() {
        // We use colliders to check they haven't already recently created debris (overlap)
        if (!this.generators.overlaps(this.all_debris)) {
            
            for (let generator of this.generators) {
                
                // Check if the "choas" number was generated randomly
                if (math.round(math.random(0, this.chaos)) === this.chaos) {
                    
                    console.log("generator activated! \ndebris at: ", generator.x, " ", generator.y);
                    let value = math.ceiling(math.random(0, 15));
                    
                    if (0 < value && value < 5) {  // layer 1
                        this.make_debris(generator, value, "debris_one");
                        
                    } else if (5 < value && value < 10) {  // layer 2
                        this.make_debris(generator, value, "debris_two");
                        
                    } else if (10 < value && value < 15) {  // layer 3
                        this.make_debris(generator, value, "debris_three");
                    }
                }
            }
        }
    }

    // Create a random debris
    make_debris(generator, value, layer) {
        let debris = make.boxCollider(generator.x, generator.y, value, value);
        debris.rotationalVelocity = value/2;    // roughly += 8 degree limit
        debris.speed = value;
        debris.friction = 0;
        debris.direction = 180;
        let asset_rng = value * 20; // 0 to 300
        console.log(asset_rng);
        if (asset_rng > 0 && asset_rng <= 30) {
            debris.asset = this.images.fossil;
        } else if (asset_rng > 30 && asset_rng <= 150) {
            debris.asset = this.images.rock2;
        } else if (asset_rng > 150) {
            debris.asset = this.images.rock1;
        }
        debris.asset.scale = 90 * asset_rng/200;
        if (math.round(math.random(0,this.chaos**2)) === this.chaos**2) {
            debris.asset = this.images.rock3;
            debris.speed = 8;
            debris.asset.scale = 50;
            layer = "debris_one";
        }
        this.all_debris.push(debris);
        this[layer].push(debris);
    }

    // Remove any debris that is leaves the canvas
    clean_up_debris() {
        for (let debris of this.all_debris) {
            // if out-of-bounds -> remove it
            if (debris.x - 100 < 0 || debris.x + 100 > tad.w || 
                debris.y  < -500 || debris.y + 100 > tad.h) {
                //console.log("Debris removed: ", debris);
                debris.remove();
            }
        }
    }
}