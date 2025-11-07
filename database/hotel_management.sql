-- init_db.sql
DROP DATABASE IF EXISTS luxnest;
CREATE DATABASE luxnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE luxnest;

-- customers
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(50),
  note TEXT,
  status ENUM('booked','staying','checked-out') DEFAULT 'booked',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- staffs
CREATE TABLE staffs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(50),
  designation ENUM('manager','staff','cleaner','guard') DEFAULT 'staff',
  joined_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- rooms
CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(20) NOT NULL UNIQUE,
  type ENUM('single','double','suite') DEFAULT 'single',
  status ENUM('available','booked','occupied','maintenance') DEFAULT 'available',
  price DECIMAL(10,2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- bookings
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  room_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('booked','staying','checked-out') DEFAULT 'booked',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- seed some rooms, staffs, customers
INSERT INTO rooms (room_number, type, status, price) VALUES
('101','single','available',1200.00),
('102','single','available',1200.00),
('103','double','maintenance',2000.00),
('201','double','available',2000.00),
('202','suite','available',5000.00);

INSERT INTO staffs (name, email, phone, designation, joined_at) VALUES
('Rizvi','rizvi@example.com','01710000001','manager','2024-01-10'),
('Nahid','nahid@example.com','01710000002','staff','2024-03-01'),
('Nokib','nokib@example.com','01710000003','cleaner','2024-05-12'),
('Sakib','sakib@example.com','01710000004','guard','2024-02-20');

INSERT INTO customers (name, email, phone, status) VALUES
('Tarek','tarek@example.com','01810000001','booked'),
('Nayeem','nayeem@example.com','01810000002','staying'),
('Sumi','sumi@example.com','01810000003','checked-out');

-- seed a booking for Nayeem currently staying in room 201
INSERT INTO bookings (customer_id, room_id, start_date, end_date, status)
VALUES ((SELECT id FROM customers WHERE name='Nayeem'),
        (SELECT id FROM rooms WHERE room_number='201'),
        CURDATE() - INTERVAL 1 DAY,
        CURDATE() + INTERVAL 2 DAY,
        'staying');

-- mark that room as occupied
UPDATE rooms SET status='occupied' WHERE room_number='201';
