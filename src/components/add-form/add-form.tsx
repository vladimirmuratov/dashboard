import React from "react";
import styles from "./add-form.module.css";
import {getRandomNumber} from "../../utils";
import {colors} from "../../config";

type TProps = {
    onAdd: (text: string, color: string) => void;
}

export const AddForm: React.FC<TProps> = ({onAdd}): JSX.Element => {

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const text = e.target.text.value
        const randomColor = colors[getRandomNumber(0, colors.length - 1)]
        text.length && onAdd(text, randomColor)
    }

    return (
        <form className={styles.add_form} onSubmit={handleSubmit}>
            <input
                className={styles.add_form__input}
                placeholder="введите текст..."
                name="text"
                autoFocus
            />
            <input
                type="submit"
                className={styles.add_form__button}
                value="добавить"
            />
        </form>
    )
}