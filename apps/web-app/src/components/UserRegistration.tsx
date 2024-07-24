import { createSignal } from 'solid-js'
import axios from 'axios'

const UserRegistration = () => {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [message, setMessage] = createSignal('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    try {
      await axios.post('http://localhost:3000/users/register', {
        email: email(),
        password: password(),
      })
      setMessage('User registered successfully!')
      setEmail('')
      setPassword('')
    } catch (error) {
      setMessage('Registration failed.  Please try again!')
    }
  }

  return (
    <div>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email()}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div>
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password()}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default UserRegistration
