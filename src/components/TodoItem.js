import React from 'react';
import { BsCheckCircle, BsFillTrash3Fill } from 'react-icons/bs';
import './scss/TodoItem.scss';

const TodoItem = () => {
  return (
    <li className='todo-list-item'>
      <div className="check-circle">
        <BsCheckCircle />
      </div>
      <span className='text'>할 일 어쩌고~~</span>
      <div className="remove">
        <BsFillTrash3Fill />
      </div>
    </li>
  );
}

export default TodoItem