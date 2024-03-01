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

complete -C /usr/bin/terraform terraform

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

export LD_LIBRARY_PATH=/opt/oracle/instantclient_19_18:$LD_LIBRARY_PATH
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
