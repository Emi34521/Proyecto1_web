(function () {
  'use strict';

  var API = 'https://fakestoreapi.com/products';
  var POR_PAGINA = 6;

  var productos = [];
  var paginaActual = 1;
  var idViendo = null;

  var viewHome = document.getElementById('view-home');
  var viewCreate = document.getElementById('view-create');
  var viewDetail = document.getElementById('view-detail');

  var stateIdle = document.getElementById('state-idle');
  var stateLoading = document.getElementById('state-loading');
  var stateEmpty = document.getElementById('state-empty');
  var stateError = document.getElementById('state-error');
  var stateSuccess = document.getElementById('state-success');
  var postsList = document.getElementById('posts-list');
  var paginationEl = document.getElementById('pagination');

  var detailLoading = document.getElementById('detail-loading');
  var detailError = document.getElementById('detail-error');
  var detailContent = document.getElementById('detail-content');
  var detailBack = document.getElementById('detail-back');
  var detailErrorBack = document.getElementById('detail-error-back');
  var detailTitle = document.getElementById('detail-title');
  var detailBody = document.getElementById('detail-body');
  var detailMeta = document.getElementById('detail-meta');
  var detailTags = document.getElementById('detail-tags');
  var btnDelete = document.getElementById('btn-delete');

  var toastEl = document.getElementById('toast');
  
  var inputTitle = document.getElementById('post-title');
  var inputBody  = document.getElementById('post-body');
  var inputTags  = document.getElementById('post-tags');
  var formIdle    = document.getElementById('form-idle');
  var formLoading = document.getElementById('form-loading');
  var formSuccess = document.getElementById('form-success');
  var formError   = document.getElementById('form-error');
  var btnEdit     = document.getElementById('btn-edit');
  var editTitle   = document.getElementById('edit-title');
  var editBody    = document.getElementById('edit-body');
  var editTags    = document.getElementById('edit-tags');
  var viewEdit    = document.getElementById('view-edit');
  var editFormIdle    = document.getElementById('edit-form-idle');
  var editFormLoading = document.getElementById('edit-form-loading');
  var editFormSuccess = document.getElementById('edit-form-success');
  var editFormError   = document.getElementById('edit-form-error');

  function mostrarToast(texto) {
    if (!toastEl) return;
    toastEl.textContent = texto;
    toastEl.classList.add('show');
    setTimeout(function () {
      toastEl.classList.remove('show');
    }, 3000);
  }

function showView(nombre) {
  viewHome.classList.add('hidden');
  viewCreate.classList.add('hidden');
  viewDetail.classList.add('hidden');
  viewEdit.classList.add('hidden');

  if (nombre === 'home')   viewHome.classList.remove('hidden');
  if (nombre === 'create') viewCreate.classList.remove('hidden');
  if (nombre === 'detail') viewDetail.classList.remove('hidden');
  if (nombre === 'edit')   viewEdit.classList.remove('hidden');
}


  function setHomeStates(modo) {
    stateIdle.classList.add('hidden');
    stateLoading.classList.add('hidden');
    stateEmpty.classList.add('hidden');
    stateError.classList.add('hidden');
    stateSuccess.classList.add('hidden');

    if (modo === 'idle') stateIdle.classList.remove('hidden');
    if (modo === 'loading') stateLoading.classList.remove('hidden');
    if (modo === 'empty') stateEmpty.classList.remove('hidden');
    if (modo === 'error') stateError.classList.remove('hidden');
    if (modo === 'success') stateSuccess.classList.remove('hidden');
  }

  function setDetailStates(modo) {
    detailLoading.classList.add('hidden');
    detailError.classList.add('hidden');
    detailContent.classList.add('hidden');

    if (modo === 'loading') detailLoading.classList.remove('hidden');
    if (modo === 'error') detailError.classList.remove('hidden');
    if (modo === 'content') detailContent.classList.remove('hidden');
  }

  function cortarTexto(texto, max) {
    if (!texto) return '';
    if (texto.length <= max) return texto;
    return texto.substring(0, max) + '…';
  }

  function escapar(texto) {
    var d = document.createElement('div');
    d.textContent = texto;
    return d.innerHTML;
  }

  function pintarPaginacion() {
    var total = productos.length;
    if (total === 0) {
      paginationEl.classList.add('hidden');
      paginationEl.innerHTML = '';
      return;
    }

    var totalPaginas = Math.ceil(total / POR_PAGINA);
    if (totalPaginas < 1) totalPaginas = 1;
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;

    var html = '';
    html += '<button type="button" id="btn-pagina-anterior">Anterior</button>';
    html += '<span class="page-info"> Página ' + paginaActual + ' de ' + totalPaginas + ' </span>';
    html += '<button type="button" id="btn-pagina-siguiente">Siguiente</button>';

    paginationEl.innerHTML = html;
    paginationEl.classList.remove('hidden');

    var btnAnt = document.getElementById('btn-pagina-anterior');
    var btnSig = document.getElementById('btn-pagina-siguiente');

    if (paginaActual <= 1) {
      btnAnt.disabled = true;
    } else {
      btnAnt.disabled = false;
      btnAnt.onclick = function () {
        paginaActual = paginaActual - 1;
        pintarLista();
        pintarPaginacion();
      };
    }

    if (paginaActual >= totalPaginas) {
      btnSig.disabled = true;
    } else {
      btnSig.disabled = false;
      btnSig.onclick = function () {
        paginaActual = paginaActual + 1;
        pintarLista();
        pintarPaginacion();
      };
    }
  }

  function pintarLista() {
    postsList.innerHTML = '';

    var inicio = (paginaActual - 1) * POR_PAGINA;
    var fin = inicio + POR_PAGINA;
    var items = productos.slice(inicio, fin);

    for (var i = 0; i < items.length; i++) {
      var p = items[i];

      var card = document.createElement('article');
      card.className = 'post-card';

      var titulo = document.createElement('h3');
      titulo.className = 'post-card__title';
      titulo.textContent = p.title;

      var resumen = document.createElement('p');
      resumen.className = 'post-card__body';
      resumen.textContent = cortarTexto(p.description, 160);

      var meta = document.createElement('div');
      meta.className = 'post-card__meta';

      var autor = document.createElement('span');
      autor.textContent = 'Autor: ' + p.category;

      var btnMas = document.createElement('button');
      btnMas.type = 'button';
      btnMas.className = 'btn-ver-mas';
      btnMas.textContent = 'Ver más';

      (function (idProducto) {
        btnMas.addEventListener('click', function () {
          abrirDetalle(idProducto);
        });
      })(p.id);

      meta.appendChild(autor);
      meta.appendChild(btnMas);
      card.appendChild(titulo);
      card.appendChild(resumen);
      card.appendChild(meta);
      postsList.appendChild(card);
    }
  }

  function abrirDetalle(id) {
    idViendo = id;
    showView('detail');

    var p = null;
    for (var j = 0; j < productos.length; j++) {
      if (productos[j].id === id) {
        p = productos[j];
        break;
      }
    }

    if (p === null) {
      setDetailStates('error');
      return;
    }

    detailTitle.textContent = p.title;
    detailBody.textContent = p.description;
    detailMeta.textContent =
      'Categoría: ' +
      p.category +
      ' · Precio: $' +
      p.price +
      (p.rating
        ? ' · Valoración: ' + p.rating.rate + ' (' + p.rating.count + ')'
        : '');
    detailTags.innerHTML = '<span class="tag">' + escapar(p.category) + '</span>';

    btnDelete.disabled = false;
    btnDelete.textContent = 'Eliminar publicación';

    setDetailStates('content');
  }

  function eliminarPublicacion() {
    if (idViendo === null) return;

    var ok = window.confirm('¿Seguro que quieres eliminar esta publicación?');
    if (!ok) return;

    var id = idViendo;

    btnDelete.disabled = true;
    btnDelete.textContent = 'Eliminando...';

    fetch(API + '/' + id, { method: 'DELETE' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('error');
        }
        return response.json();
      })
      .then(function (data) {
        var nuevos = [];
        for (var k = 0; k < productos.length; k++) {
          if (productos[k].id !== id) {
            nuevos.push(productos[k]);
          }
        }
        productos = nuevos;
        idViendo = null;

        mostrarToast('Publicación eliminada correctamente.');
        showView('home');

        if (productos.length === 0) {
          setHomeStates('empty');
          paginationEl.classList.add('hidden');
          paginationEl.innerHTML = '';
        } else {
          var totalPaginas = Math.ceil(productos.length / POR_PAGINA);
          if (totalPaginas < 1) totalPaginas = 1;
          if (paginaActual > totalPaginas) {
            paginaActual = totalPaginas;
          }
          setHomeStates('success');
          pintarLista();
          pintarPaginacion();
        }
      })
      .catch(function () {
        mostrarToast('No se pudo eliminar. Intenta de nuevo.');
        btnDelete.disabled = false;
        btnDelete.textContent = 'Eliminar publicación';
      });
  }

  function validarFormulario() {
  var valido = true;

  var campos = document.querySelectorAll('#create-form .field');
  for (var i = 0; i < campos.length; i++) {
    campos[i].classList.remove('error');
    var msgAnterior = campos[i].querySelector('.field-error-msg');
    if (msgAnterior) msgAnterior.remove();
  }

  function marcarError(input, mensaje) {
    var field = input.closest('.field');
    field.classList.add('error');
    var msg = document.createElement('span');
    msg.className = 'field-error-msg';
    msg.textContent = mensaje;
    field.appendChild(msg);
    valido = false;
  }

  var titulo    = inputTitle.value.trim();
  var contenido = inputBody.value.trim();
  var tags      = inputTags.value.trim();

  if (titulo === '') {
    marcarError(inputTitle, 'El título es obligatorio.');
  } else if (titulo.length < 5) {
    marcarError(inputTitle, 'El título debe tener al menos 5 caracteres.');
  }

  if (contenido === '') {
    marcarError(inputBody, 'El contenido es obligatorio.');
  } else if (contenido.length < 20) {
    marcarError(inputBody, 'El contenido debe tener al menos 20 caracteres.');
  }

  if (tags !== '' && tags.length < 2) {
    marcarError(inputTags, 'Si escribes tags deben tener al menos 2 caracteres.');
  }

  return valido;
}
function setFormState(modo) {
  formIdle.classList.add('hidden');
  formLoading.classList.add('hidden');
  formSuccess.classList.add('hidden');
  formError.classList.add('hidden');
  if (modo === 'idle')    formIdle.classList.remove('hidden');
  if (modo === 'loading') formLoading.classList.remove('hidden');
  if (modo === 'success') formSuccess.classList.remove('hidden');
  if (modo === 'error')   formError.classList.remove('hidden');
}

function enviarPost() {
  if (!validarFormulario()) return;

  var titulo    = inputTitle.value.trim();
  var contenido = inputBody.value.trim();
  var tags      = inputTags.value.trim();

  setFormState('loading');

  fetch('https://fakestoreapi.com/products', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title:       titulo,
      description: contenido,
      price:       0,
      image:       'https://fakestoreapi.com/img/placeholder.jpg',
      category:    tags !== '' ? tags.split(',')[0].trim() : 'general'
    })
  })
    .then(function (res) {
      if (!res.ok) throw new Error('error');
      return res.json();
    })
    .then(function (data) {
      productos.unshift({
        id:          data.id || Date.now(),
        title:       titulo,
        description: contenido,
        price:       0,
        category:    tags !== '' ? tags.split(',')[0].trim() : 'general',
        image:       '',
        rating:      { rate: 0, count: 0 }
      });
      inputTitle.value = '';
      inputBody.value  = '';
      inputTags.value  = '';
      setFormState('success');
      mostrarToast('¡Post creado y agregado al listado!');
    })
    .catch(function () {
      setFormState('error');
    });
}
document.getElementById('btn-submit').addEventListener('click', enviarPost);
document.getElementById('btn-back').addEventListener('click', function () {
  setFormState('idle');
  showView('home');
  if (productos.length > 0) {
    paginaActual = 1;
    setHomeStates('success');
    pintarLista();
    pintarPaginacion();
  }
});

document.getElementById('btn-form-retry').addEventListener('click', function () {
  setFormState('idle');
});
function abrirEditar() {
  var p = null;
  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id === idViendo) { p = productos[i]; break; }
  }
  if (!p) return;

  editTitle.value = p.title;
  editBody.value  = p.description;
  editTags.value  = p.category;

  showView('edit');
}
btnEdit.addEventListener('click', abrirEditar);
function setEditFormState(modo) {
  editFormIdle.classList.add('hidden');
  editFormLoading.classList.add('hidden');
  editFormSuccess.classList.add('hidden');
  editFormError.classList.add('hidden');
  if (modo === 'idle')    editFormIdle.classList.remove('hidden');
  if (modo === 'loading') editFormLoading.classList.remove('hidden');
  if (modo === 'success') editFormSuccess.classList.remove('hidden');
  if (modo === 'error')   editFormError.classList.remove('hidden');
}

function guardarEdicion() {
  var titulo    = editTitle.value.trim();
  var contenido = editBody.value.trim();
  var categoria = editTags.value.trim();

  if (titulo.length < 5) {
    alert('El título debe tener al menos 5 caracteres.');
    return;
  }
  if (contenido.length < 20) {
    alert('El contenido debe tener al menos 20 caracteres.');
    return;
  }

  setEditFormState('loading');

  fetch('https://fakestoreapi.com/products/' + idViendo, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title:       titulo,
      description: contenido,
      category:    categoria !== '' ? categoria : 'general',
      price:       0,
      image:       ''
    })
  })
    .then(function (res) {
      if (!res.ok) throw new Error('error');
      return res.json();
    })
    .then(function () {
      for (var i = 0; i < productos.length; i++) {
        if (productos[i].id === idViendo) {
          productos[i].title       = titulo;
          productos[i].description = contenido;
          productos[i].category    = categoria !== '' ? categoria : 'general';
          break;
        }
      }
      setEditFormState('success');
      mostrarToast('¡Publicación actualizada!');
    })
    .catch(function () {
      setEditFormState('error');
    });
}
document.getElementById('btn-edit-submit').addEventListener('click', guardarEdicion);

document.getElementById('btn-edit-cancel').addEventListener('click', function () {
  setEditFormState('idle');
  showView('detail');
});

document.getElementById('btn-edit-back').addEventListener('click', function () {
  setEditFormState('idle');
  showView('home');
  if (productos.length > 0) {
    paginaActual = 1;
    setHomeStates('success');
    pintarLista();
    pintarPaginacion();
  }
});

document.getElementById('btn-edit-retry').addEventListener('click', function () {
  setEditFormState('idle');
});

  function loadProducts() {
    setHomeStates('loading');
    fetch(API)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('error');
        }
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data) || data.length === 0) {
          productos = [];
          setHomeStates('empty');
          return;
        }
        productos = data;
        paginaActual = 1;
        setHomeStates('success');
        pintarLista();
        pintarPaginacion();
      })
      .catch(function () {
        setHomeStates('error');
      });
  }

  document.getElementById('btn-home').addEventListener('click', function () {
    showView('home');
  });

  document.getElementById('btn-create').addEventListener('click', function () {
    showView('create');
  });

  document.getElementById('btn-retry').addEventListener('click', loadProducts);

  detailBack.addEventListener('click', function () {
    showView('home');
  });

  detailErrorBack.addEventListener('click', function () {
    showView('home');
  });

  btnDelete.addEventListener('click', eliminarPublicacion);

  loadProducts();
})();
