CREATE TABLE vehicles (
	id BIGSERIAL PRIMARY KEY,
	brand VARCHAR(255),
	model VARCHAR(255),
	year INTEGER,
	is_available BOOLEAN
)