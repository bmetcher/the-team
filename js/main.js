import { tad, shape, make } from "../lib/TeachAndDraw.js";

tad.use(update);
tad.debug = true;

const state = {

}

console.log("hi")
function update() {
    console.log("testing!");
    shape.square(200, 200, 60, 30);
    shape.square(400, 400, 35, 72);
}