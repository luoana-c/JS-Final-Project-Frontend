const getUsername = () => {
  let username = window.localStorage.getItem('username')
  if (username) return username
  username = prompt('log in')
  window.localStorage.setItem('username', username)
  return username
}

const name = getUsername()
let currentUser

fetch('http://localhost:3000/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({name})
})
  .then(res => res.json())
  .then(user => {
    currentUser = user
    // console.log(currentUser)
  })
