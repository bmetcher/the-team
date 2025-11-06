import { tad, make, time, math } from "../lib/TeachAndDraw.js";

const FLY_IN_TIME = 5;

let speed = 1;
const FINAL_SPEED = 0.4;
const amt_to_reduce_by = (speed - FINAL_SPEED) / (FLY_IN_TIME * 90); // 60 for fps

export class EnvironmentManager {
    constructor(all_environment_images) {
        this.images = all_environment_images;
        this.level = 1;

        this.generators = this.make_generators();

        this.all = make.group();
        this.rocks = make.group();


        this.images.space.alignment = "top";
        // initialize background images
        this.space1 = this.images.space;
        this.space2 = this.images.space;

        this.space1.x = tad.w/2;
        this.space2.x = tad.w/2;

        this.bg_height = this.space1.h;
        console.log("bg height: ", this.bg_height)
        console.log("tad height: ", tad.height);

        console.log("tad + bg/2: ", tad.height + this.bg_height/2);
        
        this.space1.y = 0;
        this.space2.y = -this.bg_height;

        //this.space1.movedByCamera = false;
        //this.space2.movedByCamera = false;
    }

    // DRAW updated background elements
    update() {
        // draw space background
        this.draw_space();

        // CREATE tiles if generator is empty
        this.activate_generators();

        // clean up out-of-bounds debris
        this.clean_up_all();

        this.all.draw();
    }

    // cull debris leaving the canvas
    clean_up_all() {
        for (let debris of this.all) {
            // if out-of-bounds -> remove it
            if (debris.x - 100 < 0 || debris.x + 100 > tad.w || debris.y - 100 > tad.h) {
                //console.log("Debris removed: ", debris);
                debris.remove();
            }
        }
    }

    draw_space() {
        // move grass down
        if (time.seconds < FLY_IN_TIME){
            speed -= amt_to_reduce_by
        }
        this.space1.y+=speed*5;
        this.space2.y+=speed*5;
        // when it moves below the bottom -> move above the top

        // if (this.space1.y > tad.h * 1.5) {
        //     this.space1.y -= 2 * this.bg_height;
        // }
        // if (this.space2.y > tad.h * 1.5) {
        //     this.space2.y -= 2 * this.bg_height;
        // }
        // draw them
        this.space1.draw();
        this.space2.draw();
    }

    make_generators() {
        const result = make.group();

        for (let i = 0; (i * this.unit) < tad.width; i++) {
            const temp = make.boxCollider(i * this.unit, 0 - this.unit * 2, this.unit, this.unit);
            temp.x += this.unit/2;
            temp.static = true;
            temp.color = null;
            temp.speed = 0;
            result.push(temp);
        }

        return result;
    }

    activate_generators() {
        if (!this.generators.overlaps(this.all)) {
            for (let generator of this.generators) {
                if (math.round(math.random(0, 420)) === 420) {
                    //console.log("got 420!");
                    this.make_rock(generator);
                }
            }
        }
    }

    make_rock(generator) {
        let rock = make.boxCollider(generator.x, generator.y, math.random(10, 50), math.random(20, 40));
        rock.rotationalVelocity = math.random(10, 30);
        rock.speed = math.random(5, 20);
        rock.friction = 0;
        rock.direction = 180;
        rock.asset = this.images.rock;
        rock.asset.scale *= math.random(0.5, 1.5);
        this.all.push(rock);
        this.rocks.push(rock);
    }

    make_tile(x, y) {
        const temp = make.boxCollider(x, y, this.unit, this.unit);
        temp.colour = "blue";
        temp.static = true;
        temp.direction = 180;
        temp.speed = 0;
        temp.friction = 0;
        temp.lifespan = 5;
        this.space.push(temp);
    }

}