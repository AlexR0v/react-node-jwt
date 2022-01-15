import { observer }                  from 'mobx-react-lite'
import { FC, useContext, useEffect } from 'react'
import LoginForm                     from './components/LoginForm'
import { Context }                   from './main'

const App: FC = () => {

  const { store } = useContext(Context)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  if (store.isLoading) return <h3>Загрузка...</h3>

  return (
    <div>
      <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'Авторизуйтесь'}</h1>
      {store.isAuth &&
        <>
          {store.user.isActivated ? <h2>Аккаунт активирован</h2> : <h2>Активируйте аккаунт, по ссылке в почте!</h2>}
          {store.user.isActivated && <button onClick={() => store.getUsers()}>Получить список пользователей</button>}
        </>}
      {store.isAuth
        ? <>
          <button onClick={() => store.logout()}>Выход</button>
          {store.users.map(user => (
            <div key={user.id}>{user.email}</div>
          ))}
        </>
        : <LoginForm />}
    </div>
  )
}

export default observer(App)
