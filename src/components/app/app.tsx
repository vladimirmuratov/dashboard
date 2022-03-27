import React from 'react';
import styles from './app.module.css';
import {MainBlock} from "../main-block/mail-block";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

function App() {
  return (
    <div className={styles.app}>
        <DndProvider backend={HTML5Backend}>
      <MainBlock/>
        </DndProvider>
    </div>
  );
}

export default App;
