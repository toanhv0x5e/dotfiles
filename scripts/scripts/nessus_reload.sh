#!/usr/bin/env sh
#toanhv0x5e

_future="null"
#_future=$(date --date="100 days" 2>/dev/null)
_future="2021-04-10"

go_next(){
  sudo timedatectl set-ntp yes && sleep 2
  sudo systemctl restart nessusd
  exit 0
}

# Time walk
if [ ! "${EUID}" = "0" ] || [ ! "${_future}" = "null" ]; then
  sudo timedatectl set-ntp no && sleep 2
  sudo timedatectl set-time ${_future} && sleep 2
  sudo systemctl restart nessusd
else
  echo "Run as root." && exit 1
fi

# Back to present
while true; do
    read -p "Did Nessus showing expired?" yn
    case $yn in
        [Yy]* ) go_next; break;;
        [Nn]* ) sleep 60;;
        * ) echo "Please answer yes or no.";;
    esac
done

#sudo timedatectl set-time 2020-12-11
