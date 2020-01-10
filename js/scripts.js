var pokemonRepository = (function(){
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $modalContainer = $('.modal-container');

  function getAll(){
    return repository;
  }


  //Search
  $(document).ready(function() {
    $('.form-control').on('keyup', function() {
      var value = $(this).val().toLowerCase();
      $('.list-group button').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });

  $('.form-control').on('search', function() {
    if($(this).val().lenght > 0) {
      // the search is being executed
     }else {
      $('.form-control').val('');
      $('.form-control').trigger('keyup');
    }
  });

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
      /* eslint-disable no-console */
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
    var $pokemonList = $('.list-group');
    var button = $('<button type="button" class="btn btn-outline-success list-group-item" data-toggle="modal" data-target="#pokemonModal">'+pokemon.name+'</button>');
    $pokemonList.append(button)

    button.on('click', function(){
      showDetails(pokemon);
    });
  }

  function showDetails(item) {
    loadDetails(item).then(function () {
    showModal(item.imageUrl, item.name, item.height);     });
}

  function showModal(img, name, height) {
    //Modal Title
    $('.modal-title').text(name);

    // Add the new modal content
    $modalContainer
    .empty()
    .append('<img src="'+img+'"></img>')
    .append('<p>Height =  '+height+'</p>');
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
