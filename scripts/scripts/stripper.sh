#!/bin/bash
echo "This script requires tshark"
echo
echo "Checking for tshark"
type tshark &>/dev/null || { echo "I require tshark but it's not installed.  Aborting." >&2; exit 1; }
echo "tshark found"
echo
echo "Moving on...."
echo
echo "Please the path to the capture (ex. /home/john/NETGEAR.cap)"
read cap_path
echo
 
while [ ! -f "$cap_path" ];do
       echo
       echo "File cannot be found or does not exist"
       echo
       echo "Please the path to the capture (ex. /home/john/NETGEAR.cap):"
       read cap_path
done
echo
echo "Please enter the ESSID (ex. NETGEAR)"
read essid
 
while [ -z "$essid" ]; do
       echo "You still didnt enter any data n00b"
       echo
       echo "Please enter the ESSID (ex. NETGEAR)"
       read essid
 
done
echo
echo "Stripping file...."
tshark -r $cap_path -Y "eapol || wlan_mgt.tag.interpretation eq $essid || (wlan.fc.type_subtype==0x08 && wlan_mgt.ssid eq $essid)" -w stripped.cap
echo
echo "Your stripped file should be located in the current directory and named stripped.cap."
