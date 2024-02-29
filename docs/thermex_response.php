<?php
//you can print text, image, barcode and QR code by sending request from your website. You just need to send data in JSON format
//note that putting comments, header output etc. may create invalid JSON response and app cannot parse the response
$a = array();

//sending text entry
$obj1->type = 0;//text
$obj1->content = 'My Title';//any string	
$obj1->bold = 1;//0 if no, 1 if yes
$obj1->align =2;//0 if left, 1 if center, 2 if right
$obj1->format = 3;//0 if normal, 1 if double Height, 2 if double Height + Width, 3 if double Width, 4 if small
array_push($a,$obj1);

//sending image entry		
$obj2->type = 1;//image
$obj2->path = 'https://www.mydomain.com/image.jpg';//complete filepath on your web server; make sure that it is not big size
$obj2->align = 2;//0 if left, 1 if center, 2 if right; set left align for big size images
array_push($a,$obj2);

//sending barcode entry		
$obj3->type = 2;//barcode
$obj3->value = '1234567890123';//valid barcode value
$obj3->width = 100;//valid barcode width
$obj3->height = 50;//valid barcode height
$obj3->align = 0;//0 if left, 1 if center, 2 if right
array_push($a,$obj3);

//sending QR entry		
$obj4->type = 3;//QR code
$obj4->value = 'sample qr text';//valid QR code value
$obj4->size = 40;//valid QR code size in mm
$obj4->align = 2;//0 if left, 1 if center, 2 if right
array_push($a,$obj4);

//sending HTML Code	
$obj5->type = 4;//HTML Code
$obj5->content = "<center><span style=\"font-weight:bold; font-size:20px;\">This is sample text</span></center>";
array_push($a,$obj5);

//sending empty line
$obj6->type = 0;//text
$obj6->content = ' ';//empty line
$obj6->bold = 0;
$obj6->align = 0;
array_push($a,$obj6);

//sending multi lines text
$obj7->type = 0;//text
$obj7->content = 'This text has<br />two lines';//multiple lines text
$obj7->bold = 0;
$obj7->align = 0;
array_push($a,$obj7);

echo json_encode($a,JSON_FORCE_OBJECT);
//Note that same sequence will be used for printing content
//Note: If any non english entry is added, it will get auto get converted to text special if this setting is on in the app. You will find this setting in Settings->Special Characters
?>
