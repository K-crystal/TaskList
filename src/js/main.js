const { consumers } = require("stream");

const todoInputElew = document.querySelector('.todo-input');
const todoListElem = document.querySelector(".todo-list");
const completeAllBtnElem = document.querySelector('.complete-all-btn');
const showAllBtnElem = document.querySelector('.show-all-btn');
const showActiveBtnElem = document.querySelector('.show-active-btn');
const showCompletedBtnElem = document.querySelector('.show-completed-btn');
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn');



let todos = [];
let id = 0;

const setTodos = (newTodos) => {
  todos = newTodos;
}

const getAllTodos = () =>{
  return todos;
}

const appendTodos = (text) => {
  const newId = id++;
  const newTodos = getAllTodos().concat({
    id: newId,
    isCompleted: false,
    content: text
  })
  setTodos(newTodos);
  paintTodos();
}

const deleteTodos = (todoId) => {
  const newTodos = getAllTodos().filter(todo => todo.id !== todoId);
  setTodos(newTodos);
  paintTodos()
} 

const completeTodo = (todoId) => {
  const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,
    isCompleted: !todo.isCompleted} : todo)
    setTodos(newTodos);
    paintTodos();
    checkIsAllCompleted();
    setLeftItems();
}

const onDbclickTodo = (e, todoId) => {
  const todoElem = e.target;
  const inputText = e.target.innerText;
  const todoItemElem = todoElem.parentNode;
  const inputElem = document.createElement('input');
  inputElem.value = inputText;
  inputElem.classList.add('edit-input');

  inputElem.addEventListener('keypress', (e) =>{
    if(e.key === 'Enter') {
      updateTodo(e.target.value, todoId); //todo 수정
    }
  })

  const onClickBody = (e) => {
    if(e.target !== inputElem) {
      todoItemElem.removeChild(inputElem);
      document.body.removeEventListener('click', onClickBody);
    }
  }

  document.body.addEventListener('click', onClickBody);
  todoItemElem.appendChild(inputElem);
}

const updateTodo = (text, todoId) => {
  const currentTodos = getAllTodos();
  const newTodos = currentTodos.map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
  setTodos(newTodos);
  paintTodos();
}


const paintTodo = (todo) => {
  
    const todoItemElem = document.createElement('li');
    todoItemElem.classList.add('todo-item');

    todoItemElem.setAttribute('data-id', todo.id)

    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => completeTodo(todo.id))

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.addEventListener('dblclick', (event) => {
      onDbclickTodo(event, todo.id)
    })
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click', () => deleteTodos(todo.id))
    delBtnElem.innerHTML = 'X';

    if(todo.isCompleted){
      todoItemElem.classList.add('checked');
      checkboxElem.innerText = '✔';
    }

    todoItemElem.appendChild(checkboxElem);
    todoItemElem.appendChild(todoElem);
    todoItemElem.appendChild(delBtnElem);

    todoListElem.appendChild(todoItemElem); 
  

}

//all체크
let isAllCompleted = ''; 

const setIsAllCompleted = (bool) => { isAllCompleted = bool};

const completeAll = () => {
  completeAllBtnElem.classList.add('checked');
  const newTodos = getAllTodos().map(todo => ({ ...todo, isCompleted: true}))
  setTodos(newTodos)
}

const incompleteAll = () => {
  completeAllBtnElem.classList.remove('checked');
  const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: false}));
  setTodos(newTodos)
}

const getCompletedTodos = () => {
  return todos.filter(todo => todo.isCompleted === true);
}

//전체 todos의 check여부
const checkIsAllCompleted = () => {
  if(getAllTodos().length === getCompletedTodos().length){
    setIsAllCompleted(true);
    completeAllBtnElem.classList.add('checked');
  }else{
    setIsAllCompleted(false);
    completeAllBtnElem.classList.remove('checked');
  }
}

//남은 리스트
const leftItemsElem = document.querySelector('.left-items');

const getActiveTodos = () => {
  return todos.filter(todo => todo.isCompleted === false);
}

const setLeftItems = () => {
  const leftTodos = getActiveTodos()
  leftItemsElem.innerHTML = `${leftTodos.length} Tasks left`
}

const onClickCompleteAll = () => {
  if(!getAllTodos().length) return //todos배일 길이가 0이면 반환
  
  if(isAllCompleted) incompleteAll(); //isAllCompleted가 true면 전체 미완료 처리
  else completeAll(); //isAllCompletedrk false면 전체완료 처리
  setIsAllCompleted(!isAllCompleted);
  paintTodos();
  setLeftItems();
}


//하단 버튼 이벤트
let currentShowType = 'all'; // 하단 버튼 3개

const paintTodos = () => {
  todoListElem.innerHTML = '';

  switch (currentShowType){
    case 'all':
      const allTodos = getAllTodos();
      allTodos.forEach(todo => {paintTodo(todo);});
      break;
    case 'active':
      const activeTodos = getActiveTodos();
      activeTodos.forEach(todo => {paintTodo(todo);});
      break;
    case 'completed':
      const completedTodos = getCompletedTodos();
      completedTodos.forEach(todo => {paintTodo(todo);});
      break;
    default:
      break;
  }
}

const setCurrentShowType = (newShowType) => currentShowType = newShowType

const onClickShowTodosType = (e) => {
  const currentBtnElem = e.target;
  const newShowType = currentBtnElem.dataset.type;

  if(currentShowType === newShowType) return;

  const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
  preBtnElem.classList.remove('selected');

  currentBtnElem.classList.add('selected');
  setCurrentShowType(newShowType)

  paintTodos();
}

const clearCompletedTodos = () =>{
  const newTodos = getActiveTodos()
  setTodos(newTodos);
  paintTodos();
}

const init = () => {
  todoInputElew.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && todoInputElew.value !== ''){
      appendTodos(e.target.value);
      todoInputElew.value = '';

      //전체 리스트 추가
      const itemList = document.querySelectorAll('.todo-item');
      leftItemsElem.innerHTML = `${itemList.length} Tasks left`
    }else{
      return false;
    }
  })

  showAllBtnElem.addEventListener('click', onClickShowTodosType);
  showActiveBtnElem.addEventListener('click', onClickShowTodosType);
  showCompletedBtnElem.addEventListener('click', onClickShowTodosType);
  clearCompletedBtnElem.addEventListener('click', clearCompletedTodos);

  setLeftItems();
  completeAllBtnElem.addEventListener('click', onClickCompleteAll);
}

init()
