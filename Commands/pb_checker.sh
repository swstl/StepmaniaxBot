#!/bin/bash

# check if arguments are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <username> <difficulty>"
    echo "Example: $0 dogfetus wild"
    echo "Valid difficulties: wild, hard, easy, basic, full, dual"
    exit 1
fi

username="$1"
difficulty="$2"

# define difficulty ranges
case "$difficulty" in
    wild)
        range=$(seq 19 27)
        ;;
    hard)
        range=$(seq 12 20)
        ;;
    basic)
        range=$(seq 1 6)
        ;;
    easy)
        range=$(seq 4 14)
        ;;
    full)
        range=$(seq 7 28)
        ;;
    dual)
        range=$(seq 2 21)
        ;;
    *)
        echo "Error: Invalid difficulty '$difficulty'"
        echo "Valid difficulties: wild, hard, basic, easy, full, dual"
        exit 1
        ;;
esac

# query each difficulty level
for diff in $range; do
    curl -s -G 'https://api.smx.573.no/scores' \
        --data-urlencode "q={\"gamer.username\":\"$username\",\"chart.difficulty_name\":\"$difficulty\",\"chart.difficulty\":$diff,\"_group_by\":\"song_chart_id\",\"_sort_by\":\"score\",\"_order\":\"asc\",\"_take\":1}" | \
    jq -r 'if length > 0 then .[] | "Difficulty \(.chart.difficulty): \(.song.title) - Score: \(.score)" else empty end'
done
