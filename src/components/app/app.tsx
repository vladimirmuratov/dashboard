import React from 'react';
import styles from './app.module.css';
import {MainBlock} from "../main-block/main-block";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className={styles.app}>
        <DndProvider backend={HTML5Backend}>
      <MainBlock/>
        </DndProvider>
        <ToastContainer />
    </div>
  );
}

export default App;
