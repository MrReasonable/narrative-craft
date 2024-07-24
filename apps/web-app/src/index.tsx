/* @refresh reload */
import { render } from 'solid-js/web'

import App from './App'

const root = document.querySelector('#root')

if (!root) {
  throw new Error('No root element found')
}

render(() => <App />, root)
