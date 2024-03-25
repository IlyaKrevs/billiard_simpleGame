import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { clear, drawBall, speedDeceleration } from './MyFunc/drawFnc';
import ColourMenu from './components/ColourMenu';


export interface IBall {
  id: number,
  x: number,
  y: number,
  radius: number,
  color: string,
  dx: number,
  dy: number,
}

function App() {

  const [showMenu, setShowMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [balls, setBalls] = useState<IBall[]>([
    { id: 1, x: 100, y: 100, radius: 10, color: 'red', dx: 0, dy: 0 },
    { id: 2, x: 200, y: 200, radius: 20, color: 'blue', dx: 0, dy: 0 },
    { id: 3, x: 300, y: 300, radius: 30, color: 'yellow', dx: 0, dy: 0 },
  ])

  const mouseCoord = useRef({ x: 0, y: 0 })
  const isMouseDown = useRef(false)
  const selectedBall = useRef(-1)





  const ballActions = {
    onMousePull: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, myCanvas = canvasRef) => {
      if (isMouseDown.current) {
        const rect = myCanvas.current?.getBoundingClientRect()
        mouseCoord.current.x = e.clientX - rect!.left
        mouseCoord.current.y = e.clientY - rect!.top
      }
    },

    kickTheBall: (e: React.MouseEvent, ballId: number = selectedBall.current, speed = 10) => {
      if (e.button !== 0) {
        return
      }

      if (ballId === -1) {
        return
      }

      if (isMouseDown.current) {
        isMouseDown.current = false
        setBalls((prevState) => {
          return prevState.map((ball) => {
            if (ballId === ball.id) {
              const myX = mouseCoord.current.x - ball.x
              const myY = mouseCoord.current.y - ball.y
              const myAngle = Math.atan2(myY, myX)

              return {
                ...ball,
                dx: Math.cos(myAngle) * speed,
                dy: Math.sin(myAngle) * speed,
              }
            } else {
              return ball
            }
          })
        })
      }

      selectedBall.current = -1
    },

    onMouseDown: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, myCanvas = canvasRef) => {
      isMouseDown.current = true
      ballActions.onChosenBall(e)
    },

    onChosenBall: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, myCanvas = canvasRef) => {
      const rect = myCanvas.current?.getBoundingClientRect()
      const mouseX = e.clientX - rect!.left
      const mouseY = e.clientY - rect!.top

      const result = balls.map((ball) => {
        const dx = mouseX - ball.x
        const dy = mouseY - ball.y
        const distance = Math.sqrt(dx ** 2 + dy ** 2)
        if (distance < ball.radius) {
          return ball
        }
      })

      const finish = result.filter(item => item)
      if (finish.length) {
        selectedBall.current = finish[0]!.id
      }
    }
  }



  const menuActions = {
    openContextMenu: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()
      ballActions.onChosenBall(e)
      if (selectedBall.current === -1) return
      setMenuPos({ x: e.clientX, y: e.clientY })
      setShowMenu(true)
    },

    closeMenu: () => {
      setShowMenu(false)
    },

    setBallColor: (value: string) => {
      setBalls((prev) => {
        return prev.map(item => {
          if (selectedBall.current === item.id) {
            return { ...item, color: value }
          } else {
            return item
          }
        })
      })
    },
  }



  useEffect(() => {

    const animation = () => {
      const canvas = canvasRef.current
      if (canvas !== null) {
        const ctx = canvas.getContext('2d')

        if (ctx) {
          clear(canvasRef)
          balls.forEach(ball => {
            ball.x += ball.dx;
            ball.y += ball.dy;

            ball.dx = speedDeceleration(ball.dx)
            ball.dy = speedDeceleration(ball.dy)

            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
              ball.dx = -ball.dx;
            }
            if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
              ball.dy = -ball.dy;
            }

            balls.forEach(otherBall => {
              if (otherBall !== ball) {
                const dx = otherBall.x - ball.x;
                const dy = otherBall.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < ball.radius + otherBall.radius) {

                  const angle = Math.atan2(dy, dx);
                  const sin = Math.sin(angle);
                  const cos = Math.cos(angle);

                  const vx1 = ball.dx * cos + ball.dy * sin;
                  const vy1 = ball.dy * cos - ball.dx * sin;
                  const vx2 = otherBall.dx * cos + otherBall.dy * sin;
                  const vy2 = otherBall.dy * cos - otherBall.dx * sin;

                  const vx1final = (vx1 + vx2) / 2;
                  const vx2final = (vx1 + vx2) / 2;

                  ball.x += vx1final * cos - vy1 * sin;
                  ball.y += vy1 * cos + vx1final * sin;
                  otherBall.x += vx2final * cos - vy2 * sin;
                  otherBall.y += vy2 * cos + vx2final * sin;

                  ball.dx = vx1final * cos - vy1 * sin;
                  ball.dy = vy1 * cos + vx1final * sin;
                  otherBall.dx = vx2final * cos - vy2 * sin;
                  otherBall.dy = vy2 * cos + vx2final * sin;
                }
              }
            });

            drawBall(ctx, ball)
          });
        }
      }

      requestAnimationFrame(animation)
    }
    animation()
  }, [balls])

  return (
    <div className="App">
      <canvas
        className='myCanvas'
        ref={canvasRef}
        height={`600px`}
        width={`800px`}

        onMouseDown={(e) => ballActions.onMouseDown(e)}
        onMouseMove={(e) => ballActions.onMousePull(e)}
        onMouseUp={(e) => ballActions.kickTheBall(e)}
        onContextMenu={(e) => menuActions.openContextMenu(e)}
      >
      </canvas>
      <ColourMenu
        showMenu={showMenu}
        menuPos={menuPos}
        closeMenu={menuActions.closeMenu}
        setBallColor={menuActions.setBallColor} />
    </div >
  );
}


export default App;
