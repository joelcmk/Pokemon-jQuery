var pokemonRepository = (function(){
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $modalContainer = $('#modal-container');

  function getAll(){
    return repository;
  }

  function add(item){
    if(typeof(item) !== 'object') {
      alert(item + 'is not an object');
    } else {
    return repository.push(item);
    }
  }

  function loadList() {
    return $.ajax(apiUrl, {dataType: 'json'}).then(function (responseJSON) {
      return responseJSON;
    }).then(function (json) {
      json.results.forEach(function(item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function(e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = Object.keys(details.types);
    }).catch(function(error) {
        document.write(error);
      });
  }

  function addListItem(pokemon){
    var $pokemonList = $('.pokemon-list');
    var $listItem = $('<li></li>');
    var button = $('<button class="pokemon-button">'+pokemon.name+'</button>');
    $listItem.append(button);
    $pokemonList.append($listItem)

    button.on('click', function(event){
      console.log('hello')
      showDetails(pokemon);
    });
  }

  function showModal(img, name, height) {
    $modalContainer
    .empty()
    .append('<div class="modal"></div>');

    // Add the new modal content
    $('.modal')
    .append('<button class="modal-close">Close</button>')
    .append('<img src="'+img+'"></img>')
    .append('<h>'+name+'</h1>')
    .append('<p>Height =  '+height+'</p>');

    $('.modal-close').on('click', hideModal);


    $modalContainer.addClass('is-visible');
  }

  function hideModal() {
    $modalContainer.removeClass('is-visible')
  }

  $(window).on('keydown', (e) => {
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    };
  })

  $(window).on('click', (e) => {
    if ($(e.target).closest($modalContainer).hasClass('is-visible')) {
      hideModal();
    };
  })

  function showDetails(item) {
    loadDetails(item).then(function () {
    showModal(item.imageUrl, item.name, item.height);     });
}


 return {
    getAll: getAll,
    add: add,
    showModal: showModal,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  }

})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
