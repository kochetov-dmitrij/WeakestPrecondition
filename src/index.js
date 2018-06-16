import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {parse} from './parser/parser'
import {ProgramBlock, Transition} from './render_tree'

ReactDOM.render(<Transition
    node={qq().root}
    extract={true}
/>, document.getElementById('root'));


function qq(){
    let ee = parse("\
            (WHINV  x < u  EOI  x = y  DO \
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
    ");

    if (ee.exception) throw new Error(ee.exception);
    return ee;
}