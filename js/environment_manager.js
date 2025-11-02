import { tad, make, load } from "../lib/TeachAndDraw.js";

export class EnvironmentManager {
    constructor(unit) {
        this.unit = unit;
        this.level = 1;

        this.generators = this.make_generators();
        this.buildings = make.group();
        this.space = make.group();
        this.mountains = make.group();

        this.space1 = load.image(tad.w/2, 0, "./images/background/space1.jpeg");
        this.space2 = load.image(tad.w/2, tad.h, "./images/background/space2.jpeg");
        
    }

    // DRAW updated background elements
    update() {
        // CREATE tiles if generator is empty
        this.activate_generators();

        // DRAW all items
        this.draw_space();
    }

    draw_space() {
        // move grass down
        const SPEED = 0.4
        this.space1.y+=SPEED;
        this.space2.y+=SPEED;
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
            console.log("made a generator!");
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