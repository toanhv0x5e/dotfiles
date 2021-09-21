#!/bin/bash
# Required by JumpCloud

_softwares="\
	apt-rdepends \
	apt-show-versions \
	coreutils \
	apt-curl \
	dpkg \
	grep \
	hostname \
	libc-bin \
	lsb-release \
	lsof \
	mawk \
	passwd \
	procps \
	sysvinit-utils \
	tar \
	sudo \
	gdebi-core \
	libnss3  \
	libnss3-tools \
  "

for i in $_softwares
  do
    sudo apt install $i -y
done
