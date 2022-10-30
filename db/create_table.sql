CREATE TYPE category AS ENUM (
	'drinks',
	'food',
	'cultural',
	'sport',
	'experience',
	'entertainment',
	'outdoor',
	'indoor',
	'shopping'
);
CREATE TABLE "user" (
	id serial primary key,
	username varchar(80) unique not null,
	password varchar(65) not null,
	email varchar(255) unique not null
);
CREATE TABLE trip (
	id SERIAL PRIMARY KEY,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	link VARCHAR(500),
	organiser_id INT NOT NULL,
	CHECK(start_date <= end_date)
);
CREATE TABLE trip_members (
	user_id INT NOT NULL,
	trip_id INT NOT NULL,
	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES "user"(id) ON DELETE CASCADE,
	CONSTRAINT fk_trip_id FOREIGN KEY(trip_id) REFERENCES trip(id) ON DELETE CASCADE,
	PRIMARY KEY(user_id, trip_id)
);
CREATE TABLE activity (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	city VARCHAR(30) NOT NULL,
	country VARCHAR(30) NOT NULL,
	category category [] NOT NULL
);
CREATE TABLE trip_activity (
	trip_id INT NOT NULL,
	activity_id INT NOT NULL,
	day_number INT NOT NULL,
	order_number INT NOT NULL,
	visiting_time VARCHAR(15) NOT NULL,
	note VARCHAR(200),
	CONSTRAINT fk_trip_id FOREIGN KEY(trip_id) REFERENCES trip(id) ON DELETE CASCADE,
	CONSTRAINT fk_activity_id FOREIGN KEY(activity_id) REFERENCES activity(id) ON DELETE CASCADE,
	PRIMARY KEY(trip_id, activity_id, day_number),
	CHECK (
		day_number BETWEEN 1 AND 31
	)
);
CREATE TABLE trip_pictures (
	id SERIAL PRIMARY KEY,
	path VARCHAR(100),
	trip_id INT NOT NULL,
	day_number INT NOT NULL,
	user_id INT NOT NULL,
	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES "user"(id) ON DELETE CASCADE
);