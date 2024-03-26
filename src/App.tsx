import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Ball, IBall } from './MyClasses/Ball';
import { Board } from './MyClasses/Board';
import ColourMenu from './components/ColourMenu';



function App() {

  const [showMenu, setShowMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const mouseCoords = {
    x: 0,
    y: 0,
  }
  let idChosenBall: React.MutableRefObject<number> = useRef(-1)

  const boardSize = {
    width: 800,
    height: 600,
  }

  const ballsProps: IBall[] = [
    { id: 1, pos: { x: 100, y: 100 }, radius: 10, color: 'red', speed: { dx: 0, dy: 0 } },
    { id: 2, pos: { x: 200, y: 200 }, radius: 20, color: 'blue', speed: { dx: 0, dy: 0 } },
    { id: 3, pos: { x: 300, y: 300 }, radius: 30, color: 'green', speed: { dx: 0, dy: 0 } },
  ]

  const myBalls = useRef(ballsProps.map(ball => new Ball(ball)))

  const menuActions = {
    openContextMenu: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()
      if (idChosenBall.current === -1) {
        return
      }
      setMenuPos({ x: e.clientX, y: e.clientY })
      setShowMenu(true)

    },

    closeMenu: () => {
      setShowMenu(false)
    },

    setBallColor: (value: string) => {
      if (idChosenBall.current === -1) {
        return
      }
      const currentBall = myBalls.current.find(item => item.id === idChosenBall.current)
      if (currentBall) {
        currentBall.color = value
      }
    }
  }

  const mouseActions = {
    mouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => {

      mouseCoords.x = e.nativeEvent.offsetX
      mouseCoords.y = e.nativeEvent.offsetY

      const isInsideBall = (mousePos: { x: number, y: number }, ball: IBall) => {
        const dx = mousePos.x - ball.pos.x
        const dy = mousePos.y - ball.pos.y
        return dx ** 2 + dy ** 2 < ball.radius ** 2
      }

      for (let i = 0; i < myBalls.current.length; i++) {
        if (isInsideBall(mouseCoords, myBalls.current[i])) {
          idChosenBall.current = myBalls.current[i].id
          break;
        }
      }

    },

    mouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (idChosenBall.current !== -1) {
        mouseCoords.x = e.nativeEvent.offsetX
        mouseCoords.y = e.nativeEvent.offsetY
      }
    },

    mouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button !== 0) {
        return
      }

      if (idChosenBall.current !== -1) {
        const currentBall = myBalls.current.find(item => item.id === idChosenBall.current)
        if (currentBall) {
          currentBall.setSpeed({
            dx: (mouseCoords.x - currentBall.pos.x) / 25,
            dy: (mouseCoords.y - currentBall.pos.y) / 25,
          })
        }
        idChosenBall.current = -1
      }
    }
  }

  useEffect(() => {

    const animation = () => {
      const canvas = canvasRef.current
      if (canvas !== null) {
        const context = canvas.getContext('2d')

        if (context) {
          const myBoard = new Board({ size: boardSize, context: context })
          myBoard.clear()

          myBalls.current.forEach(ball => {
            ball.oneMove()
            ball.handleHitBoard(myBoard)

            myBalls.current.forEach(anotherBall => {
              if (anotherBall !== ball) {
                if (ball.detectHitAnotherBall(anotherBall)) {
                  ball.handleHitBall(anotherBall)
                }
              }
            })
            myBoard.drawBall(ball)
          })
        }
      }

      requestAnimationFrame(animation)
    }
    animation()
  }, [myBalls])

  return (
    <div className="App">
      <canvas
        className='myCanvas'
        ref={canvasRef}
        onMouseDown={(e) => mouseActions.mouseDown(e)}
        onMouseMove={(e) => mouseActions.mouseMove(e)}
        onMouseUp={(e) => mouseActions.mouseUp(e)}
        onContextMenu={(e) => menuActions.openContextMenu(e)}
      >
      </canvas>
      <ColourMenu
        showMenu={showMenu}
        menuPos={menuPos}
        closeMenu={menuActions.closeMenu}
        setBallColor={menuActions.setBallColor}
      />
    </div >
  );
}

export default App;
