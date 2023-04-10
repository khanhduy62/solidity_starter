import React, { useState, useEffect } from 'react';
import { load, sendTransaction } from './funcs';

import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [refresh, setRefresh] = useState(true);
  const [addressAccount, setAddressAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);

  const handleInputChange = (e) => setInput(e.currentTarget.value);

  const handleAddTask = async () => {
    await contract.createTask(input, { from: addressAccount });
    setInput('');
    setRefresh(true);
  };

  const handleToggled = async (id) => {
    await contract.toggleCompleted(id, { from: addressAccount });
    setRefresh(true);
    // sendTransaction();
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', (accounts) => {
      setRefresh(true);
    });
  }, []);
  useEffect(() => {
    if (!refresh) return;
    setRefresh(false);
    load().then((e) => {
      setAddressAccount(e.addressAccount);
      setTasks(e.tasks);
      setContract(e.todoContract);
    });
  }, [refresh]);

  // if (tasks) {
  //   tasks.forEach((el) => {
  //     console.log('log--el ', el.id);
  //   });
  // }
  return (
    <div className='App'>
      <input
        placeholder='New Task...'
        onChange={handleInputChange}
        value={input}
      />
      <button onClick={handleAddTask}>Add</button>
      <h1>Doing tasks</h1>
      <ul>
        {tasks.map((el) =>
          !el.completed ? (
            <li key={el.id}>
              {el.content} {''}
              <button onClick={() => handleToggled(el.id.toNumber())}>
                Mark as done
              </button>
            </li>
          ) : null
        )}
      </ul>
      <h1>Done tasks</h1>
      <ul>
        {tasks.map((el) =>
          el.completed ? <li key={el.id} onClick={() => handleToggled(el.id.toNumber())}>{el.content}</li> : null
        )}
      </ul>
    </div>
  );
}

export default App;
