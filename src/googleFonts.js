 selectGfont = function (config){

    // verifica de foi informado os dados obrigatórios
    if (!config.key) {
      console.error('Informe API key');
      return false;
    }
    if (!config.containerFonte) {
      console.error('Informe containerFonte');
      return false;
    }
    if (!config.containerVariante) {
      console.error('Informe containerVariante');
      return false;
    }


    // inicia variaveis
    var $key = config.key;
    var $selectFont = jQuery(config.containerFonte);
    $selectFont.after('<div id="selectGFontContainer"></div>');
    var $selectFontVariante = jQuery(config.containerVariante);
    $selectFontVariante.after('<div id="selectGFontContainerVariante"></div>');
    var $sort = config.sort || 'popularity';
    var fontes;
    var dados = new Array();
    var scrollTimer;
    var currentQuery;
    var carregando = new Object();
    var $selectFontResult;


    // carrega fontes do google fonts
    jQuery.ajax({
      //url: "./src/data.json",
      url: 'https://www.googleapis.com/webfonts/v1/webfonts',
      data: {sort:$sort, key:$key},
      dataType: 'json'
    }).done(function(data) {
        fontes = data.items;
        data = undefined;
        jQuery('.fontesTotal').text(fontes.length);
        var gFontFamilia = $selectFont.data('default');
        if (!gFontFamilia) { gFontFamilia = ''; };
        jQuery.each(fontes, function(index, element) {
          var categoria = element.category;
          var text = element.family;
          var item = {id:index, text:text, categoria:categoria};
          if (element.family == gFontFamilia) {
              item['selected'] = 'true';
          };
          dados.push(item);
        });

        $selectFont.select2({
          dropdownParent: jQuery('#selectGFontContainer'),
          allowClear: false,
          placeholder: 'Selecione uma fonte...',
          width: 'calc(100% - 190px)',
          dropdownAutoWidth : true,
          data: dados,
          theme: "bootstrap selectGFont",
          templateResult: formatSelectFont,
          templateSelection: formatSelectFont,
          escapeMarkup: function(markup) {return markup;}
        });

        // carrega as variantes da fonte selecionada
        carregaVariantes();

        var fonteId = $selectFont.val();
        carregaFontes({id:fonteId, quantidade:1});
    }).fail(function(jqXHR, textStatus) {
        console.error('Falha ao carregar dados do Google Fonts...', textStatus);
        return false;
    });


    // formata o select
    function formatSelectFont (state) {
      if (!state.id) { return state.text; }
      var $state = "<span data-id=" + state.id + " style='font-family:&apos;" + state.text + "&apos;'>" + state.text + "</span>";
          $state += "<span class='select2FontName'>" + state.text + " | " + state.categoria;
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
          if (element == gFontVariante) {
              item['selected'] = 'true';
          };
          dados.push(item);
        });

      $selectFontVariante.text(''); // Limpa as opcoes anteriores para popular com as opcoes da fonte atual
      $selectFontVariante.select2({
          dropdownParent: jQuery('#selectGFontContainerVariante'),
          placeholder: 'Selecione uma opção...',
          minimumResultsForSearch: -1,
          width: '190px',
          dropdownAutoWidth : true,
          data: dados,
          theme: "bootstrap selectGFontVariante",
          templateResult: formatSelectFontVariante,
          templateSelection: formatSelectFontVariante,
          escapeMarkup: function(markup) {return markup;}
      });

    }; //endFunction carregaVariantes


    // formata o select
    function formatSelectFontVariante (state) {
      if (!state.id) { return state.text; }
      var $state ="<span class='varianteNome sGFfonte-" + state.id + "' data-id=" + state.id + " style='font-family:&apos;" + state.text + "&apos;'></span>";
      return jQuery($state);
    };


    // armazena os resultados e retorna ultima busca
    $selectFont.on('select2:open', function() {
      var idSelect = $selectFont.prop('id');
      $selectFontResult = jQuery("#select2-"+idSelect+"-results");
      setTimeout(function() {
        if(currentQuery && currentQuery.length) {
          jQuery('#selectGFontContainer .select2-search input').val(currentQuery).trigger('input');
        };
        carregaFontesScroll();
      }, 0);
    });


    // guarda string de busca 
    $selectFont.on('select2:closing', function() {
      currentQuery = jQuery('#selectGFontContainer .select2-search input').val();
    });


    // carrega fontes a cada scroll
    $selectFont.one("select2:open",function(){
      $selectFontResult.scroll(function(event) {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() { carregaFontesScroll(); }, 300);
      })
    }); 


    // carrega fontes filtradas
    jQuery('#selectGFontContainer .select2-search input').on('input', '.select2-search__field', function() {
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
              elementos = jQuery("#select2-"+idSelect+"-results li:nth-child(n+"+posicao+"):nth-child(-n+"+quantidade+") > span:first-child");
              var x = elementos.length;
              carregando = new Object();
              for (var i = 0; i < x; i++) {
                  var element = elementos[i];
                  var idFonte = jQuery(element).data('id');
                  if (fontes[idFonte] && fontes[idFonte].carregada != 1) {
                    //jQuery(element).addClass('carregando');
                    fonteNome = fontes[idFonte].family;
                    caracteres = fontes[idFonte].family;
                    caracteres = Array.from(new Set(caracteres)).sort().join('');
                    if( fontes[idFonte].variants.includes('regular') == false ) {
                      fonteNome += ':' + fontes[idFonte].variants[0]
                    };
                    fontes[idFonte].carregada = 1;
                    callWebfont(fonteNome ,caracteres, element, idFonte);
                  } else {
                    delete elementos[i];
                  }; // endif
              }; // endFor
              
      }; //endif

    }; //endFunction carregaFontes




    function callWebfont (fonte, caracteres=null, element=null, idFonte=null){
      setTimeout(function() { 
      WebFont.load({
                  classes: false,
                  google: {
                    families: [fonte],
                    text: caracteres
                  },
                  fontloading: function(familyName){
                    jQuery(element).addClass('carregando');
                  },
                  fontinactive: function(familyName){
                    fontes[idFonte].carregada = 0;
                    jQuery(element).addClass('error').removeClass('carregando');
                    //console.error('fontinactive', familyName);
                  },
                  fontactive: function(familyName){
                      jQuery(element).addClass('carregado').removeClass('carregando');
                  }
                }); // endWebFont
      },0 ); // FIM setTimeout


    }; //endFunction callWebfont
    
}; // END selectGfont