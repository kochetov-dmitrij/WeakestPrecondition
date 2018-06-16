import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import {parse} from './parser/parser'
import {ProgramBlock, Transition, Scroll} from './render_tree'

ReactDOM.render(<Scroll
    root={qq().root}
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