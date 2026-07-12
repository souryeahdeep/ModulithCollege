CREATE TABLE teachers(
    teacher_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(20),
    email VARCHAR(50),
    birth_date DATE,
);

INSERT INTO teachers (teacher_id, teacher_name, teacher_email, teacher_date_of_birth) 
VALUES
('JIS/CST/SR', 'SR', 'sr@jiscollege.com', '1980-01-01'),
('JIS/CST/MMD', 'MMD', 'mmd@jiscollege.com', '1985-02-02'),
('JIS/ECE/MC', 'MC', 'mc@jiscollege.com', '1990-03-03'),
('JIS/M/SK', 'SK', 'sk@jiscollege.com', '1995-04-04'),
('JIS/CST/AR', 'AR', 'ar@jiscollege.com', '2000-05-05'),
('JIS/CST/AH', 'AH', 'ah@jiscollege.com', '1980-05-12'),
('JIS/CST/SC', 'SC', 'sc@jiscollege.com', '2000-06-12'),
('JIS/CST/AR', 'AR', 'ar@jiscollege.com', '2000-05-05');

