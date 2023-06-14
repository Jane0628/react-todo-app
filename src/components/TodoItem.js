import React from 'react';
import { BsCheckCircle, BsFillTrash3Fill } from 'react-icons/bs';
import './scss/TodoItem.scss';
import classNames from 'classnames';

const TodoItem = ({ item, remove, check }) => {

  const { id, title, done } = item;

  return (
    <li className='todo-list-item'>
      <div className={classNames("check-circle", { active: done })} onClick={() => check(id)} >
        <BsCheckCircle />
      </div>
      <span className={classNames('text', { finish: done })}>{title}</span>
      <div className="remove" onClick={() => remove(id)}>
        <BsFillTrash3Fill />
      </div>
    </li>
  );
}

export default TodoItem