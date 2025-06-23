USE user_registration;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'user') DEFAULT 'user',
    birth_date DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO users (last_name, first_name, email, password, role, birth_date, city, postal_code)
VALUES (
    'Goat',
    'Loïse',
    'loise.fenoll@ynov.com',
    '$2b$12$wmBVeszGkMevUJJUmr/h7uyJTWhUZ4iLu6/iTyZtJgecBzhqsEzBW',
    'admin',
    '1990-01-01',
    'Valbonne',
    '06560'
)
ON DUPLICATE KEY UPDATE email=email;