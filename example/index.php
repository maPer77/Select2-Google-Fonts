<!DOCTYPE html>
<html>
<head>
	<title>Select2 Google Fonts</title>
	<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css" rel="stylesheet">
	<link href="http://select2.github.io/select2-bootstrap-theme/css/select2-bootstrap.css" rel="stylesheet">
	<link href="../src/googleFonts.css" rel="stylesheet">

	<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/js/select2.min.js"></script>	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js"></script>
	<script src="../src/googleFonts.js"></script>
	
	<!--
	<link href="../plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link href="../plugins/select2/css/select2.min.css" rel="stylesheet">
	<link href="../plugins/select2-bootstrap/select2-bootstrap.min.css" rel="stylesheet">
	<script src="../plugins/jquery/jquery.min.js"></script>
	<script src="../plugins/bootstrap/js/bootstrap.min.js"></script>
	<script src="../plugins/select2/js/select2.min.js"></script>
	<script src="../plugins/webfontloader/webfontloader.js"></script>
	-->
</head>
<body>
<div class="container-fluid">


	<div class="row justify-content-center">
		<!-- Fonte GOOGLE -->
		<div class="col-md-12 col-lg-10 col-xl-8">
			<label><span class="fontesTotal"></span> Google Fontes</label>
			<div class="input-group input-group-lg">
				<select id='selectGFont' data-default='Play' class="form-control invisible"></select>
				<div class="input-group-append">
					<select id='selectGFontVariante' data-default='regular' class="form-control invisible"></select>
				</div>
			</div>
		</div>
	</div>


	<!-- 
	The possible sorting values are:

	alpha: Sort the list alphabetically
	date: Sort the list by date added (most recent font added or updated first)
	popularity: Sort the list by popularity (most popular family first)
	style: Sort the list by number of styles available (family with most styles first)
	trending: Sort the list by families seeing growth in usage (family seeing the most growth first)
	 -->


	<script type="text/javascript">
		jQuery(document).ready(function(){

			var x = selectGfont({
				key: 'You-Google-Fonts-API-Key',
				containerFonte: '#selectGFont',
				containerVariante: '#selectGFontVariante',
				sort: 'popularity',
				onSelectFonte: 'sGFselecionado',
				onSelectVariante: 'sGFselecionado',
			});
			if (x==false) {
				console.log('Erro !');
			}

			sGFselecionado = function(fonte, variante, json){
				jQuery(".preview").css('font-family', fonte);
				jQuery(".preview").removeClass('sGFfonte-100 sGFfonte-200 sGFfonte-300 sGFfonte-regular sGFfonte-italic sGFfonte-500 sGFfonte-600 sGFfonte-700 sGFfonte-800 sGFfonte-900 sGFfonte-100italic sGFfonte-200italic sGFfonte-300italic sGFfonte-500italic sGFfonte-600italic sGFfonte-700italic sGFfonte-800italic sGFfonte-900italic');
 				jQuery(".preview").addClass( 'sGFfonte-'+variante );
				
				console.log( 'fonte', fonte );
				console.log( 'variante', variante );
				console.log( 'json', json );
				dados = json;
				salvaFonte(fonte, variante, json);
			};

			// Faz download da fonte
			function salvaFonte (fonte, variante, json){
				$.post({
					url: "../src/downloadFonte.php",
					data: {fonteNome:fonte, fonteVariante:variante ,fonteFile:json.files[variante] }
				});
			};

		});  
	</script>


	<div class="row justify-content-center preview">
		<div class="col-md-12 col-lg-10 col-xl-8">
			<div style="overflow-wrap: break-word; font-size: 2em; letter-spacing: 0.5em;">
				ABCČĆDĐEFGHIJKLMNOPQRSŠTUVWXYZŽabcčćdđefghijklmnopqrsštuvwxyzžАБВГҐДЂЕЁЄЖЗЅИІЇЙЈКЛЉМНЊОПРСТЋУЎФХЦЧЏШЩЪЫЬЭЮЯабвгґдђеёєжзѕиіїйјклљмнњопрстћуўфхцчџшщъыьэюяΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψωάΆέΈέΉίϊΐΊόΌύΰϋΎΫΏĂÂÊÔƠƯăâêôơư1234567890‘?’“!”(%)[#]{@}/&\<-+÷×=>®©$€£¥¢:;,.*
			</div>
			
			<div style="font-size: 2em;">
				<h1>The spectacle before us was indeed sublime.</h1>
				<p>Apparently we had reached a great height in the atmosphere, for the sky was a dead black, and the stars had ceased to twinkle. By the same illusion which lifts the horizon of the sea to the level of the spectator on a hillside, the sable cloud beneath was dished out, and the car seemed to float in the middle of an immense dark sphere, whose upper half was strewn with silver. Looking down into the dark gulf below, I could see a ruddy light streaming through a rift in the clouds.</p>
			</div>
			<div style="font-size: 1em;">
				<h1>The spectacle before us was indeed sublime.</h1>
				<p>Apparently we had reached a great height in the atmosphere, for the sky was a dead black, and the stars had ceased to twinkle. By the same illusion which lifts the horizon of the sea to the level of the spectator on a hillside, the sable cloud beneath was dished out, and the car seemed to float in the middle of an immense dark sphere, whose upper half was strewn with silver. Looking down into the dark gulf below, I could see a ruddy light streaming through a rift in the clouds.</p>
			</div>
		</div>
	</div>


</div>
</body>
</html>