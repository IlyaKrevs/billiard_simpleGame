export interface IBall {
    id: number,
    pos: {
        x: number,
        y: number,
    },
    radius: number,
    color: string,
    speed: {
        dx: number,
        dy: number,
    }
}

export class Ball implements IBall {
    id: number;
    pos: { x: number; y: number; };
    radius: number;
    color: string;
    speed: { dx: number; dy: number; };

    constructor({ pos, radius, color, speed }: IBall) {
        this.id = Ball.myCounter()
        this.pos = pos;
        this.radius = radius
        this.color = color
        this.speed = speed
    }

    setColor(value: string) {
        this.color = value
    }

    setSpeed(speed: { dx: number, dy: number }) {
        this.speed.dx = speed.dx
        this.speed.dy = speed.dy
    }

    oneMove() {
        if (this.speed.dx !== 0 || this.speed.dy !== 0) {
            this.pos.x = this.pos.x + this.speed.dx
            this.pos.y = this.pos.x + this.speed.dy
            this.slowDown()
        }
    }

    slowDown(percent: number = 0.95, stopFactor = 0.05) {
        if (Math.abs(this.speed.dx) > stopFactor || Math.abs(this.speed.dy) > stopFactor) {
            this.speed.dx = this.speed.dx * percent
            this.speed.dy = this.speed.dy * percent
        } else {
            this.speed.dx = 0
            this.speed.dy = 0
        }
    }

    static myCounter: () => number = (function (): () => number {
        let counter: number = 0;
        return function (): number {
            return ++counter;
        };
    })();
}
