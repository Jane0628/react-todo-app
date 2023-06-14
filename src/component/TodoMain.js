import React from 'react'
import TodoItem from './TodoItem';

import './scss/TodoMain.scss';

const TodoMain = ({ todoList, remove }) => {
  // console.log(props.todoList);

  return (
    <ul className='todo-list'>
        {
          todoList.map(todo => <TodoItem 
                                  key={todo.id} 
                                  item={todo} 
                                  remove={remove} 
                                />)
        }
    </ul>
  )
}

export default TodoMain;