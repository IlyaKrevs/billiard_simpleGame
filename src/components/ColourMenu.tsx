import React, { useState } from 'react'
import classes from './style.module.css'

interface IColourMenu {
    menuPos: { x: number, y: number },
    showMenu: boolean,
    closeMenu: () => void,
    setBallColor: (value: string) => void
}

export default function ColourMenu({ menuPos, showMenu, closeMenu, setBallColor }: IColourMenu) {

    const colours = ['red', 'blue', 'green', 'yellow', 'pink']

    function clickHanlder(value: string) {
        setBallColor(value)
        closeMenu()
    }

    return (
        <>
            {showMenu && <div
                style={{
                    top: menuPos.y,
                    left: menuPos.x,
                }}
                className={classes.mainContainer}
                onMouseLeave={() => closeMenu()}
            >
                {colours.map((item, index) => (
                    <div
                        key={index}
                        className={classes.simpleItem}
                        style={{ backgroundColor: item }}
                        onClick={() => clickHanlder(item)}
                    ></div>
                )
                )}
            </div>}
        </>
    )
}
