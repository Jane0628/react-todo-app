import React from 'react';
import { BsCheckCircle, BsFillTrash3Fill } from 'react-icons/bs';
import './scss/TodoItem.scss';
import classNames from 'classnames';

const TodoItem = ({ item }) => {

  const { id, title, done } = item;

  return (
    <li className='todo-list-item'>
      <div className={classNames("check-circle", { active: done })} >
        <BsCheckCircle />
      </div>
      <span className={classNames('text', { finish: done })}>{title}</span>
      <div className="remove">
        <BsFillTrash3Fill />
      </div>
    </li>
  );
}

export default TodoItem