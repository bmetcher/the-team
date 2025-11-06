import { tad, make, time, math } from "../lib/TeachAndDraw.js";

const FLY_IN_TIME = 5;

let speed = 1;
const FINAL_SPEED = 0.4;
const amt_to_reduce_by = (speed - FINAL_SPEED) / (FLY_IN_TIME * time.fps);

export class EnvironmentManager {
    constructor(unit, all_environment_images) {
        this.unit = unit;
        this.images = all_environment_images;
        this.level = 1;

        this.generators = this.make_generators();

        this.all = make.group();
        this.rocks = make.group();


        this.space1 = this.images.space1;
        this.space1.h = tad.h;
        this.space1.w *= 1.5;
        
        this.space2 = this.images.space2;
        this.space2.h = tad.h;
        this.space2.w *= 1.5;

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
            if (debris.x < 0 || debris.x > tad.w || debris.y > tad.h) {
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

        console.log("Tad.h: ", tad.h, " space1.height: ", this.space1.h);
        if (this.space1.y > tad.h * 1.5) {
            this.space1.y -= 2 * tad.h;
        }
        if (this.space2.y > tad.h * 1.5) {
            this.space2.y -= 2 * tad.h;
        }
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
        if (!this.generators.collides(this.all)) {
            for (let generator of this.generators) {
                if (math.round(math.random(0, 444)) === 444) {
                    console.log("got 99!");
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