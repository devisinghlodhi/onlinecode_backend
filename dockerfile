# Use Debian-based Node image (important)
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies + languages
RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    openjdk-17-jdk \
    golang-go \
    php-cli \
    ruby-full \
    r-base \
    mono-complete \
    redis-server \
    curl git unzip gnupg ca-certificates wget \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Install SDKMAN + Kotlin
RUN curl -s https://get.sdkman.io | bash && \
    bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install kotlin"

# Install PM2 globally
RUN npm install -g pm2

# Copy package files first (better caching)
COPY package*.json ./

# Install Node dependencies
RUN npm install --production

# Copy rest of the app
COPY . .

# Add startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 5000
EXPOSE 6379

# Start everything
CMD ["/start.sh"]