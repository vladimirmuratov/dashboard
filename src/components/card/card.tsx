import React from "react";
import {Todo} from "../../types";
import styles from "./card.module.css";
import {useDrag} from "react-dnd";

interface IProps {
    item: Todo;
    onRemove: (id: string) => void;
}

export const Card: React.FC<IProps> = ({item, onRemove}): JSX.Element => {
    const {id, color, text} = item
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