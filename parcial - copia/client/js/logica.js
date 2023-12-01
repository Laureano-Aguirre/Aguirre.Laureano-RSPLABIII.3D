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
  var cmbTipo = document.getElementById("cmbTipo").value;

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
  var container = document.querySelector(".tabla-monstruo-conteiner");

  listaData.forEach(function (monstruo) {
    var row = document.createElement("div");
    row.className = "row-tabla-monstruos row-tabla-monstruos-datos";
    row.dataset.id = monstruo.id;

    var nombreDiv = document.createElement("div");
    nombreDiv.className = "col-nombre";
    nombreDiv.textContent = monstruo.nombre;
    row.appendChild(nombreDiv);

    var aliasDiv = document.createElement("div");
    aliasDiv.className = "col-alias";
    aliasDiv.textContent = monstruo.alias;
    row.appendChild(aliasDiv);

    var defensaDiv = document.createElement("div");
    defensaDiv.className = "col-defensa";
    defensaDiv.textContent = monstruo.defensa;
    row.appendChild(defensaDiv);

    var miedoDiv = document.createElement("div");
    miedoDiv.className = "col-miedo";
    miedoDiv.textContent = monstruo.miedo;
    row.appendChild(miedoDiv);

    var tipoDiv = document.createElement("div");
    tipoDiv.className = "col-tipo";
    tipoDiv.textContent = monstruo.tipo;
    row.appendChild(tipoDiv);

    var modificarDiv = document.createElement("div");
    modificarDiv.className = "col-modificar";
    var modificarBtn = document.createElement("button");
    modificarBtn.textContent = "Modificar";
    modificarDiv.appendChild(modificarBtn);
    row.appendChild(modificarDiv);

    var borrarDiv = document.createElement("div");
    borrarDiv.className = "col-borrar";
    var borrarBtn = document.createElement("button");
    borrarBtn.textContent = "Borrar";
    borrarDiv.appendChild(borrarBtn);
    row.appendChild(borrarDiv);

    var seleccionarDiv = document.createElement("div");
    seleccionarDiv.className = "col-seleccionar";
    var seleccionarBtn = document.createElement("button");
    seleccionarBtn.textContent = "Seleccionar";
    seleccionarDiv.appendChild(seleccionarBtn);
    row.appendChild(seleccionarDiv);

    container.appendChild(row);

    const promedioMiedo = calcularPromedioMiedo(listaData);
    actualizarPromedioMiedo(promedioMiedo);
    actualizarMiedoMinimo();
    calcularYActualizarMiedoMaximo();
  });
}

document.getElementById("guardarButton").addEventListener("click", function () {
  obtenerDatos();
});

document.getElementById("tabla-monstruos").addEventListener("click", function (event) {
    if (event.target.textContent === "Borrar") {
      var fila = event.target.closest(".row-tabla-monstruos");
      var idMonstruo = fila.dataset.id;

      deletMonstruo(idMonstruo);
      fila.remove();

      const listaMonstruos = obtenerMonstruosTabla();
      const promedioMiedo = calcularPromedioMiedo(listaMonstruos);
      actualizarPromedioMiedo(promedioMiedo);
      calcularYActualizarMiedoMaximo()
    }
  });

document.getElementById('tabla-monstruos').addEventListener('click', function(event) {
    if (event.target.textContent === 'Seleccionar') {
        var fila = event.target.parentNode.parentNode;
        var idMonstruo = fila.dataset.id;

        var nombreMonstruo = fila.querySelector('.col-nombre').textContent;
        var aliasMonstruo = fila.querySelector('.col-alias').textContent;
        var defensaMonstruo = fila.querySelector('.col-defensa').textContent;
        var miedoMonstruo = fila.querySelector('.col-miedo').textContent;
        var tipoMonstruo = fila.querySelector('.col-tipo').textContent;

        document.getElementById('txbNombre').value = nombreMonstruo;
        document.getElementById('txbAlias').value = aliasMonstruo;
        document.querySelector('input[name="rdbDefensa"][value="' + defensaMonstruo + '"]').checked = true;
        document.getElementById('rngMiedo').value = miedoMonstruo;
        document.getElementById('cmbTipo').value = tipoMonstruo;
    }
});

document.getElementById('tabla-monstruos').addEventListener('click', function(event) {
  if (event.target.textContent === 'Modificar') {
    var fila = event.target.parentNode.parentNode;
    var idMonstruo = fila.dataset.id;
    var txbNombre = document.getElementById("txbNombre").value;
    var txbAlias = document.getElementById("txbAlias").value;
    var rdbDefensa =  (document.querySelector('input[name="rdbDefensa"]:checked') || {}).value;
    var rngMiedo = document.getElementById("rngMiedo").value;
    var cmbTipo = document.getElementById("cmbTipo").value;

    monstruo = new Monstruo(txbNombre, cmbTipo, txbAlias, rngMiedo, rdbDefensa);
    monstruo.id = idMonstruo;
    updateMonstruo(monstruo);

    const listaMonstruos = obtenerMonstruosTabla();
    const promedioMiedo = calcularPromedioMiedo(listaMonstruos);
     actualizarPromedioMiedo(promedioMiedo);
     calcularYActualizarMiedoMaximo()
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const dropdownItems = document.querySelectorAll('.dropdown-item[data-tipo]');

  dropdownItems.forEach(item => {
      item.addEventListener('click', function () {
          const tipoSeleccionado = this.dataset.tipo;
          document.getElementById('cmbTipo').textContent = this.textContent;
          filtrarTablaPorTipo(tipoSeleccionado);

          const listaMonstruos = obtenerMonstruosTabla();
          const promedioMiedo = calcularPromedioMiedo(listaMonstruos);
          actualizarPromedioMiedo(promedioMiedo);
          actualizarMiedoMinimo();
          
      });
  });
});

function cambiarTabla(columnIndex, isChecked) {
  const table = document.getElementById('tabla-monstruos');
  const celdas = Array.from(table.querySelectorAll(`.row-tabla-monstruos > div:nth-child(${columnIndex + 1})`));

  celdas.forEach(cell => {
      cell.style.display = isChecked ? '' : 'none';
  });
}

function calcularPromedioMiedo(listaData) {
  if (listaData.length === 0) {
      return 0;
  }

  const sumaMiedos = listaData.reduce((suma, monstruo) => suma + parseInt(monstruo.miedo), 0);
  return sumaMiedos / listaData.length;
}

function actualizarPromedioMiedo(promedioMiedo) {
  const inputPromedioMiedo = document.getElementById("promedioMiedo");
  inputPromedioMiedo.value = promedioMiedo.toFixed(2); //dos deicmales
}

function calcularMiedoMinimo(listaData) {
  if (listaData.length === 0) {
    return 0;
  }

  const miedos = listaData.map((monstruo) => parseInt(monstruo.miedo));
  const miedoMinimo = Math.min(...miedos);

  return miedoMinimo;
}

function actualizarMiedoMinimo() {
  const listaMonstruos = obtenerMonstruosTabla();
  const miedoMinimo = calcularMiedoMinimo(listaMonstruos);


  const inputMiedoMinimo = document.getElementById("minimoMiedo");
  inputMiedoMinimo.value = miedoMinimo;
}

function calcularYActualizarMiedoMaximo() {
  const listaMonstruos = obtenerMonstruosTabla();
  const miedos = listaMonstruos.map((monstruo) => parseInt(monstruo.miedo));
  const miedoMaximo = Math.max(...miedos);
  const inputMiedoMaximo = document.getElementById("maximoMiedo");
  inputMiedoMaximo.value = miedoMaximo;
}

function obtenerMonstruosTabla() {
  const listaMonstruos = [];
  const filas = document.querySelectorAll(".row-tabla-monstruos-datos");

  filas.forEach((fila) => {
      const monstruo = {
          id: fila.dataset.id,
          nombre: fila.querySelector(".col-nombre").textContent,
          alias: fila.querySelector(".col-alias").textContent,
          defensa: fila.querySelector(".col-defensa").textContent,
          miedo: fila.querySelector(".col-miedo").textContent,
          tipo: fila.querySelector(".col-tipo").textContent
      };

      listaMonstruos.push(monstruo);
  });

  return listaMonstruos;
}

function filtrarTablaPorTipo(tipo) {
  const listaMonstruos = obtenerMonstruosTabla();
  const filasMostrar = listaMonstruos
      .filter((monstruo) => tipo === "todos" || monstruo.tipo === tipo)
      .map((monstruo) => monstruo.id);

  const filas = document.querySelectorAll(".row-tabla-monstruos-datos");

  filas.forEach((fila) => {
      const mostrar = filasMostrar.includes(fila.dataset.id);
      fila.style.display = mostrar ? "" : "none";
      console.log(obtenerMonstruosTabla());
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const checkboxes = document.querySelectorAll('.chb-container input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function () {
          const columnaIndice = Array.from(checkbox.parentNode.parentNode.children).indexOf(checkbox.parentNode);
          const columnasSeleccionadas = Array.from(checkboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.getAttribute('for'));
          localStorage.setItem('columnasSeleccionadas', JSON.stringify(columnasSeleccionadas));
          cambiarTabla(columnaIndice, checkbox.checked);
      });
  });

  const columnasVisibles = document.querySelectorAll('.chb-container input[type="checkbox"]:checked');

  Array.from(columnasVisibles).reduce((acumulador, checkbox) => {
      const columnIndex = Array.from(checkbox.parentNode.parentNode.children).indexOf(checkbox.parentNode);
      acumulador.push(columnIndex);
      cambiarTabla(columnIndex, true);
      return acumulador;
  }, []);
});

document.addEventListener('DOMContentLoaded', function () {
  const columnasGuardadas = localStorage.getItem('columnasSeleccionadas');
  if (columnasGuardadas) {
      const columnasSeleccionadas = JSON.parse(storedColumns);
      columnasSeleccionadas.forEach(columnLabel => {
          const checkbox = document.querySelector(`.chb-container input[for="${columnLabel}"]`);
          if (checkbox) {
              checkbox.checked = true;
              const indiceColumna = Array.from(checkbox.parentNode.parentNode.children).indexOf(checkbox.parentNode);
              cambiarTabla(indiceColumna, true);
          }
      });
  }

});
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
  loader.classList.remove("oculto");  //remuevo la clase oculto y muestro el spinner

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

