# Drata Agent
if [ "$(which drata-agent)" = "" ]; then
  cd $HOME/Downloads/
  [ -f "$HOME/Downloads/drata-agent-3.0.0.deb" ] || wget https://cdn.drata.com/agent/dist/linux/drata-agent-3.0.0.deb
  sudo apt install ./drata-agent-3.0.0.deb
fi

# JumpCloud Agent
read -sp 'Connect Key: ' _connect_key
if [ -n ${_connect_key} ] && [ `expr "$_connect_key" : '[0-9a-fA-F]\{32\}\|[0-9a-fA-F]\{40\}'` -eq ${#_connect_key} ]; then
  curl --tlsv1.2 --silent --show-error --header \
  "x-connect-key: ${_connect_key}" \
  https://kickstart.jumpcloud.com/Kickstart | sudo bash
else
  echo -e "\nJumpCloud install failed. Manual install is required." && exit 1
fi
