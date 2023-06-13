import React from 'react'
import './scss/TodoInput.scss';
import { MdAdd } from 'react-icons/md'

const TodoInput = () => {
  return (
    <>
      <div className="form-wrapper">
        <form className='insert-form'>
          <input type="text" placeholder='할 일을 입력 후, 엔터를 눌러주세요. :)' />
        </form>
      </div>

      <button className='insert-btn open'>
        <MdAdd />
      </button>
    </>
  );
}

export default TodoInput;