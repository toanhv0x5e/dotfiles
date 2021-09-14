#!/bin/sh
#
# script to fix vmware error after update linux kernel
#

#sudo dkms install vmware-modules/12 -k 4.4.52-1-lts

#sudo dkms install vboxhost/5.1.16_OSE -k 4.4.52-1-lts

#sudo dkms install vmware-modules/9 -k 4.4.52-1-lts

sudo vmware-modconfig --console --install-all

#
#sudo pacman -S linux-lts linux-lts-headers
#reboot
#
