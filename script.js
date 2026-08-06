const inpName = document.getElementById("nombre")
const inpPrice = document.getElementById("precio")
const inpQrCode = document.getElementById("codigoqr")
const aggBtn = document.getElementById("aggBtn")
const scanBtn = document.getElementById("scanQRBtn")
const table = document.getElementById("table")
let filaenEdicion = null



function guardarDatos() {
    const filas = []
    document.querySelectorAll("tr").forEach(tr => {
        const celdas = tr.querySelectorAll("td")
        if (celdas.length > 0) {
            filas.push({
                nombre: celdas[0].textContent,
                precio: celdas[1].textContent,
                qr: celdas[2].textContent
            })
        }
    })
    localStorage.setItem("productos", JSON.stringify(filas))
}

function cargarDatos() {
    const datos = JSON.parse(localStorage.getItem("productos")) || []
    datos.forEach(item => {
        const tableRow = document.createElement("tr")

        const tdNombre = document.createElement("td")
        tdNombre.textContent = item.nombre

        const tdPrecio = document.createElement("td")
        tdPrecio.textContent = item.precio

        const tdQr = document.createElement("td")
        tdQr.textContent = item.qr

        const acctionsBtns = document.createElement("td")

        const editBtn = document.createElement("button")
        editBtn.textContent = "Editar"
        editBtn.classList.add("editar")

        editBtn.addEventListener("click", () => {
            inpName.value = tdNombre.textContent
            inpPrice.value = tdPrecio.textContent.replace("$", "")
            inpQrCode.value = tdQr.textContent
            filaenEdicion = tableRow
        })

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Borrar"
        deleteBtn.classList.add("borrar")

        deleteBtn.addEventListener("click", () => {
            tableRow.remove()
            guardarDatos()
        })

        tableRow.appendChild(tdNombre)
        tableRow.appendChild(tdPrecio)
        tableRow.appendChild(tdQr)
        tableRow.appendChild(acctionsBtns)
        acctionsBtns.appendChild(editBtn)
        acctionsBtns.appendChild(deleteBtn)
        table.appendChild(tableRow)

        inpName.value = ""
        inpPrice.value = ""
        inpQrCode.value = ""
    })
}

aggBtn.addEventListener("click", () => {  
    if (filaenEdicion) {
        const cells = filaenEdicion.querySelectorAll("td")
        cells[0].textContent = inpName.value
        cells[1].textContent = `${inpPrice.value}$`
        cells[2].textContent = inpQrCode.value
        filaenEdicion = null
        if(isNaN(inpPrice.value)) {
            alert("solo numeros en este campo")
            return
        }
        guardarDatos()
    } else {
        if (inpName.value === "" || inpPrice.value === "" || inpQrCode === "") {
            alert("llene los campos vacios")
            return
        } else if (isNaN(inpPrice.value)) {
            alert("solo numeros en este campo")
            return
        }
        const name = inpName.value
        const price = inpPrice.value
        const qrCode = inpQrCode.value

        const tableRow = document.createElement("tr")
        const dataName = document.createElement("td")
        const dataPrice = document.createElement("td")
        const dataQrCode = document.createElement("td")
        const acctionsBtns = document.createElement("td")

        dataName.textContent = name
        dataPrice.textContent = `${price}$`
        dataQrCode.textContent = qrCode

        const editBtn = document.createElement("button")
        editBtn.textContent = "Editar"
        editBtn.classList.add("editar")

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Borrar"
        deleteBtn.classList.add("borrar") 

        deleteBtn.addEventListener("click", () => {
            tableRow.remove()
        })

        editBtn.addEventListener("click", () => {
            inpName.value = dataName.textContent
            inpPrice.value = dataPrice.textContent.replace("$", "")
            inpQrCode.value = dataQrCode.textContent
            filaenEdicion = tableRow
        })

        guardarDatos()

       tableRow.appendChild(dataName)
        tableRow.appendChild(dataPrice)
        tableRow.appendChild(dataQrCode)
        tableRow.appendChild(acctionsBtns)
        acctionsBtns.appendChild(editBtn)
        acctionsBtns.appendChild(deleteBtn)
        table.appendChild(tableRow)

        inpName.value = ""
        inpPrice.value = ""
        inpQrCode.value = ""
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