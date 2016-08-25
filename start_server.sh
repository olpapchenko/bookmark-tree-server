#!/bin/bash
forever -o ./logs/server.log -e ./logs/server.log -a start ./app_main.js