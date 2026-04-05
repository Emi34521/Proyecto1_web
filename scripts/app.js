(function () {
  'use strict';

  var API = 'https://fakestoreapi.com/products';

  var allProducts = [];

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

  function showView(name) {
    viewHome.classList.toggle('hidden', name !== 'home');
    viewCreate.classList.toggle('hidden', name !== 'create');
    viewDetail.classList.toggle('hidden', name !== 'detail');
  }

  function setHomeStates(mode) {
    stateIdle.classList.toggle('hidden', mode !== 'idle');
    stateLoading.classList.toggle('hidden', mode !== 'loading');
    stateEmpty.classList.toggle('hidden', mode !== 'empty');
    stateError.classList.toggle('hidden', mode !== 'error');
    stateSuccess.classList.toggle('hidden', mode !== 'success');
  }

  function loadProducts() {
    setHomeStates('loading');
    fetch(API)
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        allProducts = Array.isArray(data) ? data : [];
        if (allProducts.length === 0) {
          setHomeStates('empty');
          return;
        }
        setHomeStates('success');
        postsList.innerHTML = '';
        if (paginationEl) {
          paginationEl.classList.add('hidden');
          paginationEl.innerHTML = '';
        }
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

  var detailBack = document.getElementById('detail-back');
  var detailErrorBack = document.getElementById('detail-error-back');
  if (detailBack) {
    detailBack.addEventListener('click', function () {
      showView('home');
    });
  }
  if (detailErrorBack) {
    detailErrorBack.addEventListener('click', function () {
      showView('home');
    });
  }

  loadProducts();
})();
