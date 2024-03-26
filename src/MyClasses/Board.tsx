import { IBall } from "./Ball";

export interface IBoard {
    size: {
        width: number,
        height: number,
    },
    context: CanvasRenderingContext2D,
    clear: () => void,
    drawBall(ball: IBall): void
}

export class Board implements IBoard {
    size: { width: number; height: number; };
    context: CanvasRenderingContext2D;


    constructor({ size, context }: IBoard) {
        this.size = size
        this.context = context
        context.canvas.width = this.size.width
        context.canvas.height = this.size.height
    }

    clear(): void {
        this.context.clearRect(0, 0, this.size.width, this.size.height)
    }

    drawBall(ball: IBall): void {
        this.context.beginPath()
        this.context.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2)
        this.context.fillStyle = ball.color
        this.context.fill()
    }
}

