#!/bin/bash
# ubuntu 18.04 at katalon
# Iptables rules by toan.ha@katalon.com
# 2021-01-25

# EDIT HERE
DNS_SERVER="1.1.1.1 208.67.222.222"
PACKAGES="iptables iptables-persistent"

# Root required
if [ $EUID -ne 0 ]; then
  echo '$0: script requires root privileges, run it as root or with sudo'
  exit 1
fi

# Install package
for _package in $PACKAGES
do
  _status=$(/usr/bin/dpkg-query --show --showformat='${db:Status-Status}\n' $_package)
  [ "$_status" == "installed" ] || apt-get install $_package -y
done

# Start
service netfilter-persistent restart 2> /dev/null

# Saving netfilter rules
invoke-rc.d netfilter-persistent save

# Import rules
#iptables-restore < ~/serenity-iptables-rules/ruleset-v4
#ip6tables-restore < ~/serenity-iptables-rules/ruleset-v6
#dpkg-reconfigure iptables-persistent

# Maintain current SSH
iptables --policy INPUT ACCEPT
iptables --policy FORWARD ACCEPT
iptables --policy OUTPUT ACCEPT

# Disable ipv6 iptables
systemctl disable ip6tables 2> /dev/null
systemctl stop ip6tables 2> /dev/null

# Clean up ip6tables
ip6tables -F 2> /dev/null
ip6tables -X 2> /dev/null
ip6tables -t nat -F 2> /dev/null
ip6tables -t nat -X 2> /dev/null
ip6tables -t mangle -F 2> /dev/null
ip6tables -t mangle -X 2> /dev/null

# Deny INPUT ip6tables
ip6tables -P INPUT DROP 2> /dev/null
ip6tables -P OUTPUT ACCEPT 2> /dev/null
ip6tables -P FORWARD ACCEPT 2> /dev/null

# Clean up
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

# Deny INPUT
iptables --policy INPUT DROP
#iptables --policy INPUT  ACCEPT
iptables --policy OUTPUT ACCEPT
iptables --policy FORWARD ACCEPT

## This should be one of the first rules.
## so dns lookups are already allowed for your other rules
# for ip in $DNS_SERVER
# do
# 	#echo "[+] Allowing DNS lookups (tcp, udp port 53) to server '$ip'"
# 	iptables -A OUTPUT -p udp -d $ip --dport 53 --match state --state NEW,ESTABLISHED --jump ACCEPT
# 	iptables -A INPUT  -p udp -s $ip --sport 53 --match state --state ESTABLISHED --jump ACCEPT
# 	iptables -A OUTPUT -p tcp -d $ip --dport 53 --match state --state NEW,ESTABLISHED --jump ACCEPT
# 	iptables -A INPUT  -p tcp -s $ip --sport 53 --match state --state ESTABLISHED --jump ACCEPT
# done

# Reverse connect
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# Allow Ping
#iptables -A INPUT -p icmp --icmp-type 8 -s 0/0 -d ${SERVER_IP} -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
iptables --append INPUT --protocol icmp --icmp-type echo-request --jump ACCEPT
iptables --append INPUT --protocol icmp --icmp-type echo-reply --jump ACCEPT

# Loopback
iptables --append INPUT --in-interface lo --jump ACCEPT
#iptables --append INPUT --in-interface tun+ --jump ACCEPT
#iptables --append INPUT --in-interface tap+ --jump ACCEPT
#iptables --append INPUT --in-interface docker+ --jump ACCEPT
#iptables --append INPUT --in-interface vmnet+ --jump ACCEPT

# SSH, Nexpose console to engine
#iptables -A INPUT -p tcp --dport 21 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 80 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 443 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 3389 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 3780 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 8080 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 4444 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 5000 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 13337 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 27042 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
#iptables -A INPUT -p tcp --dport 40814 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT

# Hardening: Disable ICMP timestamp responses on Linux ===>
#ipchains -A INPUT -p icmp --icmp-type timestamp-request -j DROP
#ipchains -A OUTPUT -p icmp --icmp-type timestamp-reply -j DROP
#<===|

# Save rules
#sudo iptables-restore < ~/serenity-iptables-rules/ruleset-v4
#sudo ip6tables-restore < ~/serenity-iptables-rules/ruleset-v6
dpkg-reconfigure iptables-persistent

# Verify
systemctl enable netfilter-persistent 2> /dev/null
systemctl start netfilter-persistent 2> /dev/null
echo "[+] sleep 8 seconds. waiting..."
sleep 8
echo "[+] ========================================"
echo "[+] ipables IPv4 rules"
iptables -vL --line-numbers
echo "[+] ========================================"
echo "[+] ipables IPv6 rules"
ip6tables -vL --line-numbers
echo "[+] ========================================"
