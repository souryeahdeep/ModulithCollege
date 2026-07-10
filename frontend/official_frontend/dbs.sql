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




CREATE TABLE alloted_classes(
    teacher_id VARCHAR(20),
    stream VARCHAR(199),
    subject VARCHAR(30),
    group int,
    section int,
    day VARCHAR(10),
    timing TIME
);
INSERT INTO alloted_classes (dummy, teacher_id, subject, group, section, day,timing) 
VALUES 
(1,'JIS/CST/SR','CT302',1,1,'Monday','11:50:00'),
(2,'JIS/CST/SR','CT302',2,1,'Monday','11:50:00'),
(3,'JIS/CST/MMD','CT301',1,1,'Monday','12:45:00'),
(4,'JIS/CST/MMD','CT301',2,1,'Monday','12:45:00'),
(5,'JIS/CST/SR','CT302',1,1,'Monday','15:00:00'),
(6,'JIS/ECE/MC','EC(CT)301',1,1,'Monday','15:55:00'),
(7,'JIS/M/SK','M(CT)201',1,1,'Tuesday','10:00:00'),
(8,'JIS/M/SK','M(CT)201',2,1,'Tuesday','10:00:00'),
(9,'JIS/ECE/MC','EC(CT)301',1,1,'Tuesday','10:55:00'),
(10,'JIS/ECE/MC','EC(CT)301',2,1,'Tuesday','10:55:00'),
(11,'JIS/ECE/MC','EC(CT)391',1,1,'Tuesday','11:50:00'),
(12,'JIS/CST/MMD','CT391',2,1,'Tuesday','11:50:00'),
(13,'JIS/2025/SR','CT302',2,1,'Tuesday','14:05:00'),
(14,'JIS/ECE/MC','EC(CT)301',2,1,'Tuesday','15:55:00'),
(15,'JIS/CST/AR','CT392',1,1,'Tuesday','15:55:00'),
(16,'JIS/ECE/MC','EC(CT)391',1,1,'Wednesday','10:00:00'),
(17,'JIS/CST/MMD','CT391',1,1,'Wednesday','10:00:00'),
(18,'JIS/CST/MMD','CT391',1,1,'Wednesday','10:55:00'),
(19,'JIS/CST/MMD','CT301',2,1,'Wednesday','11:50:00'),
(20,'JIS/CST/MMD','CT301',1,1,'Wednesday','11:50:00'),
(21,'JIS/M/SK','M(CT)301',2,1,'Wednesday','12:45:00'),
(22,'JIS/M/SK','M(CT)301',1,1,'Wednesday','12:45:00'),
(23,'JIS/ECE/MC','EC(CT)301',1,1,'Thursday','10:00:00'),
(24,'JIS/ECE/MC','EC(CT)301',2,1,'Thursday','10:00:00'),
(25,'JIS/CST/MMD','CT301',2,1,'Thursday','10:55:00'),
(26,'JIS/M/SK','M(CT)301',2,1,'Thursday','12:45:00'),
(27,'JIS/CST/AH','CT393',2,1,'Thursday','14:05:00'),
(28,'JIS/CST/AH','CT393',2,1,'Thursday','15:00:00'),
(29,'JIS/CST/AH','CT393',2,1,'Thursday','15:55:00'),
(30,'JIS/2025/SR','CT302',1,1,'Thursday','16:50:00'),
(31,'JIS/2025/SR','CT302',2,1,'Thursday','16:50:00'),
(32,'JIS/CST/AR','CT392',2,1,'Friday','14:05:00'),
(33,'JIS/CST/AR','CT392',2,1,'Friday','15:00:00'),
(34,'JIS/CST/AR','CT392',2,1,'Friday','15:55:00'),
(35,'JIS/CST/AH','CT393',1,1,'Thursday','14:05:00'),
(36,'JIS/CST/AH','CT393',1,1,'Thursday','15:00:00'),
(37,'JIS/CST/AH','CT393',1,1,'Thursday','15:55:00'),




CREATE TABLE students_table(
    student_name VARCHAR(100),
    student_id VARCHAR(20),
    group INTEGER,
    section INTEGER,
    present INTEGER,
    
);

INSERT INTO students (student_id, group_no,present,section_no,student_name,total_class)
VALUES 
