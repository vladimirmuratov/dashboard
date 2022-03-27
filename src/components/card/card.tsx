import React from "react";
import {TCard} from "../../types";
import styles from "./card.module.css";
import {useDrag} from "react-dnd";

type TProps = {
    onRemove: (id: string) => void;
} & TCard

export const Card: React.FC<TProps> = ({id, text, color, onRemove}): JSX.Element => {
    const [{isDrag}, dragRef] = useDrag(() => ({
        type: "card",
        item: {id},
        collect: monitor => ({
            isDrag: monitor.isDragging()
        })
    }))

    return (
        <>
            {!isDrag &&
            (<div ref={dragRef} className={styles.card_container} style={{backgroundColor: color}}>
                <span
                    className={styles.card_container__remove_icon}
                    onClick={() => onRemove(id)}
                >
                    &times;
                </span>
                <h3>{text}</h3>
            </div>)
            }
        </>
    )
}