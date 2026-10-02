const inpName = document.getElementById("nombre")
const inpPrice = document.getElementById("precio")
const inpQrCode = document.getElementById("codigoqr")
const aggBtn = document.getElementById("aggBtn")
const scanBtn = document.getElementById("scanQRBtn")
const table = document.getElementById("table")
let filaenEdicion = null

const API_BASE = (window.location.origin && window.location.origin !== 'null')
  ? window.location.origin.replace(/:\d+$/, ':4000')
  : 'http://localhost:4000'

function getToken() { return localStorage.getItem('token') }
function authHeaders() { return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() } }

function ensureAuth() {
  if (!getToken()) {
    alert('Please login first')
    window.location.href = '../auth/index.html'
    throw new Error('No token')
  }
}

async function api(path, opts = {}) {
  ensureAuth()
  const res = await fetch(API_BASE + path, Object.assign({ headers: authHeaders() }, opts))
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'API error')
  }
  return res.json().catch(() => ({}))
}

function createRow(product) {
  const tableRow = document.createElement('tr')
  tableRow.dataset.id = product.id

  const tdNombre = document.createElement('td')
  tdNombre.textContent = product.name

  const tdPrecio = document.createElement('td')
  tdPrecio.textContent = `${product.price}$`

  const tdQr = document.createElement('td')
  tdQr.textContent = product.qrcode || ''

  const acctionsBtns = document.createElement('td')

  const editBtn = document.createElement('button')
  editBtn.textContent = 'Editar'
  editBtn.classList.add('editar')
  editBtn.addEventListener('click', () => {
    inpName.value = tdNombre.textContent
    inpPrice.value = tdPrecio.textContent.replace('$', '')
    inpQrCode.value = tdQr.textContent
    filaenEdicion = tableRow
  })

  const deleteBtn = document.createElement('button')
  deleteBtn.textContent = 'Borrar'
  deleteBtn.classList.add('borrar')
  deleteBtn.addEventListener('click', async () => {
    try {
      await api('/api/products/' + tableRow.dataset.id, { method: 'DELETE' })
      tableRow.remove()
    } catch (e) { alert('Delete failed: ' + e.message) }
  })

  tableRow.appendChild(tdNombre)
  tableRow.appendChild(tdPrecio)
  tableRow.appendChild(tdQr)
  tableRow.appendChild(acctionsBtns)
  acctionsBtns.appendChild(editBtn)
  acctionsBtns.appendChild(deleteBtn)

  return tableRow
}

async function cargarDatos() {
  try {
    const products = await api('/api/products', { method: 'GET' })
    // clear existing rows (except header)
    Array.from(table.querySelectorAll('tr')).slice(1).forEach(r => r.remove())
    products.forEach(p => table.appendChild(createRow(p)))
  } catch (e) {
    console.error(e)
  }
}

aggBtn.addEventListener('click', async () => {
  try {
    ensureAuth()
    if (filaenEdicion) {
      if (isNaN(inpPrice.value)) { alert('solo numeros en este campo'); return }
      const id = filaenEdicion.dataset.id
      const body = { name: inpName.value, price: parseFloat(inpPrice.value), qrcode: inpQrCode.value }
      const updated = await api('/api/products/' + id, { method: 'PUT', body: JSON.stringify(body) })
      // update row
      const cells = filaenEdicion.querySelectorAll('td')
      cells[0].textContent = updated.name
      cells[1].textContent = `${updated.price}$`
      cells[2].textContent = updated.qrcode || ''
      filaenEdicion = null
    } else {
      if (inpName.value === '' || inpPrice.value === '' ) { alert('llene los campos vacios'); return }
      if (isNaN(inpPrice.value)) { alert('solo numeros en este campo'); return }
      const body = { name: inpName.value, price: parseFloat(inpPrice.value), qrcode: inpQrCode.value }
      const created = await api('/api/products', { method: 'POST', body: JSON.stringify(body) })
      table.appendChild(createRow(created))
    }
    inpName.value = ''
    inpPrice.value = ''
    inpQrCode.value = ''
  } catch (e) {
    alert('Operation failed: ' + e.message)
  }
})

scanBtn.addEventListener('click', () => {
  const qrCodeScanner = new Html5Qrcode("reader")
  
  qrCodeScanner.start(
    { facingMode: "environment" }, 
    {
      fps: 10,
      qrbox: 250
    },
    (decodedText, decodedResult) => {
      console.log("QR code detected:", decodedText)
      qrCodeScanner.stop().then(() => {
        rellenarFormulario(decodedText) 
        console.log(decodedResult, decodedText)
      }).catch(err => {
        console.error("Error al detener el escáner", err)
        return
      })
    },
    (errorMessage) => {
      setTimeout(() => {
        console.warn("Error de escaneo:", errorMessage)
        return
      }, 2000)
    }
  ).catch(err => {
    alert("No se pudo iniciar el escáner")
    console.error("No se pudo iniciar el escáner", err)
  })
})

function rellenarFormulario(datosQR) {
  let datosProducto
  try {
    datosProducto = JSON.parse(datosQR)
  } catch (error) {
    alert("El QR no contiene datos en formato válido")
    return
  }

  inpName.value = datosProducto.nombre
  inpQrCode.value = datosProducto.codigo
}
 

window.onload = cargarDatos