#!/bin/sh

export ENVIRONMENT="{{app.environment}}"
export ENVMOD="/www/FCWEB"
export LOG_DIR="${ENVMOD}/logs"
export ENCRYPTION_KEY="{{app.encryptionKey}}"

# setenv
. ../../conf/setenv.sh

echo "*---------------------------- PRAMA Sporting Clay ----------------------------*"
echo " ENVIRONMENT=${ENVIRONMENT}"
echo " ENVMOD=${ENVMOD}"
echo "*----------------------------  ----------------------------  ----------------------------*"

exec "/usr/bin/java8" "-Xms1024m" "-Xmx1024m" -DENVMOD=${ENVMOD} -Dspring.profiles.active=${ENVIRONMENT} -DencryptionKey=${ENCRYPTION_KEY} -Dfile.encoding=ISO-8859-1 -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=${LOG_DIR} -jar prama-sportingclay.jar

