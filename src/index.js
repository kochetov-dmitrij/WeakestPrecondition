import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {parse} from "./parser/parser";

// class Show extends React.Component{
//     render() {
//         return (
//             <div>
//
//             </div>y
//         )
//     }
// }

let r = parse(
    "\
                 (IF  x < y  THEN   \
            (WHINV  _x < u  EOI  x = y  DO \
               (IF  x = y  THEN \
                  z := 0 ; k := m + n  \
               ELSE  \
                  diman := pidr ; \
                  maxim := shwarz ; \
                  (IF  max = d  THEN d:= max ELSE cl  := var ) ;\
                  diman := savel \
               ) ; \
               savel := krasavcheg       \
            )\
        ELSE \
            y := z \
        )  "
);

let ewq = 456;

//ReactDOM.render(<Show/>, document.getElementById('root'));
