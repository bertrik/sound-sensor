/*--------------------------------------------------------------------
  This file is part of the TTN-Apeldoorn Sound Sensor.

  This code is free software:
  you can redistribute it and/or modify it under the terms of a Creative
  Commons Attribution-NonCommercial 4.0 International License
  (http://creativecommons.org/licenses/by-nc/4.0/) by
  TTN-Apeldoorn (https://www.thethingsnetwork.org/community/apeldoorn/) 

  The program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  --------------------------------------------------------------------*/

/*!
 * \brief Sond snsor payload decoder.
 * Payload format decoder for The Things Network.
 * \author Marcel Meek, Remko welling
 * \date See revision table
 * \version see revision table
 * 
 * ## version
 * 
 * version | date       | who            | Comment
 * --------|------------|----------------|-------------------------------------
 * 0.1     | 22-4-2020  | Marcel Meek    | Initial release within community for review and testing within dev-team
 * 0.2     | 26-4-2020  | Remko Welling  | Sanitize code, add comments, added switch-case for application port number to allow expantion to future packet types.
 * 0.3     | 26-4-2020  | Remko Welling  | Added decoding for WiFi localisation.
 *
 */
function Decoder(bytes, port) {
   // Functions and variables for sonde payload decoding
   
   // Decode an uplink message from a buffer
   // (array) of bytes to an object of fields.
   
   var i = 0;  // nibbleCount (nibble is 4 bits)
   var decoded = {};
  
   // get 12 bits value from payload and convert it to float and divide by 10.0
   function getVal12(){
      var val = 0;
      if(i % 2 === 0) {
         val  = bytes[i>>1] << 4;
         val |= (bytes[(i>>1) +1] & 0xf0) >> 4
      }else{
         val  = (bytes[i>>1]  & 0x0f) << 8;
         val |= (bytes[(i>>1) +1]);
      }
      // test sign bit (msb in a 12 bit value)
      if(val & 0x800){
         val |= 0xfffff000;     // make negative
      }
      i += 3;
      return val / 10.0;
   }

   // Functions and variables for WiFi Localisation
   
   var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7","8", "9", "A", "B", "C", "D", "E", "F"];

   // get array of values
   function getList12(len){
      var list = [];
      for( j=0; j<len; j++){
         list[j] = getVal12();
      }
      return list;
   }
   
   function byteToHex(b) {
      return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
   }

   function hexToInt(hex) {
      var num=hex;
      if (num>0x7F) {
         num=num-0x100;
      }
      return num;
   }

   switch(port) {
      case 10:
         // decode payload in spectrum peak and average for level a, c and z
         {
           decoded.la = {};
           decoded.la.spectrum = getList12(9);   // list length = 9
           decoded.la.peak = getVal12();
           decoded.la.avg = getVal12();
     
           decoded.lc = {};
           decoded.lc.spectrum = getList12(9);   // list length = 9
           decoded.lc.peak = getVal12();
           decoded.lc.avg = getVal12();
     
           decoded.lz = {};    
           decoded.lz.spectrum = getList12(9);   // list length = 9
           decoded.lz.peak = getVal12();
           decoded.lz.avg = getVal12();
           
           return decoded;
         }
         break;
      
      case 1:
         {
            var mac1="";
            for (i = 0; i < 6; i++){ 
               mac1 += byteToHex(bytes[i]);
               if (i<5){
                  mac1+=':';
               }
            }
            var rssi1=hexToInt(bytes[6]);
            
            var mac2="";
            for (i = 0; i < 6; i++){ 
               mac2 += byteToHex(bytes[i+7]);
               if (i<5){
                  mac2+=':';
               }
            }
            var rssi2=hexToInt(bytes[13]);
            
            return{
               macaddress:{
                  mac_1 : mac1,
                  rssi_1: rssi1,
                  mac_2 : mac2,
                  rssi_2: rssi2,
               },
            };
         }
         break;
      
      default:
         // Process all other information
         return bytes;
         break;
   }
}


 


