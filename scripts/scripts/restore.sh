#!/bin/bash
# Script to restore the backup dotfiles from $HOME/backup to the new dotfiles directory.

_pwd="$(pwd)"
_filename="$(ls -p $HOME/backup/ | grep -v / | tail -1)"

function restore {
    cd $HOME/backup/
    [ -d "$HOME/backup/extracted" ] && rm -rf $HOME/backup/extracted
    mkdir -p ./extracted/
    tar -xvf ${_filename} -C ./extracted/
    yes | cp -r ./extracted/home/toan/dotfiles/* $HOME/dotfiles/
    [ -d "$HOME/backup/extracted" ] && rm -rf $HOME/backup/extracted
    cd $_pwd
}

restore && echo "Restore done." || exit 1
