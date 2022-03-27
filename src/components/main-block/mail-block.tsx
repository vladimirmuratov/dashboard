import React, {useEffect} from "react";
import styles from "./main-block.module.css";
import {Card} from "../card/card";
import {useDrop} from "react-dnd";
import {TCard} from "../../types";
import {AddIcon} from "../add-icon/add-icon";
import {AddForm} from "../add-form/add-form";
import {httpService} from "../../http.service";

const initialState: TCard[] = [
    {
        id: "1",
        text: "test1",
        color: "#dcedc8"
    },
    {
        id: "2",
        text: "test2",
        color: "#dcedc8"
    }
]

export const MainBlock = (): JSX.Element => {
    const [isShowForm, setShowForm] = React.useState(false)

    const toggleVisibleForm = () => setShowForm(!isShowForm)

    //---------------------------------------------------------
    const [elements, setElements] = React.useState<Array<TCard>>([]);
    // console.log(elements)

    async function getData() {
        const response = await httpService.get('tasks.json')
        const {data} = await response
        return data
    }

    useEffect(() => {
        getData().then(data => {
            if (Array.isArray(data)) {
                setElements(data)
            } else if (data) {
                Object.keys(data).map(key => setElements([data[key]]))
            } else {
                setElements([])
            }
        })
    }, [])

    const handleAddItem = async (text: string, color: string) => {
        setElements(prevState => [
            ...prevState,
            {
                id: String(elements.length),
                text,
                color
            }
        ])
        toggleVisibleForm()
        const id = String(elements.length)
        const payload = {
            id,
            text,
            color
        }
        await httpService.put(`tasks/${id}.json`, JSON.stringify(payload))
        /*await getData().then(data => {
            setElements(data)
        })*/
    }

    const handleRemove = async (id: string) => {
        await httpService.delete(`tasks/${id}.json`)

        setElements(elements.filter(item => item.id !== id))

        setDraggedElements(draggedElements.filter(item => item.id !== id))

        setDraggedElements2(draggedElements2.filter(item => item.id !== id))
    }
    //---------------------------------------------------------

    const [draggedElements, setDraggedElements] = React.useState<Array<TCard>>([]);
    const [, dropTarget] = useDrop({
        accept: "card",
        drop(itemId: { id: string }) {
            handleDrop1(itemId);
        }
    });

    const handleDrop1 = (itemId: { id: string }) => {
        setElements([
            ...elements.filter(element => element.id !== itemId.id)
        ]);

        setDraggedElements([
            ...draggedElements,
            ...elements.filter(element => element.id === itemId.id)
        ]);
    };
    //---------------------------------------------------------
    const [draggedElements2, setDraggedElements2] = React.useState<Array<TCard>>([]);
    const [, dropTarget2] = useDrop({
        accept: "card",
        drop(itemId: { id: string }) {
            handleDrop2(itemId);
        }
    });

    const handleDrop2 = (itemId: { id: string }) => {
        setDraggedElements([
            ...draggedElements.filter(element => element.id !== itemId.id)
        ]);

        setDraggedElements2([
            ...draggedElements2,
            ...draggedElements.filter(element => element.id === itemId.id)
        ]);
    };

    return (
        <>
            <AddIcon onClick={toggleVisibleForm}/>
            <main className={styles.main_block}>
                <section className={styles.main_block__block}>
                    <h3>block 1</h3>
                    {elements.map(item => {
                        if (item) {
                            return <Card key={item.id} onRemove={handleRemove} {...item}/>
                        }
                    })}
                    {isShowForm && <AddForm onAdd={handleAddItem}/>}
                </section>
                <section ref={dropTarget} className={styles.main_block__block}>
                    <h3>block 2</h3>
                    {draggedElements.map(item => <Card key={item.id} onRemove={handleRemove} {...item}/>)}
                </section>
                <section ref={dropTarget2} className={styles.main_block__block}>
                    <h3>block 3</h3>
                    {draggedElements2.map(item => <Card key={item.id} onRemove={handleRemove} {...item}/>)}
                </section>
            </main>
        </>
    )
}