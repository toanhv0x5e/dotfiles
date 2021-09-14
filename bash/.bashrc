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
