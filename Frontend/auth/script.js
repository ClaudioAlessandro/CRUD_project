const API_BASE = (window.location.origin && window.location.origin !== 'null')
	? window.location.origin.replace(/:\d+$/, ':4000')
	: 'http://localhost:4000'

const $ = id => document.getElementById(id)
const status = $('status')
const regUser = $('reg-username')
const regPass = $('reg-password')
const regBtn = $('reg-btn')
const loginUser = $('login-username')
const loginPass = $('login-password')
const loginBtn = $('login-btn')
const logoutBtn = $('logout-btn')

function setStatus(text) { status.textContent = text }

function saveToken(token) { localStorage.setItem('token', token); logoutBtn.classList.remove('hidden'); }
function clearToken() { localStorage.removeItem('token'); logoutBtn.classList.add('hidden'); }
function getToken() { return localStorage.getItem('token'); }

async function post(path, body) {
	const res = await fetch(API_BASE + path, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	})
	return res.json()
}

regBtn.addEventListener('click', async () => {
	const username = regUser.value.trim();
	const password = regPass.value.trim();
	if (!username || !password) return setStatus('Fill fields');
	const r = await post('/api/auth/register', { username, password });
	if (r.id) setStatus('Registered, you can login'); else setStatus(r.message || 'Error');
})

loginBtn.addEventListener('click', async () => {
	const username = loginUser.value.trim();
	const password = loginPass.value.trim();
	if (!username || !password) return setStatus('Fill fields');
	const r = await post('/api/auth/login', { username, password });
	if (r.token) { saveToken(r.token); setStatus('Logged in'); } else { setStatus(r.message || 'Login failed'); }
})

logoutBtn.addEventListener('click', () => {
	clearToken(); setStatus('Logged out');
})

// initialize UI
if (getToken()) logoutBtn.classList.remove('hidden')
