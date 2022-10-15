import React, { useState } from 'react'
import {add, pushAsync, remove, selectUser} from './userSlice'
import { useDispatch, useSelector } from 'react-redux'

const User = () => {
  const dispatch = useDispatch()
  const users = useSelector(selectUser)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  return (<>
    <ul>
      {users.map((user, index) => {
        return (
          <li key={index} onChange={() => dispatch(remove(index))}>
            name: {user.name}
            &nbsp;
            age: {user.age}
          </li>
        )
      })}
    </ul>
    <input type="text" value={name} onChange={e => setName(e.target.value)}/>
    <input type="text" value={age} onChange={e => setAge(e.target.value)}/>
    <button onClick={() => dispatch(add({name, age}))}>add</button>
  </>)
}

export default User
