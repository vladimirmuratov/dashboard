import React from "react";
import styles from "./block.module.css";
import {Card} from "../card/card";
import {Todo} from "../../types";
import {ConnectDropTarget} from "react-dnd";

interface IProps {
    myRef?: ConnectDropTarget,
    title: string,
    block: Todo[],
    onRemove: (id: string) => void
}

export const Block: React.FC<IProps> = ({title, block, onRemove, myRef, children}): JSX.Element => (
    <section ref={myRef} className={styles.main_block__block}>
        <h3 className={styles.main_block__title}>{title}</h3>
        {block.length ? block.map(item => <Card key={item.id} item={item} onRemove={onRemove}/>) : ''}
        {children}
    </section>
)