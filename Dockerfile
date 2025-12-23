# Use PHP 8.4 CLI/FPM image
FROM php:8.4-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    git \
 && docker-php-ext-install pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Composer from official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Expose Laravel dev server port
EXPOSE 8000

# Start Laravel development server
CMD ["sh", "-c", "composer install && php artisan serve --host=0.0.0.0 --port=8000"]