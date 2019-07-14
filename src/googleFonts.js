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
      //jQuery(".preview").css('font-family', fontes[fonte].family);
      $selectFont.data( 'default',  fontes[fonte].family );
      carregaFontes({id:fonte, variantes: true});
      carregaVariantes();
    });


    // qando seleciona uma variante da fonte
    $selectFontVariante.on('select2:select', function(){
      var fonte = $selectFont.val();
      var variante = jQuery(this).val();
      if (config.onSelectVariante) window[config.onSelectVariante](fontes[fonte].family, variante, fontes[fonte]);
      //jQuery(".preview").removeClass('sGFfonte-100 sGFfonte-200 sGFfonte-300 sGFfonte-regular sGFfonte-italic sGFfonte-500 sGFfonte-600 sGFfonte-700 sGFfonte-800 sGFfonte-900 sGFfonte-100italic sGFfonte-200italic sGFfonte-300italic sGFfonte-500italic sGFfonte-600italic sGFfonte-700italic sGFfonte-800italic sGFfonte-900italic');
      //jQuery(".preview").addClass( 'sGFfonte-'+variante );
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
      var quantidade = config['quantidade'] || 10; 
      var quantidade = parseInt(quantidade + posicao);
      var id = config['id'] || false;
      var variantes = config['variantes'] || null;
      var listaFontes = new Array();
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
            //textoFontes = fontes[idFonte].family;
            //textoFontes = Array.from(new Set(textoFontes)).sort().join('');
          }; //endIf
          listaFontes.push( fontes[id].family+listaVariantes );

      } else { // carrega varias fontes a partir da posicao
              var idSelect = $selectFont.prop('id');
              elementos = jQuery("#select2-"+idSelect+"-results li:nth-child(n+"+posicao+"):nth-child(-n+"+quantidade+") > span:first-child");
              var x = elementos.length;
              carregando = new Object();
              for (var i = 0; i < x; i++) {
                var element = elementos[i];
                var idFonte = jQuery(element).data('id');
                carregando[fontes[idFonte].family] = element;
                if (fontes[idFonte] && fontes[idFonte].carregada != 1) {
                  jQuery(element).addClass('carregando');
                  listaFontes.push( fontes[idFonte].family );
                  textoFontes += fontes[idFonte].family;
                  fontes[idFonte].carregada = 1;
                } else {
                  delete elementos[i];
                }; // endif
              }; // endFor
              // filtra somente os caracteres usados no nome da fonte
              textoFontes = Array.from(new Set(textoFontes)).sort().join('');
              
      }; //endif

      // Carrega as fontes do google fonts
      if (listaFontes.length) { // se tem fontes na lista
          (function() {  // funcao automatica
                WebFont.load({
                  classes: false,
                  google: {
                    families: listaFontes,
                    text: textoFontes
                  },
                  active: function(familyName){
                    jQuery.each(carregando, function(index, value) {
                      jQuery(value).removeClass('carregando');
                    });
                    carregando = new Object();
                  },
                  fontactive: function(familyName){
                    if ( carregando[familyName] ) {
                      jQuery(carregando[familyName]).removeClass('carregando');
                      delete carregando[familyName];
                    };
                  }
                }); // endWebFont
          }()); //endfunction automatica
      }; // endIf

    }; //endFunction carregaFontes

    
}; // END selectGfont