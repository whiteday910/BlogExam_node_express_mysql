<?php

$key = md5(time());

?>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
 
    <title>iOS / Android Localization String File Maker</title>

  </head>

  <body>
		<p>Samaple URL : https://docs.google.com/spreadsheets/d/16LKcEAXzI1USu204BtQ2lLVjujupadxqU2W0oY37qMU/edit#gid=0</p>
           <form action="proc.php" method="post">
				<p><input type="text" class="form-control" name="inputURLText" placeholder="ex>https://docs.google.com/spreadsheets/d/16LKcEAXzI1USu204BtQ2lLVjujupadxqU2W0oY37qMU/edit#gid=0" size="100" required value=""/>
				<input type="hidden" name="key" value="<?php echo $key; ?>" /></p>
				<button class="btn btn-default" type="submit" id="createLanguagePackBtn">Make Language Files</button>
			</form>

			<br>
			
  </body>
</html>
