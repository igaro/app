RUN apt-get install -y xvfb

Xvfb :1 -screen 0 1600x1200x16 &
export DISPLAY=:1.0

# Starting from Ubuntu Trusty
FROM ubuntu:trusty

RUN apt-get install -y firefox

# Starting from Ubuntu Trusty
FROM ubuntu:trusty

# Install Wget to download the selenium-server.jar and openjdk-7-jdk
RUN apt-get install -y wget openjdk-7-jdk

# Set Environment variables that are used for running the Selenium build
ENV SELENIUM_PORT 4444
ENV SELENIUM_WAIT_TIME 10

# Download the selenium-server.jar with wget
RUN wget --continue --output-document /selenium-server.jar "http://selenium-release.storage.googleapis.com/2.47/selenium-server-standalone-2.47.1.jar"

java -jar /selenium-server.jar -port "${SELENIUM_PORT}" ${SELENIUM_OPTIONS} 2>&1 &
sleep "${SELENIUM_WAIT_TIME}"
echo "Selenium ${SELENIUM_VERSION} is now ready to connect on port ${SELENIUM_PORT}..."
