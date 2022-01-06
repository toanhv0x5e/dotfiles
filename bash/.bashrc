#!/bin/bash
# .bashrc by toanha (toanhv.vietnam@gmail.com)

if [ -n "$BASH_VERSION" -a -n "$PS1" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
        # include .bashrc.d/* if it exists
        if [ -f $HOME/.bashrc.d/.bashrc_aliases ]; then
            . $HOME/.bashrc.d/.bashrc_aliases
            . $HOME/.bashrc.d/.bashrc_common
            . $HOME/.bashrc.d/.bashrc_editor
            . $HOME/.bashrc.d/.bashrc_env
            . $HOME/.bashrc.d/.bashrc_function
            . $HOME/.bashrc.d/.bashrc_unikey
            . $HOME/.bashrc.d/.bashrc_security
        fi
    fi
fi

PATH="/home/toan/perl5/bin${PATH:+:${PATH}}"; export PATH;
PERL5LIB="/home/toan/perl5/lib/perl5${PERL5LIB:+:${PERL5LIB}}"; export PERL5LIB;
PERL_LOCAL_LIB_ROOT="/home/toan/perl5${PERL_LOCAL_LIB_ROOT:+:${PERL_LOCAL_LIB_ROOT}}"; export PERL_LOCAL_LIB_ROOT;
PERL_MB_OPT="--install_base \"/home/toan/perl5\""; export PERL_MB_OPT;
PERL_MM_OPT="INSTALL_BASE=/home/toan/perl5"; export PERL_MM_OPT;
