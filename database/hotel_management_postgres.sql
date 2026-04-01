-- hotel_management_postgres.sql
-- PostgreSQL / Neon schema + seed data

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(50),
  note TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'booked' CHECK (status IN ('booked','staying','checked-out')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staffs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(50),
  designation VARCHAR(20) NOT NULL DEFAULT 'staff' CHECK (designation IN ('manager','staff','cleaner','guard')),
  joined_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  room_number VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL DEFAULT 'single' CHECK (type IN ('single','double','suite')),
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available','booked','occupied','maintenance')),
  price NUMERIC(10,2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  room_id INT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'booked' CHECK (status IN ('booked','staying','checked-out')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rooms (room_number, type, status, price) VALUES
('101','single','available',1200.00),
('102','single','available',1200.00),
('103','double','maintenance',2000.00),
('201','double','available',2000.00),
('202','suite','available',5000.00)
ON CONFLICT (room_number) DO NOTHING;

INSERT INTO staffs (name, email, phone, designation, joined_at)
SELECT * FROM (VALUES
('Rizvi','rizvi@example.com','01710000001','manager','2024-01-10'::date),
('Nahid','nahid@example.com','01710000002','staff','2024-03-01'::date),
('Nokib','nokib@example.com','01710000003','cleaner','2024-05-12'::date),
('Sakib','sakib@example.com','01710000004','guard','2024-02-20'::date)
) AS seed(name, email, phone, designation, joined_at)
WHERE NOT EXISTS (SELECT 1 FROM staffs);

INSERT INTO customers (name, email, phone, status)
SELECT * FROM (VALUES
('Tarek','tarek@example.com','01810000001','booked'),
('Nayeem','nayeem@example.com','01810000002','staying'),
('Sumi','sumi@example.com','01810000003','checked-out')
) AS seed(name, email, phone, status)
WHERE NOT EXISTS (SELECT 1 FROM customers);

INSERT INTO bookings (customer_id, room_id, start_date, end_date, status)
SELECT
    (SELECT id FROM customers WHERE name = 'Nayeem' LIMIT 1),
    (SELECT id FROM rooms WHERE room_number = '201' LIMIT 1),
    CURRENT_DATE - INTERVAL '1 day',
    CURRENT_DATE + INTERVAL '2 day',
    'staying'
WHERE NOT EXISTS (SELECT 1 FROM bookings);

UPDATE rooms
SET status = 'occupied'
WHERE room_number = '201'
  AND EXISTS (SELECT 1 FROM bookings WHERE room_id = rooms.id AND status = 'staying');
