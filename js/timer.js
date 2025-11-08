import { tad, time, math } from "../lib/TeachAndDraw.js";

export class Timer {
    constructor(duration) {
        this.duration = duration * 1000;    // convert seconds to ms
        this.startTime = 0;
        this.finished = false;
        this.running = false;
    }

    start() {
        this.elapsed = 0;
        this.finished = false;
        this.running = true;
    }

    update() {
        if (!this.running) return;

        this.elapsed += time.msElapsed;   // by time elapsed ("delta time")

        if (this.elapsed >= this.duration) {
            this.finished = true;
            this.running = false;   // stop running
        }
    }

    done() {
        return this.finished;
    }

    get_percentage() {
        if (!this.running) return this.finished ? 1.0 : 0.0;
        return Math.min(this.elapsed / this.duration, 1.0);
    }

    // 
    intervals(interval_count) {
        if (!this.running) return 0;
        const intervalDuration = this.duration / interval_count;
        return Math.floor(this.elapsed / intervalDuration);
    }
    
}