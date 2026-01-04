import './style.css'
import { useEffect, useState, useRef } from 'react'
// import icons
import { RiDeleteBin6Fill } from "react-icons/ri"
// import toaster
import { Toaster, toast } from 'sonner'
import api from '../../services/api'

function Home() {

  const [users, setUsers] = useState([])

  const nameInputRef = useRef()
  const ageInputRef = useRef()
  const emailInputRef = useRef()

  useEffect(() => {
    getUsers()
  }, [])

  async function getUsers() {
    const usersFromApi = await api.get('/users')
    setUsers(usersFromApi.data)
  }

  async function createUser() {
    const name = nameInputRef.current.value
    const age = ageInputRef.current.value
    const email = emailInputRef.current.value

    if (!name || !age || !email) {
      toast.error('Por favor, preencha todos os campos.')
      return
    }

    if (users.find(user => user.email === email)) {
      toast.error('Email já cadastrado!')
      return
    }

    const newUser = {
      name,
      age: String(age),
      email
    }

    await api.post('/users', newUser)
    toast.success('Usuário cadastrado com sucesso!')

    nameInputRef.current.value = ''
    ageInputRef.current.value = ''
    emailInputRef.current.value = ''

    getUsers()
  }

  async function deleteUser(id) {
    await api.delete(`/users/${id}`)
    getUsers()
  }

  return (
    <div className="home-container">

      <form className="cadastro-form">
        <h1>Cadastro de Usuários</h1>

        <input type="text" placeholder='Nome' ref={nameInputRef} />
        <input type="number" placeholder='Idade' ref={ageInputRef} />
        <input type="email" placeholder='Email' ref={emailInputRef} />
        <button type='button' onClick={createUser}>Cadastro</button>

      </form>
      {
        users.map(user => (
          <div key={user.id} className="user-card">

            <div className="user-info">
              <p><strong>Nome:</strong> {user.name}</p>
              <p><strong>Idade:</strong> {user.age}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>

            <button className="delete-button" onClick={() => deleteUser(user.id)}>
              <RiDeleteBin6Fill className='icon' size={20} />
            </button>

          </div>
        ))
      }
      <Toaster richColors />
    </div>
  )
}

export default Home
