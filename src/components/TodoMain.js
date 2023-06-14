import React from 'react'
import TodoItem from './TodoItem';
import './scss/TodoMain.scss';

const TodoMain = ({ todoList }) => {
  return (
    <ul className='todo-list'>
      {todoList.map(todo => <TodoItem item={todo} />)}
    </ul>
  );
}

export default TodoMain;