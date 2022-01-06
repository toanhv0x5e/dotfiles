#!/bin/bash

set -e

# Auto select fastest mirros
sudo cp ./sources.list /etc/apt/sources.list

# Set time in US format
sudo localectl set-locale LC_TIME=en_US.utf8

# Ensure everything latest
sudo apt update && sudo apt upgrade -y

# Install via APT
_softwares="\
  apt-transport-https \
  clamtk \
  compton \
  curl \
  flameshot \
  feh \
  filezilla \
  fping \
  git \
  gitk \
  gpa \
  htop \
  i3 \
  i3blocks \
  ibus-unikey \
  imagemagick \
  inetutils-traceroute \
  insync-nautilus \
  keepassxc \
  libpam-u2f \
  nautilus-dropbox \
  nmap \
  postgresql-client-common \
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
sudo snap install code --classic
sudo snap install dbeaver-ce
sudo snap install slack --classic
sudo snap install spotify
sudo snap install skype
sudo snap install speedtest-cli
sudo snap install yubioath-desktop
sudo snap install wps-office-all-lang-no-internet

# ybacklight
cd $HOME/Downloads/
[ -d "$HOME/Downloads/ybacklight" ] || git clone https://github.com/szekelyszilv/ybacklight.git
cd ybacklight/src
sudo gcc ybacklight.c -o /usr/bin/ybacklight
echo "${USER} ALL=NOPASSWD: /usr/bin/ybacklight" | sudo tee /etc/sudoers.d/ybacklight > /dev/null

# touchpad-indicator
sudo add-apt-repository ppa:atareao/atareao -y
sudo apt install touchpad-indicator -y

# Install Google Chrome
cd $HOME/Downloads/
[ -f "$HOME/Downloads/google-chrome-stable_current_amd64.deb" ] || wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb

# Install Zoom
cd $HOME/Downloads/
[ -f "$HOME/Downloads/zoom_amd64.deb" ] || wget https://cdn.zoom.us/prod/5.7.31792.0820/zoom_amd64.deb
sudo dpkg -i zoom_amd64.deb

# Sublime-text 4
cd $HOME/Downloads/
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | sudo apt-key add -
echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list
sudo apt update && sudo apt install sublime-text -y

# Telegram desktop
cd $HOME/Downloads/
[ -f "$HOME/Downloads/tsetup.3.0.1.tar.xz" ] || wget https://updates.tdesktop.com/tlinux/tsetup.3.0.1.tar.xz
tar -xf tsetup.3.0.1.tar.xz -C . 
ln -sf $HOME/Downloads/Telegram/Telegram /usr/bin/telegram-desktop

# 1Password
curl -sS https://downloads.1password.com/linux/keys/1password.asc \
  | sudo gpg --batch --yes --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] \
  https://downloads.1password.com/linux/debian/amd64 stable main" \
  | sudo tee /etc/apt/sources.list.d/1password.list

sudo mkdir -p /etc/debsig/policies/AC2D62742012EA22/

curl -sS https://downloads.1password.com/linux/debian/debsig/1password.pol \
  | sudo tee /etc/debsig/policies/AC2D62742012EA22/1password.pol

sudo mkdir -p /usr/share/debsig/keyrings/AC2D62742012EA22

curl -sS https://downloads.1password.com/linux/keys/1password.asc \
  | sudo gpg --batch --yes --dearmor --output /usr/share/debsig/keyrings/AC2D62742012EA22/debsig.gpg

sudo apt update && sudo apt install 1password -y

# Teamviewer
cd $HOME/Downloads/
[ -f "$HOME/Downloads/teamviewer_amd64.deb" ] || wget https://download.teamviewer.com/download/linux/teamviewer_amd64.deb
sudo apt install ./teamviewer_amd64.deb

# Virtualbox
cd $HOME/Downloads/
vboxversion=$(wget -qO - https://download.virtualbox.org/virtualbox/LATEST.TXT)
wget "https://download.virtualbox.org/virtualbox/${vboxversion}/Oracle_VM_VirtualBox_Extension_Pack-${vboxversion}.vbox-extpack"
yes | sudo vboxmanage extpack install --replace Oracle_VM_VirtualBox_Extension_Pack-${vboxversion}.vbox-extpack

# Teraform
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" -y
sudo apt-get update && sudo apt-get install terraform -y

# Remove existing file
[ -f "$HOME/.bashrc" ] && rm $HOME/.bashrc
[ -f "$HOME/.bash_logout" ] && rm $HOME/.bash_logout
[ -f "$HOME/.bash_profile" ] && rm $HOME/.bash_profile
[ -d "$HOME/.bashrc.d" ] && rm -rf $HOME/.bashrc.d

# Stow things
cd $HOME/dotfiles/

_list="$(for i in $(ls -d */); do echo ${i%%/}; done)"

for i in $_list
  do stow --verbose=2 $i
done

# Register a new Yubikey manually.
# Add primary security key
# mkdir -p ~/.config/Yubico
# pamu2fcfg > ~/.config/Yubico/u2f_keys
# Add secondary security key
# pamu2fcfg -n >> ~/.config/Yubico/u2f_keys

# Create symlinks
sudo ln -sf $HOME/scripts/bing-wallpaper /usr/local/bin/
sudo ln -sf $HOME/scripts/i3exit /usr/local/bin/
sudo ln -sf $HOME/.config/i3/i3lock-fancy-multimonitor/lock /usr/local/bin/

# Welcome
figlet "Welcome back, Again" | lolcat
