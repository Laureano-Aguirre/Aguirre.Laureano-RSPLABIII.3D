

const URL = 'http://localhost:3000/monstruos';

function getMonstruos() {
  const xhr = new XMLHttpRequest();
  const URL = 'http://localhost:3000/monstruos';
  //loader.classList.remove("oculto");  //remuevo la clase oculto y muestro el spinner

  xhr.onreadystatechange = () => {
    // Respuesta final
    if (xhr.readyState == 4) {
      // respuesta exitosa (!= error 404)
      if (xhr.status >= 200 && xhr.status < 300) {
        // lo que responde el servidor (texto en formato json)
        const listaData = JSON.parse(xhr.responseText);
        console.log(listaData);
      } else {
        console.error(`Error ${xhr.status}: ${xhr.statusText}`);
      }
      
     // loader.classList.add("oculto"); independientemente de como haya ido todo:
    }
  };

  // 2. Open de la peticion (se configura).
  // URL es la variable que cree. 
  // tercera parametro, si no ponemos nada es True para que sea asincrona
  xhr.open("GET", URL, true);

  // 3. Enviar la peticion.
  // Seria un error del lado del cliente.
  try {
    xhr.send();
  } catch (e) {
    console.error(e);
  }
}
