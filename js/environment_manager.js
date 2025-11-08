import { tad, make } from "../lib/TeachAndDraw.js";

let fly_in_time = 300;

const INIT_SPEED = 2;
const FINAL_SPEED = 0.4;
const AMT_TO_REDUCE_BY = (INIT_SPEED - FINAL_SPEED) / fly_in_time;

export class EnvironmentManager {
    constructor(unit, all_environment_images) {
        this.unit = unit;
        this.level = 1;
        this.game_paused = false;

        this.speed = INIT_SPEED
        this.stored_speed = this.speed;

        this.generators = this.make_generators();
        this.buildings = make.group();
        this.space = make.group();
        this.mountains = make.group();

        this.space1 = all_environment_images.space1;
        this.space2 = all_environment_images.space2;
    }

    // DRAW updated background elements
    update() {
        // CREATE tiles if generator is empty
        this.activate_generators();

        // DRAW all items
        this.draw_space();
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


    draw_space() {
        // move grass down
        if (!this.game_paused && fly_in_time > 0){
            this.speed -= AMT_TO_REDUCE_BY;
            fly_in_time--;
        }
        this.space1.y+=this.speed;
        this.space2.y+=this.speed;
        // when it moves below the bottom -> move above the top
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
            const temp = make.boxCollider(i * this.unit, 0 - this.unit, this.unit, this.unit);
            temp.x += this.unit/2;
            temp.static = true;
            temp.color = null;
            temp.speed = 0;
            result.push(temp);
        }

        return result;
    }


    activate_generators() {
        if (!this.generators.collides(this.space)) {
            for (let generator of this.generators) {
                this.make_tile(generator.x, generator.y);
            }
        }
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