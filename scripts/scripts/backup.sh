#!/bin/bash
# Script to compress current dotfiles directory to tar file located in $HOME/backup.

_pwd="$(pwd)"
_filename="$(echo "dotfile_"`date +"%Y-%m-%d_%H.%M.%S"`)"

function backup {
    mkdir -p $HOME/backup 2>/dev/null
    cd $HOME/
    tar -cvf $HOME/backup/${_filename}.tar $HOME/dotfiles/*
    cd $_pwd
}

backup && echo "Backup done." || exit 1
