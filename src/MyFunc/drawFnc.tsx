import { IBall } from "../App"

export function drawBall(context: CanvasRenderingContext2D, ballProps: IBall): void {
    context.beginPath()
    context.arc(ballProps.x, ballProps.y, ballProps.radius, 0, Math.PI * 2)
    context.fillStyle = ballProps.color
    context.fill()
    context.closePath()
}

export function clear(canvas: React.RefObject<HTMLCanvasElement>): void {
    canvas.current?.getContext('2d')?.clearRect(0, 0, canvas.current.width, canvas.current.height)
}

export function speedDeceleration(value: number, positiveArg = 0.01): number {
    if (value > 0) {
        if (value - positiveArg < 0) {
            value = 0
        } else {
            value = value - positiveArg
        }
    }

    if (value < 0) {
        if (value + positiveArg > 0) {
            value = 0
        } else {
            value = value + positiveArg
        }
    }

    return value
}