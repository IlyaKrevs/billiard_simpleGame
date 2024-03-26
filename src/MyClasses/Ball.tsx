import { IBoard } from "./Board";

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

    constructor({ id, pos, radius, color, speed }: IBall) {
        this.id = id
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
            this.pos.y = this.pos.y + this.speed.dy
            this.slowDown()
        }
    }

    slowDown(percent: number = 0.99, stopFactor = 0.05) {
        if (Math.abs(this.speed.dx) > stopFactor || Math.abs(this.speed.dy) > stopFactor) {
            this.speed.dx = this.speed.dx * percent
            this.speed.dy = this.speed.dy * percent
        } else {
            this.speed.dx = 0
            this.speed.dy = 0
        }
    }


    handleHitBoard(board: IBoard): void {
        if (this.pos.x + this.radius > board.size.width || this.pos.x - this.radius < 0) {
            this.speed.dx = -this.speed.dx
        }
        if (this.pos.y + this.radius > board.size.height || this.pos.y - this.radius < 0) {
            this.speed.dy = -this.speed.dy
        }
    }


    detectHitAnotherBall(anotherBall: IBall): boolean {
        const dx = anotherBall.pos.x - this.pos.x
        const dy = anotherBall.pos.y - this.pos.y
        const distance = Math.sqrt(dx ** 2 + dy ** 2)
        return distance <= (this.radius + anotherBall.radius)
    }

    handleHitBall(anotherBall: this) {
        const dx = anotherBall.pos.x - this.pos.x
        const dy = anotherBall.pos.y - this.pos.y
        const distance = Math.sqrt(dx ** 2 + dy ** 2)

        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const vx1 = this.speed.dx * cos + this.speed.dy * sin;
        const vy1 = this.speed.dy * cos - this.speed.dx * sin;
        const vx2 = anotherBall.speed.dx * cos + anotherBall.speed.dy * sin;
        const vy2 = anotherBall.speed.dy * cos - anotherBall.speed.dx * sin;

        const vxFinal = (vx1 + vx2) / 2;


        this.pos.x = this.pos.x + (vxFinal * cos - vy1 * sin)
        this.pos.y = this.pos.y + (vy1 * cos + vxFinal * sin)

        anotherBall.pos.x = anotherBall.pos.x + (vxFinal * cos - vy2 * sin)
        anotherBall.pos.y = anotherBall.pos.y + (vy2 * cos + vxFinal * sin)

        this.setSpeed({
            dx: vxFinal * cos - vy1 * sin,
            dy: vy1 * cos + vxFinal * sin
        })

        anotherBall.setSpeed({
            dx: vxFinal * cos - vy2 * sin,
            dy: vy2 * cos + vxFinal * sin
        })

    }

}
