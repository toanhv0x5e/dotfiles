# Fix: New tmux sessions do not source bashrc file
if [ -n "$BASH_VERSION" -a -n "$PS1" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
    . "$HOME/.bashrc"
    fi
fi

function gam() { "/home/toan/bin/gam/gam" "$@" ; }
export GAMCFGDIR="/home/toan/GAMConfig"
#alias gam="/home/toan/bin/gamadv-xtd3/gam"
alias gam3="/home/toan/bin/gamadv-xtd3/gam"
alias gam="/home/toan/bin/gamadv-xtd3/gam"
export PATH=/home/toan/program-files/hawk-3.5.0:/home/toan/perl5/bin:/home/toan/.ebcli-virtual-env/executables:/home/toan/perl5/bin:/home/toan/.ebcli-virtual-env/executables:/home/toan/.local/bin:/home/toan/bin:/home/toan/.nvm/versions/node/v14.21.3/bin:/home/toan/perl5/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin:/usr/local/script:/home/toan/bin:/home/toan/calibre-bin/calibre:/usr/local/script:/home/toan/bin:/home/toan/calibre-bin/calibre
