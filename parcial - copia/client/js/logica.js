let idMonstruoSeleccionado;

class Personaje {
  nombre;
  tipo;
  constructor(nombre, tipo) {
    this.nombre = nombre;
    this.tipo = tipo;
  }
}

class Monstruo extends Personaje {
  id;
  alias;
  miedo;
  defensa;
  constructor(nombre, tipo, alias, miedo, defensa) {
    super(nombre, tipo);
    this.alias = alias;
    this.miedo = miedo;
    this.defensa = defensa;
  }

  mostrarMonstruo() {
    console.log(`Monstruo ID: ${this.id}`);
    console.log(`Nombre: ${this.nombre}`);
    console.log(`Tipo: ${this.tipo}`);
    console.log(`Alias: ${this.alias}`);
    console.log(`Nivel de miedo: ${this.miedo}`);
    console.log(`Valor de defensa: ${this.defensa}`);
  }
}

function obtenerDatos() {
  var txbNombre = document.getElementById("txbNombre").value;
  var txbAlias = document.getElementById("txbAlias").value;
  var rdbDefensa = (
    document.querySelector('input[name="rdbDefensa"]:checked') || {}
  ).value;
  var rngMiedo = document.getElementById("rngMiedo").value;
  var cmbTipo = document.getElementById("cmbTipoForm").value;

  var monstruo = new Monstruo(
    txbNombre,
    cmbTipo,
    txbAlias,
    rngMiedo,
    rdbDefensa
  );
  postMonstruos(monstruo);
}

function agregarFilas(listaData) {
  var table = document.querySelector("#tabla-monstruos table");
  var tbody = document.createElement("tbody");

  listaData.forEach(function (monstruo) {
    var row = tbody.insertRow();

    var nombreCell = row.insertCell(0);
    nombreCell.textContent = monstruo.nombre;

    var aliasCell = row.insertCell(1);
    aliasCell.textContent = monstruo.alias;

    var defensaCell = row.insertCell(2);
    defensaCell.textContent = monstruo.defensa;

    var miedoCell = row.insertCell(3);
    miedoCell.textContent = monstruo.miedo;

    var tipoCell = row.insertCell(4);
    tipoCell.textContent = monstruo.tipo;

    row.dataset.id = monstruo.id;

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  calcularPromedioMiedo();
  calcularMiedoMaximoMinimo();
}

document.getElementById("guardarButton").addEventListener("click", function () {
  obtenerDatos();
});

document.addEventListener("DOMContentLoaded", function () {
  const tabla = document.querySelector("#tabla-monstruos table");
  const formulario = document.getElementById("formulario");
  tabla.addEventListener("click", function (event) {
    const fila = event.target.closest("tr");
    if (fila) {
      const nombre = fila.cells[0].innerText;
      const alias = fila.cells[1].innerText;
      const defensa = fila.cells[2].innerText;
      const miedo = fila.cells[3].innerText;
      const tipo = fila.cells[4].innerText;
      idMonstruoSeleccionado = fila.dataset.id;

      document.getElementById("txbNombre").value = nombre;
      document.getElementById("txbAlias").value = alias;
      document.querySelector(
        'input[name="rdbDefensa"][value="' + defensa + '"]'
      ).checked = true;
      document.getElementById("rngMiedo").value = miedo;
      document.getElementById("cmbTipoForm").value = tipo;
      document.getElementById("borrarButton").style.display = "block";
      document.getElementById("modificarButton").style.display = "block";
    }
  });

  document
    .getElementById("borrarButton")
    .addEventListener("click", function () {
      if (idMonstruoSeleccionado) {
        deletMonstruo(idMonstruoSeleccionado);

        const fila = document.querySelector(
          `tr[data-id="${idMonstruoSeleccionado}"]`
        );
        if (fila) {
          fila.remove();
        }

        document.getElementById("formulario").reset();
        document.getElementById("borrarButton").style.display = "none";
        document.getElementById("modificarButton").style.display = "none";

        idMonstruoSeleccionado = null;

        calcularPromedioMiedo();
        calcularMiedoMaximoMinimo();
      }
    });

  document
    .getElementById("modificarButton")
    .addEventListener("click", function () {
      if (idMonstruoSeleccionado) {
        const monstruoModificado = new Monstruo(
          document.getElementById("txbNombre").value,
          document.getElementById("cmbTipoForm").value,
          document.getElementById("txbAlias").value,
          document.getElementById("rngMiedo").value,
          document.querySelector('input[name="rdbDefensa"]:checked').value
        );

        monstruoModificado.id = idMonstruoSeleccionado;
        updateMonstruo(monstruoModificado);
      }
    });

  document
    .getElementById("cancelarButton")
    .addEventListener("click", function () {
      const columnasSeleccionadas =
        JSON.parse(localStorage.getItem("columnasSeleccionadas")) || {};
      console.log("Columnas Seleccionadas al Cancelar:", columnasSeleccionadas);
      formulario.reset();
      document.getElementById("borrarButton").style.display = "none";
      document.getElementById("modificarButton").style.display = "none";
      idMonstruoSeleccionado = null;
      calcularPromedioMiedo();
      calcularMiedoMaximoMinimo();
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const dropdownItems = document.querySelectorAll(".dropdown-item[data-tipo]");

  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tipoSeleccionado = this.dataset.tipo;
      document.getElementById("cmbTipo").textContent = this.textContent;
      filtrarTablaPorTipo(tipoSeleccionado);
    });
  });
});

function cambiarTabla(columnIndex, isChecked) {
  const table = document.getElementById("tabla-monstruos");
  const celdas = Array.from(
    table.querySelectorAll(
      `th:nth-child(${columnIndex + 1}), td:nth-child(${columnIndex + 1})`
    )
  );

  celdas.forEach((cell) => {
    cell.style.display = isChecked ? "" : "none";
  });

  const columnasSeleccionadas =
    JSON.parse(localStorage.getItem("columnasSeleccionadas")) || {};
  columnasSeleccionadas[columnIndex] = isChecked;
  localStorage.setItem(
    "columnasSeleccionadas",
    JSON.stringify(columnasSeleccionadas)
  );
  console.log("Columnas Seleccionadas:", columnasSeleccionadas);
}

document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(
    '.chb-container input[type="checkbox"]'
  );

  const columnasSeleccionadas =
    JSON.parse(localStorage.getItem("columnasSeleccionadas")) || {};

  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = columnasSeleccionadas[index] || false;
    checkbox.addEventListener("change", function () {
      const columnIndex = Array.from(
        this.parentNode.parentNode.children
      ).indexOf(this.parentNode);
      cambiarTabla(columnIndex, this.checked);
    });
  });

  const columnasVisibles = document.querySelectorAll(
    '.chb-container input[type="checkbox"]:checked'
  );

  Array.from(columnasVisibles).forEach((checkbox) => {
    const columnIndex = Array.from(
      checkbox.parentNode.parentNode.children
    ).indexOf(checkbox.parentNode);
    cambiarTabla(columnIndex, true);
  });
});

function calcularPromedioMiedo() {
  const tbodies = document.querySelectorAll("#tabla-monstruos tbody");

  let miedos = [];
  tbodies.forEach((tbody) => {
    const filas = tbody.querySelectorAll("tr");

    let miedosFila = Array.from(filas)
      .filter((fila) => fila.style.display !== "none")
      .map((fila) => {
        const celdaMiedo = fila.cells[3];
        return celdaMiedo ? Number(celdaMiedo.textContent) : NaN;
      })
      .filter((valorMiedo) => !isNaN(valorMiedo));
    miedos = miedos.concat(miedosFila);
  });

  const sumaMiedo = miedos.reduce((a, b) => a + b, 0);
  const promedioMiedo = sumaMiedo / miedos.length;

  document.getElementById("promedioMiedo").value = promedioMiedo.toFixed(2);
}

function calcularMiedoMaximoMinimo() {
  const tbodies = document.querySelectorAll("#tabla-monstruos tbody");

  let miedoMaximo = -Infinity;
  let miedoMinimo = Infinity;

  tbodies.forEach((tbody) => {
    const filas = tbody.querySelectorAll("tr");

    filas.forEach((fila) => {
      if (fila.style.display !== "none") {
        const celdaMiedo = fila.cells[3];

        if (celdaMiedo) {
          const valorMiedo = Number(celdaMiedo.textContent);
          if (!isNaN(valorMiedo)) {
            miedoMaximo = Math.max(miedoMaximo, valorMiedo);
            miedoMinimo = Math.min(miedoMinimo, valorMiedo);
          }
        }
      }
    });
  });

  document.getElementById("maximoMiedo").value = miedoMaximo.toFixed(2);
  document.getElementById("minimoMiedo").value = miedoMinimo.toFixed(2);
}

function filtrarTablaPorTipo(tipo) {
  const filas = Array.from(
    document.querySelectorAll("#tabla-monstruos table tbody tr")
  );

  const filasFiltradas = filas.filter((fila) => {
    const celdas = fila.querySelectorAll("td");
    return tipo === "todos" || celdas[4].textContent === tipo;
  });

  filas.forEach((fila) => {
    fila.style.display = "none";
  });

  filasFiltradas.forEach((fila) => {
    fila.style.display = "";
  });

  calcularPromedioMiedo();
  calcularMiedoMaximoMinimo();
}

function limpiarTabla() {
  var table = document.querySelector("#tabla-monstruos table");
  var tbody = table.querySelector("tbody");
  if (tbody) {
    tbody.remove();
  }
}

//get fetch
async function getMonstruos() {
  loader.classList.remove("oculto");
  const URL = "http://localhost:3000/monstruos";
  try {
    const res = await fetch(URL);
    if (!res.ok) {
      throw res;
    }
    const data = await res.json();
    limpiarTabla();
    agregarFilas(data);
  } catch (res) {
    console.error(`Error ${res.status}: ${res.statusText}`);
  } finally {
    loader.classList.add("oculto");
  }
}

//post ajax
function postMonstruos(monstruo) {
  const xhr = new XMLHttpRequest();
  const URL = "http://localhost:3000/monstruos";
  loader.classList.remove("oculto"); //remuevo la clase oculto y muestro el spinner

  xhr.onreadystatechange = () => {
    // Respuesta final
    if (xhr.readyState == 4) {
      // respuesta exitosa (!= error 404)
      if (xhr.status >= 200 && xhr.status < 300) {
        // lo que responde el servidor (texto en formato json)
        const listaData = JSON.parse(xhr.responseText);
        agregarFilas([listaData]);
      } else {
        console.error(`Error ${xhr.status}: ${xhr.statusText}`);
      }

      loader.classList.add("oculto"); //independientemente de como haya ido todo:
    }
  };

  xhr.open("POST", URL, true);
  //seteo la cabecera
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  // 3. Enviar la peticion.
  // Seria un error del lado del cliente.
  try {
    xhr.send(JSON.stringify(monstruo));
  } catch (e) {
    console.error(e);
  }
}

//update ajax
function updateMonstruo(monstruo) {
  const xhr = new XMLHttpRequest();
  const URL = "http://localhost:3000/monstruos";
  loader.classList.remove("oculto");

  xhr.addEventListener("readystatechange", () => {
    // Respuesta final
    if (xhr.readyState == 4) {
      // respuesta exitosa (!= error 404)
      if (xhr.status >= 200 && xhr.status < 300) {
        // lo que responde el servidor (texto en formato json)
        const data = JSON.parse(xhr.responseText);
        console.log(data);
        getMonstruos();
      } else {
        console.error(`Error ${xhr.status}: ${xhr.statusText}`);
      }

      // independientemente de como haya ido todo:
      loader.classList.add("oculto");
    }
  });

  // 2
  xhr.open("PUT", URL + "/" + monstruo.id, true);

  // seteo la cabecera de la peticion.
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  //3
  try {
    xhr.send(JSON.stringify(monstruo));
  } catch (e) {
    console.error(e);
  }
}

//delete axios
function deletMonstruo(id) {
  const URL = "http://localhost:3000/monstruos";
  loader.classList.remove("oculto");
  // Si yo no hago nada el objeo axios hace un get.
  axios
    .delete(URL + "/" + id)
    .then((res) => {
      const { data } = res;
      console.log(data);
    })
    .catch((e) => {
      console.error(e.message);
    })
    .finally(() => {
      loader.classList.add("oculto");
    });
}

getMonstruos();
