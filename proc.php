<?php


	if(  !isset($_POST['inputURLText']) ||  !isset($_POST['key'])  )
	{
		echo "정상적인 접근이 아닙니다.";
		return ;
	}

	$inputURLText = $_POST["inputURLText"];
	$randomString = $_POST["key"];
	
	$inputURLText = str_replace("'","",$inputURLText);
	$randomString = str_replace("'","",$randomString);

	makeStringFiles($inputURLText,$randomString);




class HZip {
	private static function folderToZip($folder, &$zipFile, $exclusiveLength) {
		$handle = opendir($folder);
		while ($f = readdir($handle)) {
			if ($f != '.' && $f != '..') {
				$filePath = "$folder/$f";
				// Remove prefix from file path before add to zip.
				$localPath = substr($filePath, $exclusiveLength);
				if (is_file($filePath)) {
					$zipFile->addFile($filePath, $localPath);
				} elseif (is_dir($filePath)) {
					// Add sub-directory.
					$zipFile->addEmptyDir($localPath);
					self::folderToZip($filePath, $zipFile, $exclusiveLength);
				}
			}
		}
		closedir($handle);
	}
	
	public static function zipDir($sourcePath, $outZipPath) {
		$pathInfo = pathInfo($sourcePath);
		$parentPath = $pathInfo['dirname'];
		$dirName = $pathInfo['basename'];
		
		$z = new ZipArchive();
		$z->open($outZipPath, ZIPARCHIVE::CREATE);
		$z->addEmptyDir($dirName);
		self::folderToZip($sourcePath, $z, strlen("$parentPath/"));
		$z->close();
	}
}



function getCurrentDateTime()
{
	date_default_timezone_set('Asia/Seoul');
	$t = microtime(true);
	$micro = sprintf("%06d",($t - floor($t)) * 1000000);
	$d = new DateTime( date('Y-m-d H:i:s.'.$micro, $t) );

	return $d->format("Ymd Hisu");
}



function makeStringFiles($inputURLText,$randomString)
{
	$savedCurrentTime = getCurrentDateTime();
	echo "입력받은 URL 주소 출력 : ".$inputURLText."<br><br>";
	// 01 - 입력받은 URL 을 통해 publish 주소 만들기
	$picesArray = explode ("/", $inputURLText);
	$indexOfkey = 0;
	for($i=0;$i<count($picesArray);$i++)
	{
		$oneString = $picesArray[$i];
		if(strcmp($oneString,"d")==0)
		{
			$indexOfkey = $i+1;
		}
	}
	$keyString = $picesArray[$indexOfkey];

	// 디버깅 출력
//	echo $keyString;

	$parseJsonURL = "https://spreadsheets.google.com/feeds/worksheets/".$keyString."/public/values";
	


	// 디버깅 출력
	echo "<br> json 파싱할 URL 출력 : ".$parseJsonURL."<br>";


	// 02 - publish URL 접근하여 XML 파싱 후 JSON 주소 취득
	$jsonUrl = "";



	$arrContextOptions=array(
		"ssl"=>array(
			"verify_peer"=>false,
			"verify_peer_name"=>false,
		),
	);

	$content = file_get_contents($parseJsonURL,false, stream_context_create($arrContextOptions));

	if ( empty($content) )
	{
		die('XML is empty');
	}



	$xml=simplexml_load_string($content) or die("Error: Cannot create object");

	if ($xml === false)
	{
		echo "Failed loading XML: ";
		foreach(libxml_get_errors() as $error)
		{
			echo "<br>", $error->message;
		}
	}
	else
	{

		foreach($xml->entry->children() as $link)
		{
			
			// 디버깅 출력
			/*
			print_r($link);
			echo "<br>";
			echo $link["rel"]."<br><br>";
			*/

			if (strpos($link["rel"],'visualizationApi') !== false)
			{
				$jsonUrl = $link["href"];
			}
		}
	}

	echo "json URL : ".$jsonUrl."<br><br>";
	
	// 03 - json 접근하여, 행/열 값들 접근
	$json = file_get_contents($jsonUrl,false, stream_context_create($arrContextOptions));
	$json = str_replace("google.visualization.Query.setResponse(","",$json);
	$json = str_replace(");","",$json);

	$jsonObj = json_decode($json);

	// 디버깅
	//print_r( $jsonObj->table->rows);

	$arrayForLanguagePack = array();
	$languageArray =  $jsonObj->table->rows;

	$countOfWords = (count($languageArray)-1);
	$countOfLanguage = (count($languageArray[0]->c)-1);

	$resultLanguagePackArray[$countOfLanguage] = array();

	
	echo "언어 수 : ".$countOfLanguage."<br>";
	echo "문장 수 : ".$countOfWords."<br><br>";

	for($i=0; $i < count($languageArray); $i++)
	{
		$oneJsonObject = $languageArray[$i];  // jsonObject
		$valueArray = $oneJsonObject->c;
		for($j=0; $j < count($valueArray); $j++)
		{
			$keyAndValue = $valueArray[$j]; // jsonObject
			if(is_object($keyAndValue))
			{
		
			}
			else
			{
				break ;
			}
			$value = $keyAndValue->v;

			// 값들 전부 출력
			//echo "i: ".$i."  j: ".$j."  : ".$value."<br>";
			
			$resultLanguagePackArray[$j][$i]= $value;
		}

		// 값 출력시 가시성
//		echo "<br>";
	}
	
	// 테스트 출력
	//print_r($resultLanguagePackArray[1]);
	$iOSResult="";
	$androidResult="<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<resources>\r\n";

	


	for($i=1; $i <$countOfLanguage+1; $i++)
	{		
		for($j=0; $j<$countOfWords+1; $j++)
		{
			// 01 iOS용 파일 생성
			if($j!=0)
			{
				if( isset($resultLanguagePackArray[$i][$j]) )
				{
					$resultValue = str_replace('"', '\"', $resultLanguagePackArray[$i][$j]);
					$iOSResult.= "\"".$resultLanguagePackArray[0][$j]."\"=\"".$resultValue."\";\r\n";			
				}
				
			}

			// 02 Android용 XML 파일 생성
			if($j!=0)
			{
				if( isset($resultLanguagePackArray[$i][$j]) )
				{
					$resultValue = htmlspecialchars($resultLanguagePackArray[$i][$j]);
					$resultValue = str_replace("'", "\'", $resultValue);
					$androidResult.= "<string name=\"".$resultLanguagePackArray[0][$j]."\">".$resultValue."</string>\r\n";
				}
			}
		}
		$androidResult.="</resources>";


		// 테스트 출력
//		echo $iOSResult."<br>";
//		echo $androidResult."<br>";

		
		if(!file_exists("publishedString/".$savedCurrentTime." ".$randomString))
		{
			mkdir("publishedString/".$savedCurrentTime." ".$randomString);
		}

		if(!file_exists("publishedString/".$savedCurrentTime." ".$randomString."/strings"))
		{
			mkdir("publishedString/".$savedCurrentTime." ".$randomString."/strings");
		}

		if(!file_exists("publishedString/".$savedCurrentTime." ".$randomString."/strings/iOS"))
		{
			mkdir("publishedString/".$savedCurrentTime." ".$randomString."/strings/iOS");
		}
		
		if(!file_exists("publishedString/".$savedCurrentTime." ".$randomString."/strings/Android"))
		{
			mkdir("publishedString/".$savedCurrentTime." ".$randomString."/strings/Android");
		}
		
		$pathForiOS = "publishedString/".$savedCurrentTime." ".$randomString."/strings/iOS"."/".$resultLanguagePackArray[$i][0].".lproj";
		$pathForAndroid = "publishedString/".$savedCurrentTime." ".$randomString."/strings/Android"."/values-".$resultLanguagePackArray[$i][0];

		mkdir($pathForiOS);
		mkdir($pathForAndroid);

		$fileNameForiOS = $pathForiOS."/Localizable.strings";
		file_put_contents($fileNameForiOS, $iOSResult);

		$fileNameForAndroid = $pathForAndroid."/strings.xml";
		file_put_contents($fileNameForAndroid, $androidResult);

		$iOSResult="";
		$androidResult="<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<resources>\r\n";
	}



	$zipPath = "publishedString/".$savedCurrentTime." ".$randomString."/strings.zip";
	$zipName = "strings.zip";
	HZip::zipDir("publishedString/".$savedCurrentTime." ".$randomString."/strings",$zipPath );

    if (file_exists($zipPath))
	{

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-type: application/octet-stream");
        header("Content-Disposition: attachment; filename=".$zipName);
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: ".filesize($zipPath));
		ob_clean();
		flush();
		readfile($zipPath);
		exit;
	}

}
?>