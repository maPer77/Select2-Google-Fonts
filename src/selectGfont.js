 selectGfont =  function (config){

    // inicia variaveis
    var $key = config.key;

    var $selectFont = jQuery(config.containerFonte);
    $selectFont.after('<div id="selectGFontContainer"></div>');
    var $selectGFontContainer = $selectFont.nextAll('#selectGFontContainer');
    
    var $selectFontVariante = jQuery(config.containerVariante);
    $selectFontVariante.after('<div id="selectGFontContainerVariante"></div>');
    var $selectGFontContainerVariante = $selectFontVariante.nextAll('#selectGFontContainerVariante');

    var idSelect;
    var $sort = config.sort || 'popularity';
    var fontes;
    var dados = new Array();
    var scrollTimer;
    var currentQuery;
    var carregando = new Object();
    var $selectFontResult;

    callback = (resolve, reject) => {

      // verifica de foi informado os dados obrigatórios
      if (!config.key) reject('Informe API key');
      if (!config.containerFonte) reject('Informe containerFonte');
      if (!config.containerVariante) reject('Informe containerVariante');

      // carrega fontes do google fonts
      jQuery.ajax({
        url: 'https://www.googleapis.com/webfonts/v1/webfonts',
        data: {sort:$sort, key:$key},
        dataType: 'json'
      }).done(function(data) {
          fontes = data.items;
          jQuery('.selectGFontTotal').text(fontes.length);
          var gFontFamilia = $selectFont.data('default');
          if (!gFontFamilia) { gFontFamilia = ''; };
          
          jQuery.each(fontes, function(index, element) {
            var categoria = element.category;
            var text = element.family;
            var item = {id:index, text:text+categoria, view:text, categoria:categoria};
            if (element.family == gFontFamilia) item['selected'] = 'true';
            dados.push(item);
          });

          // monta o select com todas fontes disponíveis
          $selectFont.select2({
            dropdownParent: $selectGFontContainer,
            allowClear: false,
            dropdownAutoWidth : true,
            data: dados,
            theme: "bootstrap selectGFont",
            templateResult: formatSelectFont,
            templateSelection: formatSelectFont
          });
          idSelect = $selectFont.prop('id');

          // monta o select com as variantes da fonte selecionada
          carregaVariantes();

          var fonteId = $selectFont.val();
          // carrega a fonte selecionada como default
          carregaFontes({id:fonteId, quantidade:1});
          resolve();
      }).fail(function(jqXHR) {
          console.error(jqXHR.responseJSON || jqXHR);
          reject('Falha ao carregar dados do Google Fonts...');
      });

    };
  

    // formata o select
    function formatSelectFont (state) {
      if (!state.id) { return state.view; }
      var $state = "<span data-id=" + state.id + " style='font-family:&apos;" + state.view + "&apos;'>" + state.view + "</span>";
          $state += "<span class='select2FontName'>" + state.view + " | " + state.categoria;
          $state += "</span>";
      return jQuery($state);
    };


    function carregaVariantes () {
      var dados = new Array();
      var fonteId = $selectFont.val();
      var gFontVariante = $selectFontVariante.data('default');
      if (!gFontVariante) gFontVariante = 'regular';
        var fonte = fontes[fonteId].family;
        var variantes = fontes[fonteId].variants;
        jQuery.each(variantes, function(index, element) {
          var text = fonte; 
          var item = {id: element, text: text};
          if (element == gFontVariante) item['selected'] = 'true';
          dados.push(item);
        });

      $selectFontVariante.text(''); // Limpa as opcoes anteriores para popular com as opcoes da fonte atual
      $selectFontVariante.select2({
          dropdownParent: $selectGFontContainerVariante,
          minimumResultsForSearch: -1,
          dropdownAutoWidth : true,
          data: dados,
          theme: "bootstrap selectGFontVariante",
          templateResult: formatSelectFontVariante,
          templateSelection: formatSelectFontVariante
      });

    }; //endFunction carregaVariantes


    // formata o select
    function formatSelectFontVariante (state) {
      if (!state.id) { return state.text; }
      var $state ="<span class='varianteNome sGFfonte-" + state.id + "' data-id=" + state.id + " style='font-family:&apos;" + state.text + "&apos;'></span>";
      return jQuery($state);
    };


    // armazena os resultados e retorna ultima busca se tiver
    $selectFont.on('select2:open', function() {
      $selectFontResult = jQuery("#select2-"+idSelect+"-results");
      setTimeout(function() {
        if(currentQuery && currentQuery.length) {
          $selectGFontContainer.find('.select2-search .select2-search__field').val(currentQuery).trigger('input');
        };
        carregaFontesScroll();
      }, 0);
    });


    // carrega fontes a cada scroll
    $selectFont.one("select2:open",function(){
      $selectFontResult.scroll(function(event) {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() { carregaFontesScroll(); }, 100);
      })
    });


    // guarda string de busca 
    $selectFont.on('select2:closing', function() {
      currentQuery = $selectGFontContainer.find('.select2-search .select2-search__field').val();
    });


    // carrega fontes filtradas
    $selectGFontContainer.on('keypress', '.select2-search .select2-search__field', function (e) {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function() {
        carregaFontesScroll();
      }, 200);
    });


    // quando seleciona uma fonte
    $selectFont.on('select2:select', function(event){
      var fonte = jQuery(this).val();
      if (config.onSelectFonte) window[config.onSelectFonte](fontes[fonte].family, 'regular', fontes[fonte]);
      $selectFontVariante.data( 'default',  'regular' );
      if (!fonte) { return; };
      $selectFont.data( 'default',  fontes[fonte].family );
      carregaFontes({id:fonte, variantes: true});
      carregaVariantes();
    });


    // qando seleciona uma variante da fonte
    $selectFontVariante.on('select2:select', function(){
      var fonte = $selectFont.val();
      var variante = jQuery(this).val();
      if (config.onSelectVariante) window[config.onSelectVariante](fontes[fonte].family, variante, fontes[fonte]);
      $selectFontVariante.data( 'default',  variante );
    });


    function carregaFontesScroll () {
      var ul = $selectFontResult;
      if (ul.length == 0) return; // quando seleciona fonte é chamado o scroll e nao tem elementos na lista entao volta 
      var ulPosicao = 42;
      var li = ul[0].children; // javascript
      var liTopo = ul.find('li:first-child');
      var liAltura = liTopo.outerHeight();
      var liPosicao = liTopo.position().top - ulPosicao;
      var posicao = Math.abs( parseInt(liPosicao / liAltura) )-3;
      if (posicao < 0) {posicao=0};
      carregaFontes({posicao:posicao});
    }; //endFunction carregaFontesScroll


    function carregaFontes (config){
      var posicao = parseInt(config['posicao']) || 0; 
      var quantidade = config['quantidade'] || 20; 
      var quantidade = parseInt(quantidade + posicao);
      var id = config['id'] || false;
      var variantes = config['variantes'] || null;
      var textoFontes = '';
      var elementos = false;
      if (id) { // carrega 1 fonte pelo id
          var listaVariantes = '';
          if (variantes) {
            listaVariantes += ':';
            var x = fontes[id].variants.length;
            for (var i = 0; i < x; i++) {
                element = fontes[id].variants[i];
                listaVariantes += element + ',';
            }; // endFor
          }; //endIf

          callWebfont(fontes[id].family+listaVariantes, null, null, id );

      } else { // carrega varias fontes a partir da posicao
              var idSelect = $selectFont.prop('id');
              elementos = $selectGFontContainer
                          .find("#select2-"+idSelect+"-results li:nth-child(n+"+posicao+"):nth-child(-n+"+quantidade+") > span:first-child")
                          .addClass('carregando');
              var x = elementos.length;
              carregando = new Object();
              for (var i = 0; i < x; i++) {
                  var element = elementos[i];
                  var idFonte = jQuery(element).data('id');
                  if (fontes[idFonte] && fontes[idFonte].carregada != 1) {
                    fonteNome = fontes[idFonte].family;
                    caracteres = fontes[idFonte].family;
                    caracteres = Array.from(new Set(caracteres)).sort().join('');
                    if( fontes[idFonte].variants.includes('regular') == false ) {
                      fonteNome += ':' + fontes[idFonte].variants[0]
                    };
                    fontes[idFonte].carregada = 1;
                    callWebfont(fonteNome ,caracteres, element, idFonte);
                  } else {
                    jQuery(element).removeClass('carregando');
                    delete elementos[i];
                  }; // endif
              }; // endFor
              
      }; //endif
    }; //endFunction carregaFontes


    function callWebfont (fonte, caracteres=null, element=null, idFonte=null){
      WebFont.load({
                  classes: false,
                  google: {
                    families: [fonte],
                    text: caracteres
                  },
                  fontactive: function(familyName){
                      jQuery(element).removeClass('carregando');
                  },
                  fontinactive: function(familyName){
                    fontes[idFonte].carregada = 0;
                    jQuery(element).removeClass('carregando').addClass('error');
                  }
                }); // endWebFont
    }; //endFunction callWebfont

    return new Promise(callback);
}; // END selectGfont