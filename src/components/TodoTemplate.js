import React, { useEffect, useState } from 'react'
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import './scss/TodoTemplate.scss';

const TodoTemplate = () => {

  // 서버에 할일 목록(json)을 요청(fetch)해서 받아와야 함

  // todos 배열을 상태 관리
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: '아침 산책하기',
      done: false
    },
    {
      id: 2,
      title: '주간 신문 읽기',
      done: true
    },
    {
      id: 3,
      title: '샌드위치 사먹기',
      done: false
    },
    {
      id: 4,
      title: '리액트 복습하기',
      done: false
    }
  ]);


  // todoInput에게 todoText를 받아오는 함수
  // 자식 컴포넌트가 부모 컴포넌트에게 데이터를 전달할 때는 props 사용이 불가능.
  // 부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언!) -> props로 함수를 전달
  // 자식 컴포넌트에서 전달받은 함수를 호출하면서 매개값으로 데이터를 전달.
  const addTodo = todoText => {
    const newTodo = {
      // id값 시퀀스 생성 함수
      id: (todos.length === 0 ? 1 : todos[todos.length - 1].id + 1),
      title: todoText,
      done: false
    };

    // todos.push(newTodo);

    // 리액트의 상태 변수는 무조건 setter를 통해서만 상태값을 변경해야 렌더링에 적용된다.
    // 다만, 상태 변수가 불변성(immutable)을 가지기 때문에 기존 상태에서 변경은 불가능하고, 새로운 상태를 만들어서 변경해야 합니다.
    // const copyTodos = todos.slice();
    // copyTodos.push(newTodo);
    // setTodos(todos.concat([newTodo]));
    setTodos([...todos, newTodo]);
  }

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  return (
    <div className='TodoTemplate'>
      <TodoHeader />
      <TodoMain todoList={todos} />
      <TodoInput addTodo={addTodo} />
    </div>
  );
}

export default TodoTemplate