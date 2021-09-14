#!/bin/bash

set -e

# Auto select fastest mirros
sudo cp ./sources.list /etc/apt/sources.list

# Ensure everything latest
sudo apt update && sudo apt upgrade -y

# Install via APT
_softwares="\
  apt-transport-https \
  clamtk \
  curl \
  flameshot \
  feh \
  filezilla \
  git \
  gpa \
  htop \
  i3 \
  i3blocks \
  ibus-unikey \
  imagemagick \
  keepassxc \
  libpam-u2f \
  playerctl \
  pavucontrol \
  pasystray \
  python \
  python-setuptools \
  python3-pip \
  qbittorrent \
  remmina \
  rofi \
  scrot \
  snap \
  screen \
  stow \
  telegram-desktop \
  thunderbird \
  tmux \
  virtualbox \
  virtualbox-guest-additions-iso \
  vlc \
  xarchiver \
  figlet \
  lolcat \
  "

for i in $_softwares
  do
    sudo apt install $i -y
done

# Install via Snap
sudo snap install slack --classic
sudo snap install spotify
sudo snap install skype
sudo snap install yubioath-desktop
sudo snap install wps-office-all-lang-no-internet

# touchpad-indicator
sudo add-apt-repository ppa:atareao/atareao -y
sudo apt install touchpad-indicator -y

# Install Google Chrome
cd $HOME/Downloads/
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb

# Sublime-text 4
cd $HOME/Downloads/
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | sudo apt-key add -
echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list
sudo apt update && sudo apt install sublime-text -y

# Skype
cd $HOME/Downloads/
wget https://repo.skype.com/latest/skypeforlinux-64.deb
sudo apt install ./skypeforlinux-64.deb

# 1Password
curl -sS https://downloads.1password.com/linux/keys/1password.asc \
  | sudo gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] \
  https://downloads.1password.com/linux/debian/amd64 stable main" \
  | sudo tee /etc/apt/sources.list.d/1password.list

sudo mkdir -p /etc/debsig/policies/AC2D62742012EA22/

curl -sS https://downloads.1password.com/linux/debian/debsig/1password.pol \
  | sudo tee /etc/debsig/policies/AC2D62742012EA22/1password.pol

sudo mkdir -p /usr/share/debsig/keyrings/AC2D62742012EA22

curl -sS https://downloads.1password.com/linux/keys/1password.asc \
  | sudo gpg --dearmor --output /usr/share/debsig/keyrings/AC2D62742012EA22/debsig.gpg

sudo apt update && sudo apt install 1password -y

# Teamviewer
cd $HOME/Downloads/
wget https://download.teamviewer.com/download/linux/teamviewer_amd64.deb
sudo apt install ./teamviewer_amd64.deb

# Dropbox
cd $HOME/Downloads/
cd ~ && wget -O - "https://www.dropbox.com/download?plat=lnx.x86_64" | tar xzf -
#~/.dropbox-dist/dropboxd

# Virtualbox
cd $HOME/Downloads/
vboxversion=$(wget -qO - https://download.virtualbox.org/virtualbox/LATEST.TXT)
wget "https://download.virtualbox.org/virtualbox/${vboxversion}/Oracle_VM_VirtualBox_Extension_Pack-${vboxversion}.vbox-extpack"
yes | sudo vboxmanage extpack install --replace Oracle_VM_VirtualBox_Extension_Pack-${vboxversion}.vbox-extpack

# Remove existing file
rm $HOME/.bashrc
rm $HOME/.bash_logout
rm $HOME/.bash_profile
rm $HOME/.bashrc.d

# Stow things
cd $HOME/dotfiles/

_list="$(for i in $(ls -d */); do echo ${i%%/}; done)"

for i in $_list
  do stow --verbose=2 $i
done

# Custom installation
# Yubikey
#sudo apt-get install libpam-u2f -y
#mkdir -p ~/.config/Yubico
#pamu2fcfg > ~/.config/Yubico/u2f_keys
#pamu2fcfg -n >> ~/.config/Yubico/u2f_keys

# Create symlinks
sudo ln -sf $HOME/scripts/bing-wallpaper /usr/local/bin/
sudo ln -sf $HOME/scripts/i3exit /usr/local/bin/

# Welcome
figlet "Welcome back, Again" | lolcat
