#!/usr/bin/env bash

node server1.js &
first_pid=$!

node server2.js &
second_pid=$!

sleep 1
curl --header "x-correlation-id: 1" http://localhost:3000 &
sleep 1
curl --header "x-correlation-id: 2" http://localhost:3000 &

sleep 6

kill -KILL $first_pid
kill -KILL $second_pid