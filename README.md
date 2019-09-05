# Select2-Google-Fonts
Carregue todas as fontes disponíveis na API do google fonts, com preview da fonte e de suas variantes.

![enter image description here](https://maper77.github.io/Select2-Google-Fonts/exemplo.png)

Página de Exemplo:
https://maper77.github.io/Select2-Google-Fonts/

## Plugins Utilizados:

>  - jquery
>  - bootstrap 
>  - select2 
>  - select2-bootstrap-theme


## Instalação:
`npm add maPer77/Select2-Google-Fonts`


## Como usar:

**1 - Importe no HEAD:**
```html
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css" rel="stylesheet">
<link href="https://select2.github.io/select2-bootstrap-theme/css/select2-bootstrap.css" rel="stylesheet">
<link href="../src/selectGfont.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/js/select2.min.js"></script>	
<script src="https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js"></script>
<script src="../src/selectGfont.js"></script>
```

**2 - Crie as tags para seu select confome abaixo:** 

```html
<div class="row justify-content-center">
	<!-- Fonte GOOGLE -->
	<div class="col-md-12 col-lg-10 col-xl-8">
		<label><span class="selectGFontTotal"></span> Google Fonts</label>
		<div class="input-group input-group-lg">
			<select id='selectGFont' data-default='Play' class="form-control invisible"></select>
			<div class="input-group-append">
				<select id='selectGFontVariante' data-default='regular' class="form-control invisible"></select>
			</div>
		</div>
	</div>
</div>
```

**2 - Configuração:**

| Ítem | Descrição |
|--|--|
| * key | Informe sua Credencial da API do google fonts, se não tiver, crie uma em: [https://console.developers.google.com/apis/credentials](https://console.developers.google.com/apis/credentials)  |
| * containerFonte | ID do select da fonte, neste exemplo: #selectGFont |
| * containerVariante | ID do select das variantes da fonte, neste exemplo: #selectGFontVariante|
| sort | alpha, date, popularity, style, trending -- *Default: popularity*  |
| onSelectFonte | Função chamada quanto uma fonte é selecionada, recebe como parâmetro: ***(fonte, variante, json)*** ***fonte*** = \<string\> nome da fonte, ***variante*** = \<string\> nome da variante, ***json*** = json com todos dados da fonte, veja exemplo abaixo |
| onSelectVariante | Função chamada quanto uma variante da fonte é selecionada, recebe os mesmos parâmetros de *onSelectFonte* |

> \* Parâmetro obrigatório



**3 - Exemplo de JSON recebido por : onSelectFonte e onSelectVariante**

```json
{
  "kind": "webfonts#webfont",
  "family": "Roboto",
  "category": "sans-serif",
  "variants": [
    "100",
    "100italic",
    "300",
    "300italic",
    "regular",
    "italic",
    "500",
    "500italic",
    "700",
    "700italic",
    "900",
    "900italic"
  ],
  "subsets": [
    "vietnamese",
    "cyrillic",
    "latin-ext",
    "cyrillic-ext",
    "greek",
    "latin",
    "greek-ext"
  ],
  "version": "v19",
  "lastModified": "2019-05-01",
  "files": {
    "100": "http://fonts.gstatic.com/s/roboto/v19/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf",
    "300": "http://fonts.gstatic.com/s/roboto/v19/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf",
    "500": "http://fonts.gstatic.com/s/roboto/v19/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf",
    "700": "http://fonts.gstatic.com/s/roboto/v19/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf",
    "900": "http://fonts.gstatic.com/s/roboto/v19/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf",
    "100italic": "http://fonts.gstatic.com/s/roboto/v19/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf",
    "300italic": "http://fonts.gstatic.com/s/roboto/v19/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf",
    "regular": "http://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
    "italic": "http://fonts.gstatic.com/s/roboto/v19/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf",
    "500italic": "http://fonts.gstatic.com/s/roboto/v19/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf",
    "700italic": "http://fonts.gstatic.com/s/roboto/v19/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf",
    "900italic": "http://fonts.gstatic.com/s/roboto/v19/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"
  },
  "carregada": 1
}
```


**4 - Chamando** *selectGfont()*

```js
selectGfont({
	key: 'You-Google-Fonts-API-Key', 
	containerFonte: '#selectGFont', 
	containerVariante: '#selectGFontVariante'
});
```

**5 - Exemplo completo:**
Neste exemplo a fonte selecionada é passada para ***sGFselecionado*** e esta função aplica a fonte e variante no elemento ".preview", mostra no console os dados recebidos e depois envia para a função *salvaFonte()*, esta função chama o arquivo *downloadFonte.php*, que vai salvar o arquivo da fonte.  (Vejao codigo na pasta *example*)

```html
<div class="preview">
	The spectacle before us was indeed sublime.
</div>
```

```js
<script>
jQuery(document).ready(function(){

	selectGfont({
		key: 'You-Google-Fonts-API-Key', 
		containerFonte: '#selectGFont', 
		containerVariante: '#selectGFontVariante',
		sort: 'popularity',
		onSelectFonte: 'sGFselecionado',
		onSelectVariante: 'sGFselecionado'

	}).then( function() {
		console.log('OK');

	}).catch( function(erro) {
		console.error(erro);
		
	});


	// exemplo de utilização
	sGFselecionado = function(fonte, variante, json){
		jQuery(".preview").css('font-family', fonte);
		jQuery(".preview").removeClass('sGFfonte-100 sGFfonte-200 sGFfonte-300 sGFfonte-regular sGFfonte-italic sGFfonte-500 sGFfonte-600 sGFfonte-700 sGFfonte-800 sGFfonte-900 sGFfonte-100italic sGFfonte-200italic sGFfonte-300italic sGFfonte-500italic sGFfonte-600italic sGFfonte-700italic sGFfonte-800italic sGFfonte-900italic');
			jQuery(".preview").addClass( 'sGFfonte-'+variante );
		
		console.log( 'fonte', fonte );
		console.log( 'variante', variante );
		console.log( 'json', json );
		salvaFonte(fonte, variante, json);
	};

	// Faz download da fonte 
	function salvaFonte (fonte, variante, json){
		$.post({
			url: "./downloadFonte.php",
			data: {fonteNome:fonte, fonteVariante:variante ,fonteFile:json.files[variante] }
		});
	};

});  
</script>
```
