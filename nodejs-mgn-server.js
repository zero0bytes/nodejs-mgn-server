
'use strict';

var XML = "<?xml version='1.0' encoding='UTF-8'?><datafeeder><tempkolumna>19.81</tempkolumna><tempbeczka> 19.50</tempbeczka><tempglowica> 19.62</tempglowica><tempwoda>19.75</tempwoda><tempbufor>19.50</tempbufor><tempalarm>19.75</tempalarm><tempdnia>0.00</tempdnia><stan_Zwoda>OFF</stan_Zwoda><stan_ZPrzedgon>OFF</stan_ZPrzedgon><stan_ZGon1>OFF</stan_ZGon1><stan_ZGon2>OFF</stan_ZGon2><sGetap>0</sGetap><sGetapSlownie>OFF</sGetapSlownie><sCzasProcesuGodz>0</sCzasProcesuGodz><sCzasProcesuMin>0</sCzasProcesuMin><sCzasProcesuSek>0</sCzasProcesuSek><sPowerPWR1>OFF</sPowerPWR1><sPowerPWR2>OFF</sPowerPWR2><sPowerPWR3>OFF 0</sPowerPWR3><sPowerG1>0</sPowerG1><sPowerG2>0</sPowerG2><sCzasZalewania>0</sCzasZalewania><sCzasStabilizacji>0</sCzasStabilizacji><sCzasPrzedgonu>0</sCzasPrzedgonu><sCzasRozgrzewania>0</sCzasRozgrzewania><sCzasGonu>0 godz   0 min</sCzasGonu><sCzasPogonu>0</sCzasPogonu><sCzasChlodzenia>0</sCzasChlodzenia><sMaxGonWindowStatus>Pulpit</sMaxGonWindowStatus><sMaxGonStatus>WYŁĄCZONY OFF</sMaxGonStatus><sZaworGonCntr>0</sZaworGonCntr><sZaworGon2Cntr>0</sZaworGon2Cntr><sZalanieZadaneX>5</sZalanieZadaneX><sZalanieX>0</sZalanieX><sHisterezaTemperatury>0.25</sHisterezaTemperatury><sPresure>2</sPresure><sMocZalaniaG1>95</sMocZalaniaG1><sMocZalaniaG2>95</sMocZalaniaG2><sMocStabilizacjiG1>80</sMocStabilizacjiG1><sMocStabilizacjiG2>80</sMocStabilizacjiG2><sMocPrzedgonuG1>10</sMocPrzedgonuG1><sMocPrzedgonuG2>78</sMocPrzedgonuG2><sMocGonuG1>55</sMocGonuG1><sMocGonuG2>77</sMocGonuG2><sMocGonu2_G1>12</sMocGonu2_G1><sMocGonu2_G2>95</sMocGonu2_G2><sTempZmianyMocyGonu> 45.00</sTempZmianyMocyGonu><sPlukanieOLM>15</sPlukanieOLM><sTempStopPogonu>79.00</sTempStopPogonu><sTempRozgrzewania>15.00</sTempRozgrzewania><sTempStartPogonu>97.00</sTempStartPogonu><sTempStopGrzania>55.00</sTempStopGrzania><sTempZG2>78.00</sTempZG2><sZadanyCzasStabilizacji>1</sZadanyCzasStabilizacji><sZadanyCzasOdbPrzedgonuSek>45</sZadanyCzasOdbPrzedgonuSek><sZadanyCzasOdbPrzedgonuMin>0</sZadanyCzasOdbPrzedgonuMin><sZadanyCzasStabPrzedgonu>1</sZadanyCzasStabPrzedgonu><sZadanyCzasZalewania>1</sZadanyCzasZalewania><sZadanyCzasPrzerwyMocyZalania>12</sZadanyCzasPrzerwyMocyZalania><sZadanyCzasChlodzenia>1</sZadanyCzasChlodzenia><sTEMPERATURE_PRECISION>12</sTEMPERATURE_PRECISION><sIloscZaworowGonu>2</sIloscZaworowGonu><sHistPoGonu>1</sHistPoGonu><sCzujnikZalania>1</sCzujnikZalania><sDuzeJeziorko>0</sDuzeJeziorko><sZadanyPoziomZalania>657</sZadanyPoziomZalania><sPrzerwaPoZalaniu>.......</sPrzerwaPoZalaniu><sTempUpdateTime>1000</sTempUpdateTime><sSSID>ELIBOMT-2016</sSSID><sPASS>2016-g788*aq9FpUmas</sPASS><sCzySTATION_AP>0</sCzySTATION_AP><sWIFI_SIGNAL>-80</sWIFI_SIGNAL><sESP_MILLIS>0</sESP_MILLIS><sConfigName>from program</sConfigName></datafeeder>";

var WebSocketServer  = require("ws").Server;
var finalhandler     = require('finalhandler');
var http             = require('http');
var serveStatic	     = require('serve-static');
var parseString	     = require('xml2js').parseString;
var xml2js           = require('xml2js');
var fs               = require('fs');
var os 				 = require("os");
var exec     = require('child_process').exec;
var execSync = require('child_process').execSync;
var PythonShell = require('python-shell');
var iwlist  = require('wireless-tools/iwlist');
var wpa_cli = require('wireless-tools/wpa_cli');
var util = require('util');
var jParser = require('jParser');

//exit: process.exit();



var ParametryPracy =
{
 gTempKolumna: 0,
 gTempBeczka:  0,
 gTempGlowica: 0,
 gTempWodaWy:  0,
 gTempBufor:   0,
 gTempAlarmu:  0,
 gTempDnia:	   0,
 
 gPressure:    0,
 
 gHisterezaTemperatury:	0, 
 
 gTempRozgrzewania:	  0.00,
 
 gCzasRozgrzewania:     0,
 gCzasZalewania: 		0,
 gCzasStabilizacji: 	0,
 gCzasZalania:          0,
 gCzasPrzedgonu:    	0,
 gCzasGonu:     		0,
 gCzasPogonu:   		0,
 gCzasChlodzenia: 	    0,
 
 gZadanyCzasZalewaniaMin:         0,   
 gZadanyCzasStabilizacjiMin:      0,    
 gZadanyCzasOdbPrzedgonuSek: 	  0,    
 gZadanyCzasOdbPrzedgonuMin: 	  0,    
 gZadanyCzasStabPrzedgonuMin:     0,    
 gZadanyCzasPrzerwyMocyZalaniaSek:0, 
 gZadanyCzasChlodzeniaMin:  	  0,
 
 gZalanieZadaneX:  0,
 gZalanieX:        0,
 gStart_zalania:   0,
 gStart_etapu:     0,
 
 gMocZalaniaG1:	 0,     // 0-255
 gMocZalaniaG2:  0,     // 0-255
 
 gMocStabilizacjiG1:	 0,     // 0-255
 gMocStabilizacjiG2:     0,     // 0-255
 
 gMocPrzedgonuG1:		   0,     // 0-255
 gMocPrzedgonuG2:	 	   0,     // 0-255
 gMocGonuG1:		 	   0,     // 0-255
 gMocGonuG2:	 	 	   0,     // 0-255
 gMocGonu2_G1:		       0,     // 0-255
 gMocGonu2_G2:	 	       0,     // 0-255
 
 gTempZmianyMocyGonu:      0,
 gPlukanieOLM:             0,  //sek
 gTempStopPogonu:          0,
 gTempStartPogonu:         0,
 gTempStopGrzania:         0,
 gTempZG2:                 0, 
 
 gEtap:        0,
 
 gHour:        0,
 gMinute:      0,
 gSecond:      0,
 
 gTotalWorkTimeSek: 0,
 
 gPowerPWR1:   false,
 gPowerPWR2:   false,
 gPowerPWR3:   false,
 
 gCzujnikZalania: false,
 
 gAUTO:        false,
 gMAN:         false, 
 
 gConfigName:    "",
 gSSID:          "",
 gPASS:          ""
 
};


//Adresy DSów
var tempId1 = '28-03165434a2ff';
var tempId2 = '28-0316518b16ff';
var tempId3 = '28-0316546283ff';
var tempId4 = '28-041654fc53ff';


var xml_out;
var json;

// display HD44780

var WIFI_signal_strength  = 0;
var WIFI_signal_quality   = 0;
var PI_counter = 0;

var serve;
var server;
var wss;
var wifi_networks = ""

var lcd_message = 0;
var LCD_options =
{
  args: ['value1', 'value2', 'value3']
};

 
var sta_ip;	
var ap_ip;	
var usb_ip;	



console.clear();

Load_maxgon_data();

Init_ConsoleInfo();

Load_config();

Load_config_wifi();

Init_Servers();

Init_Timers();

Init_Variables();

print_clients();

Update_LCD();

console.log((new Date()) + '   System ready...');


function Broadcast_Data()
{
 if(wss.readyState != wss.OPEN)
 {
   console.error('Client state is ' + wss.readyState);
 } else
 {
   wss.clients.forEach(function each(client)
   {
	 if(client.readyState == client.OPEN)
	 {
      client.send(xml_out);
     }
   });
 }	
}


function Load_config_wifi()
{

var file; 

 try {
   file = fs.readFileSync('data/wificnf.xml').toString();
  } catch (err)
  {
    console.log(err);
    return;
  }



 if(file.startsWith("<WIFIDATA>") == true)
 {
   console.log('try to parse wifi config file...');
   parseString(file, function(err, result)
   {
     if(err)
     { 
	   console.log(err);
	  return;
	 }
	 
	 json = result;
	
	 ParametryPracy.gSSID = json.WIFIDATA.sSSID;
	 ParametryPracy.gPASS = json.WIFIDATA.sPASS;
   
   });
   console.log('Wifi Config loaded...');
	 
 }



}


function Load_maxgon_data()
{
	
	// gTempKolumna: 0,
    // gTempBeczka:  0,
    // gTempGlowica: 0,
    // gTempWodaWy:  0,
    // gTempBufor:   0,
    // gTempAlarmu:  0,
    // gTempDnia:	 0,
	
	

	
	
}



// <?xml version='1.0' encoding='UTF-8'?><datafeeder><tempkolumna>19.81</tempkolumna><tempbeczka> 19.50</tempbeczka><tempglowica> 19.62</tempglowica><tempwoda>19.75</tempwoda><tempbufor>19.50</tempbufor><tempalarm>19.75</tempalarm><tempdnia>0.00</tempdnia><stan_Zwoda>OFF</stan_Zwoda><stan_ZPrzedgon>OFF</stan_ZPrzedgon><stan_ZGon1>OFF</stan_ZGon1><stan_ZGon2>OFF</stan_ZGon2><sGetap>0</sGetap><sGetapSlownie>OFF</sGetapSlownie><sCzasProcesuGodz>0</sCzasProcesuGodz><sCzasProcesuMin>0</sCzasProcesuMin><sCzasProcesuSek>0</sCzasProcesuSek><sPowerPWR1>OFF</sPowerPWR1><sPowerPWR2>OFF</sPowerPWR2><sPowerPWR3>OFF 0</sPowerPWR3><sPowerG1>0</sPowerG1><sPowerG2>0</sPowerG2><sCzasZalewania>0</sCzasZalewania><sCzasStabilizacji>0</sCzasStabilizacji><sCzasPrzedgonu>0</sCzasPrzedgonu><sCzasRozgrzewania>0</sCzasRozgrzewania><sCzasGonu>0 godz   0 min</sCzasGonu><sCzasPogonu>0</sCzasPogonu><sCzasChlodzenia>0</sCzasChlodzenia><sMaxGonWindowStatus>Pulpit</sMaxGonWindowStatus><sMaxGonStatus>WYŁĄCZONY OFF</sMaxGonStatus><sZaworGonCntr>0</sZaworGonCntr><sZaworGon2Cntr>0</sZaworGon2Cntr><sZalanieZadaneX>5</sZalanieZadaneX><sZalanieX>0</sZalanieX><sHisterezaTemperatury>0.25</sHisterezaTemperatury><sPresure>2</sPresure><sMocZalaniaG1>95</sMocZalaniaG1><sMocZalaniaG2>95</sMocZalaniaG2><sMocStabilizacjiG1>80</sMocStabilizacjiG1><sMocStabilizacjiG2>80</sMocStabilizacjiG2><sMocPrzedgonuG1>10</sMocPrzedgonuG1><sMocPrzedgonuG2>78</sMocPrzedgonuG2><sMocGonuG1>55</sMocGonuG1><sMocGonuG2>77</sMocGonuG2><sMocGonu2_G1>12</sMocGonu2_G1><sMocGonu2_G2>95</sMocGonu2_G2><sTempZmianyMocyGonu> 45.00</sTempZmianyMocyGonu><sPlukanieOLM>15</sPlukanieOLM><sTempStopPogonu>79.00</sTempStopPogonu><sTempRozgrzewania>15.00</sTempRozgrzewania><sTempStartPogonu>97.00</sTempStartPogonu><sTempStopGrzania>55.00</sTempStopGrzania><sTempZG2>78.00</sTempZG2><sZadanyCzasStabilizacji>1</sZadanyCzasStabilizacji><sZadanyCzasOdbPrzedgonuSek>45</sZadanyCzasOdbPrzedgonuSek><sZadanyCzasOdbPrzedgonuMin>0</sZadanyCzasOdbPrzedgonuMin><sZadanyCzasStabPrzedgonu>1</sZadanyCzasStabPrzedgonu><sZadanyCzasZalewania>1</sZadanyCzasZalewania><sZadanyCzasPrzerwyMocyZalania>12</sZadanyCzasPrzerwyMocyZalania><sZadanyCzasChlodzenia>1</sZadanyCzasChlodzenia><sTEMPERATURE_PRECISION>12</sTEMPERATURE_PRECISION><sIloscZaworowGonu>2</sIloscZaworowGonu><sHistPoGonu>1</sHistPoGonu><sCzujnikZalania>1</sCzujnikZalania><sDuzeJeziorko>0</sDuzeJeziorko><sZadanyPoziomZalania>657</sZadanyPoziomZalania><sPrzerwaPoZalaniu>.......</sPrzerwaPoZalaniu><sTempUpdateTime>1000</sTempUpdateTime><sSSID>ELIBOMT-2016</sSSID><sPASS>2016-g788*aq9FpUmas</sPASS><sCzySTATION_AP>0</sCzySTATION_AP><sWIFI_SIGNAL>-80</sWIFI_SIGNAL><sESP_MILLIS>0</sESP_MILLIS></datafeeder>";
// <xmlconfig><sZalanieZadaneX>5</sZalanieZadaneX><sHisterezaTemperatury>0.25</sHisterezaTemperatury><sMocZalaniaG1>95</sMocZalaniaG1><sMocZalaniaG2>95</sMocZalaniaG2><sMocStabilizacjiG1>80</sMocStabilizacjiG1><sMocStabilizacjiG2>80</sMocStabilizacjiG2><sMocPrzedgonuG1>10</sMocPrzedgonuG1><sMocPrzedgonuG2>78</sMocPrzedgonuG2><sMocGonuG1>55</sMocGonuG1><sMocGonuG2>77</sMocGonuG2><sMocGonu2_G1>12</sMocGonu2_G1><sMocGonu2_G2>95</sMocGonu2_G2><sTempZmianyMocyGonu>45</sTempZmianyMocyGonu><sPlukanieOLM>15</sPlukanieOLM><sTempStopPogonu>79</sTempStopPogonu><sTempRozgrzewania>15</sTempRozgrzewania><sTempStartPogonu>97</sTempStartPogonu><sTempStopGrzania>55</sTempStopGrzania><sTempZG2>78</sTempZG2><sZadanyCzasStabilizacji>1</sZadanyCzasStabilizacji><sZadanyCzasOdbPrzedgonuSek>45</sZadanyCzasOdbPrzedgonuSek><sZadanyCzasOdbPrzedgonuMin>0</sZadanyCzasOdbPrzedgonuMin><sZadanyCzasStabPrzedgonu>1</sZadanyCzasStabPrzedgonu><sZadanyCzasZalewania>1</sZadanyCzasZalewania><sZadanyCzasPrzerwyMocyZalania>12</sZadanyCzasPrzerwyMocyZalania><sZadanyCzasChlodzenia>1</sZadanyCzasChlodzenia><sTEMPERATURE_PRECISION>12</sTEMPERATURE_PRECISION><sIloscZaworowGonu>1</sIloscZaworowGonu><sHistPoGonu>1</sHistPoGonu><sCzujnikZalania>1</sCzujnikZalania><sDuzeJeziorko>0</sDuzeJeziorko><sZadanyPoziomZalania>657</sZadanyPoziomZalania><sPrzerwaPoZalaniu>12</sPrzerwaPoZalaniu><sTempUpdateTime>1000</sTempUpdateTime><sConfigName></sConfigName>
function Load_config()
{

var file; 

 try {
   file = fs.readFileSync('data/config.xml').toString();
  } catch (err)
  {
    console.log(err);
    return;
  }



 if(file.startsWith("<xmlconfig>") == true)
 {
   console.log('try to parse config file...');
   parseString(file, function(err, result)
   {
     if(err)
     { 
	   console.log(err);
	  return;
	 }
	 
	 json = result;
	 ParametryPracy.gZalanieZadaneX = json.xmlconfig.sZalanieZadaneX;
	 ParametryPracy.gHisterezaTemperatury = json.xmlconfig.sHisterezaTemperatury;
	 
	 ParametryPracy.gMocZalaniaG1 = json.xmlconfig.sMocZalaniaG1;
	 ParametryPracy.gMocZalaniaG2 = json.xmlconfig.sMocZalaniaG2;
	 
	 ParametryPracy.gMocStabilizacjiG1 = json.xmlconfig.sMocStabilizacjiG1;
	 ParametryPracy.gMocStabilizacjiG2 = json.xmlconfig.sMocStabilizacjiG2;
	 
	 ParametryPracy.gMocPrzedgonuG1 = json.xmlconfig.sMocPrzedgonuG1;
	 ParametryPracy.gMocPrzedgonuG2 = json.xmlconfig.sMocPrzedgonuG2;
	 
	 ParametryPracy.gMocGonuG1 = json.xmlconfig.sMocGonuG1;
	 ParametryPracy.gMocGonuG2 = json.xmlconfig.sMocGonuG2;
	 
	 ParametryPracy.gMocGonu2_G1 = json.xmlconfig.sMocGonu2_G1;
	 ParametryPracy.gMocGonu2_G2 = json.xmlconfig.sMocGonu2_G2;
	 
	 ParametryPracy.gTempZmianyMocyGonu = json.xmlconfig.sTempZmianyMocyGonu;
	 ParametryPracy.gPlukanieOLM = json.xmlconfig.sPlukanieOLM;
	 
	 
	 ParametryPracy.gConfigName = json.xmlconfig.sConfigName;
	
   });
   console.log('Config loaded...');
	 
 }



}


function Update_LCD()
{
	switch( lcd_message )
	 {
		case 0:
		{
		   LCD_options.args[0] = sta_ip;
           LCD_options.args[1] = ap_ip;
		break;
		}
		
		case 1:
		{
		   LCD_options.args[0] = "MaxGon v 3";
           LCD_options.args[1] = "P mbar: " + ParametryPracy.gPressure;
			
		break;
		}
		
		case 2:
		{
		   LCD_options.args[0] = "Work Time:";
           LCD_options.args[1] = ParametryPracy.gHour + ":" + ParametryPracy.gMinute + ":" + ParametryPracy.gSecond;	 
		break;
		}
		
		case 3:
		{
		   LCD_options.args[0] = "RPI: " + PI_counter;
           LCD_options.args[1] = "Mem: " + parseInt((os.freemem() / 1024)/1024) + " MB"; 
           //os.freemem();
        break;
	    }
	    
	    case 4:
		{
		   
		   if(ParametryPracy.gAUTO == true)
		   {
		    LCD_options.args[0] = "AUTO --> ON";
            //LCD_options.args[1] = "AUTO --ON"; 
		   }else
		   {
			LCD_options.args[0] = "AUTO --> OFF";
            //LCD_options.args[1] = "AUTO --OFF"; 
		   }
		   if(ParametryPracy.gMAN == true)
		   {
		    //LCD_options.args[0] = "Status:";
            LCD_options.args[1] = "MAN  --> ON"; 
		   }else
		   {
			//LCD_options.args[0] = "Status:";
            LCD_options.args[1] = "MAN  --> OFF";   
		   }
		  
		   
        break;
	    }
	    case 5:
		{
			
			LCD_options.args[0] = "WIFI: " + WIFI_signal_strength + " dbm";
            LCD_options.args[1] = usb_ip; 
		   
        break;
	    }
		
	}
    
    lcd_message++;
    
    if(lcd_message >= 6) lcd_message = 0;    
    
    PythonShell.run('update_lcd.py', LCD_options, function (err, results)
    {
     if (err) throw err;
     
    });
    
    Read_WIFI_Signal();
	
}

//jessie  sta:wlan0  ap:wlan1 usb:usb0
//stretch sta:wlan0  ap:ap0   usb:usb0
function GetIP_STA()
{
	sta_ip = require('os').networkInterfaces().wlan0[0].address;
}

function GetIP_AP()
{
	ap_ip = require('os').networkInterfaces().ap0[0].address;
}

function GetIP_USB()
{
	usb_ip = require('os').networkInterfaces().usb0[0].address;
}

function print_clients()
{
	var count = 0;
	wss.clients.forEach(function each(client)
	{
	 count++;	
	});
	//console.log('clients connected: ', count);
	
	Read_WIFI_Signal();
	
	//console.log("Auto time: " + ParametryPracy.gHour + ":" + ParametryPracy.gMinute + ":" + ParametryPracy.gSecond);

       
    try {
        GetIP_STA();
    }catch (err)
    {
	    sta_ip = "STA: OFF-LINE";	
     console.log("STA wlan0:  " + err);
    }
    
    try {
       GetIP_AP();
    }catch (err)
    {
	    ap_ip = "AP: OFF-LINE";	
     console.log(err);
    }
    
    try {
       GetIP_USB();
    }catch (err)
    {
	    usb_ip = "USB: OFF-LINE";	
     console.log(err);
    }
    
    
    console.log("RPI live counter: " + PI_counter);
        
}

function Read_WIFI_Signal()
{
  fs.readFile('/proc/net/wireless', 'utf8', function (err,data)
{
  if (err)
  {
    return console.log(err);
  }
  var temp_position = data.indexOf("wlan");
  
  if(temp_position > 1)
  {  
   var res_str = data.substr(temp_position + 19, 3);//23562
   WIFI_signal_strength = parseInt(res_str);
  }else
  {
	WIFI_signal_strength = 31;  
  }
  
  //string.substr(start, length)
  
// temp_position 163
// Inter-| sta-|   Quality        |   Discarded packets               | Missed | WE
// face | tus | link level noise |  nwid  crypt   frag  retry   misc | beacon | 22
// wlan0: 0000   45.  -65.  -256        0      0      0      5      0        0
 
});
}


function Init_ConsoleInfo()
{
 //console.clear();
 console.log('.');
 console.log('...');
 console.log('.......');
 console.log('#################################################################');
 console.log('###                       MaxGon V 3                          ###');
 console.log('#          <Copyright (c) Misrocoft Corporation 2017 >          #');
 console.log('#             <All Rights Reversed TradeMark (tm)>              #');
 console.log('###                                                           ###');
 console.log('#################################################################');
 console.log('.......');
 console.log('...');
 console.log('..');
 console.log('.');
 console.log('Witamy w MaxGon Server v3: initiation startup sequence ... . . -->');
 console.log('Host: '         + os.hostname());
 console.log('System: '       + os.type());
 console.log('Architecture: ' + os.arch());
 console.log('Free memory: '  + parseInt((os.freemem() / 1024) / 1024) + " MB" );
 console.log("System path: "  + process.cwd());	
 console.log('.');
 console.log('.');
 console.log('.');	
}

function Init_Servers()
{
 serve = serveStatic('/home/pi/www/www/', {'index': ['menu.html', 'menu.htm']});
 server = http.createServer(function onRequest (req, res)
 {
    
    //AUTH:
    //var userpass = new Buffer((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
    //if (userpass !== 'admin:123456')
    //{
        //res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="nope"' });
        //res.end('HTTP Error 401 Unauthorized: Access is denied');
        //return;
    //}	
	
	
  if (req.url === '/scanwifi')
  {
        res.writeHead(200, {'Content-Type': 'text/plain'} );
        WIFI_Scan();
        res.write(wifi_networks);
        res.end();
        console.log('wifi-scanning...done');
        //console.log(wifi_networks);
        return;
  }	

  serve(req, res, finalhandler(req, res))
 });

 server.listen(80, function()
 {
    console.log((new Date()) + '   WWW server is listening on port 80');
    console.log((new Date()) + '   waiting for request');
 });

 wss = new WebSocketServer({server: server});
 
 wss.on('connection', function connection(ws,req)
 {
	const ip6 = req.connection.remoteAddress;
	var indexOfColon = ip6.lastIndexOf(':');
	var ip = ip6.substring(indexOfColon+1,ip6.length);
	
    console.log('Connection received: ', ip);
        
    ws.on('message', function incoming(data)
    {
      
      if(data == "data please...")
      {     
       Broadcast_Data();
       //console.log(data);// for debugging only!
       return;	
      }
      
      if(data == "AUTO-ON")
      {
       Auto_Start();
       console.log(data);// for debugging only!
       return;	
      }
      
      if(data == "AUTO-OFF")
      {    
	   Auto_Stop();
	   console.log(data);// for debugging only!
       return;		   
	  }
	  
	  if(data == "RPI-RESET")
      {    
	   RPI_reset();
	   console.log(data);// for debugging only!
       return;		   
	  }
	  
	  if(data.startsWith("<xmlconfig>") == true)
	  {
	    fs.writeFile("data/config.xml", data, function(err) 
	    {
         if(err)
         {
          return console.log(err);
         }
        console.log("config saved!");
        Load_config();
        
       }); 
	  }
	  
	  if(data.startsWith("<WIFIDATA>") == true)
	  {
	    fs.writeFile("data/wificnf.xml", data, function(err) 
	    {
         if(err)
         {
          return console.log(err);
         }
        console.log("wifi config saved!");
       }); 
	  }

      
    });
 });

 console.log((new Date()) + "   WS server is Running...");	
}



function Init_Variables()
{
 ParametryPracy.gTempKolumna = 0;
 ParametryPracy.gTempBeczka  = 0;
 ParametryPracy.gTempGlowica = 0;
 ParametryPracy.gTempWoda    = 0;
 ParametryPracy.gTempBufor   = 0;
 ParametryPracy.gTempAlarmu  = 0;
 ParametryPracy.gTempDnia    = 0;
 ParametryPracy.gPressure    = 0;
 console.log('setup variables...');	
}

function Init_Timers()
{
 setInterval(DATA_Update,1000);
 setInterval(print_clients,30000);
 setInterval(Update_LCD,5000);
 setInterval(Check_AP_CHANNEL,1500000); // 15 minutek
 console.log('initialize timers....OK!');
 // hour: 3600000	300000 5 minut
}

function setCharAt(str,index,chr)
{
	if(index > str.length-1) return str;
	return str.substr(0,index) + chr + str.substr(index+1);
}


function Check_AP_CHANNEL()
{
   console.log("Try to update AP channel...");
   
   var iwlistwlan0;
 
   try
   {
    iwlistwlan0 = execSync('iwlist wlan0 channel | grep Current').toString();
   } catch (err)
   {
    console.log("iwlist no network");
    return;
   }

	//Current Frequency:2.432 GHz (Channel 5)          or (Channel 12)
	
   var searching = iwlistwlan0.search("Channel");
   iwlistwlan0 = iwlistwlan0.slice(searching + 7,searching + 7 + 3);
   iwlistwlan0 = iwlistwlan0.trim();
   if(iwlistwlan0.endsWith(")"))
   {
	 iwlistwlan0 = iwlistwlan0.slice(0, iwlistwlan0.length - 1); 
   }
   
  
  if(parseInt( iwlistwlan0 ) == NaN)
  {
	console.log("error iwlistwlan0: " + iwlistwlan0 + "  is number?");
	return; 
  }
 
   
  console.log("current channel:" + iwlistwlan0);
  
 
 var file_str; 

 try
 {
   file_str = fs.readFileSync('/etc/hostapd/hostapd.conf').toString();
  } catch (err)
 {
    console.log("cannot open: hostapd.conf");
    return;
 }
	// console.log(str_file);
	
	searching = file_str.search("channel=");
	
	var top_str    = file_str.slice(0, searching);
	var down_str   = file_str.slice(searching + 10,file_str.length);
	var result_str = top_str + "channel=" + iwlistwlan0 + "\n" + down_str;
	
	//console.log(result_str);
		
	//fs.writeFileSync("../maxgon/hostapd.conf", result_str);
	
	fs.writeFile("data/hostapd.conf", result_str, function(err) 
	    {
         if(err)
         {
          return console.log(err);
         }
        console.log("Update AP channel...OK");
       });

	// interface=wlan1
	// ssid=RPI-Z
	// hw_mode=g
	// channel=5
	// macaddr_acl=0
	// auth_algs=1
	// ignore_broadcast_ssid=0
	// wpa=2
	// wpa_passphrase=bombel2017
	// wpa_key_mgmt=WPA-PSK
	// wpa_pairwise=TKIP
	// rsn_pairwise=CCMP
	// #ieee80211n=1
	// wme_enabled=1

}


function WIFI_Scan()
{
	
	
	//[ example object:
    //{
    // address:   '00:0b:81:ab:14:22',
    // ssid:      'BlueberryPi',
    // mode:      'master',
    // frequency: 2.437,
    // channel:   6,
    // security:  'wpa',
    // quality:   48,
    // signal:    87
    //},
    //{ next--->
	
	
	iwlist.scan('wlan0', function(err, networks)
    {
     //console.log(networks);
     wifi_networks = "";
     for (var i = 0; i < networks.length; i++)
     {
      //wifi_networks += JSON.stringify(networks[i]);
      wifi_networks += networks[i].ssid;
      wifi_networks += " ";
      wifi_networks += networks[i].channel;
      wifi_networks += " ";
      wifi_networks += networks[i].security;
      wifi_networks += " ";
      wifi_networks += networks[i].quality;
      wifi_networks += " ";
      wifi_networks += networks[i].signal;
      wifi_networks += " ";
      wifi_networks += ":";
     }
    });
    // results: ELIBOMT-2016 5 wpa2 51 -59:bubula 5 wpa2 31 -79:
   }

function WIFI_Status()
{
	wpa_cli.status('wlan0', function(err, status)
	{
     console.dir(status);
     //return status;
    });
}


function RPI_reset()
{
	exec( "reboot", function( error, stdout, stderr )
	{
        if ( error != null )
        {
          console.log( "Error: " + error);
        }
 		
    });
	
}


function DATA_Update()
{

parseString(XML, function(err, result)
 {
	    ParametryPracy.gTempBufor    = Math.floor(Math.random(0,100)*100);
        ParametryPracy.gTempAlarmu   = Math.floor(Math.random(0,100)*100);
        ParametryPracy.gTempDnia     = Math.floor(Math.random(0,100)*100);
	 
	    if(err)
        { 
			console.log(err);
			return;
		}
        json = result;
        json.datafeeder.sESP_MILLIS  = PI_counter;
        
        json.datafeeder.tempkolumna  = ParametryPracy.gTempKolumna;
        json.datafeeder.tempbeczka   = ParametryPracy.gTempBeczka;
        json.datafeeder.tempglowica  = ParametryPracy.gTempGlowica;
        json.datafeeder.tempwoda     = ParametryPracy.gTempWoda;
        json.datafeeder.tempbufor    = ParametryPracy.gTempBufor;
        json.datafeeder.tempalarm    = ParametryPracy.gTempAlarmu;
        json.datafeeder.tempdnia     = ParametryPracy.gTempDnia;
        
        json.datafeeder.sPresure     = ParametryPracy.gPressure;
        
        json.datafeeder.sWIFI_SIGNAL = WIFI_signal_strength;
        
        json.datafeeder.sCzasProcesuGodz = ParametryPracy.gHour;
        json.datafeeder.sCzasProcesuMin  = ParametryPracy.gMinute;
        json.datafeeder.sCzasProcesuSek  = ParametryPracy.gSecond;
        json.datafeeder.sGetap			 = ParametryPracy.gEtap;
        
        json.datafeeder.sZalanieZadaneX  = ParametryPracy.gZalanieZadaneX;
        json.datafeeder.sHisterezaTemperatury  = ParametryPracy.gHisterezaTemperatury;
        
        json.datafeeder.sMocZalaniaG1 = ParametryPracy.gMocZalaniaG1;
        json.datafeeder.sMocZalaniaG2 = ParametryPracy.gMocZalaniaG2;
        
        json.datafeeder.sMocStabilizacjiG1 = ParametryPracy.gMocStabilizacjiG1;
        json.datafeeder.sMocStabilizacjiG2 = ParametryPracy.gMocStabilizacjiG2;
        
        json.datafeeder.sMocPrzedgonuG1 = ParametryPracy.gMocPrzedgonuG1;
        json.datafeeder.sMocPrzedgonuG2 = ParametryPracy.gMocPrzedgonuG2;
       
        json.datafeeder.sMocGonuG1 =  ParametryPracy.gMocGonuG1;
        json.datafeeder.sMocGonuG2 =  ParametryPracy.gMocGonuG2;
        
        json.datafeeder.sMocGonu2_G1 =  ParametryPracy.gMocGonu2_G1;
        json.datafeeder.sMocGonu2_G2 =  ParametryPracy.gMocGonu2_G2;
        
        json.datafeeder.sPlukanieOLM = ParametryPracy.gPlukanieOLM;
        json.datafeeder.sTempZmianyMocyGonu = ParametryPracy.gTempZmianyMocyGonu;
        
        json.datafeeder.sConfigName = ParametryPracy.gConfigName;
                
        json.datafeeder.sSSID = ParametryPracy.gSSID;
        json.datafeeder.sPASS = ParametryPracy.gPASS;
        
            
        
 
 var builder = new xml2js.Builder();
 xml_out     = builder.buildObject(json);
 
 PI_counter++;
  
});
  
}



