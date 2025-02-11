-- Drop the existing table if it exists (useful for resets in development)
DROP TABLE IF EXISTS public."contact-info";

-- Create Contact Info Table
CREATE TABLE IF NOT EXISTS public."contact-info"
(
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    website VARCHAR NOT NULL,
    phone VARCHAR NULL,
    email VARCHAR NULL,
    address TEXT NULL
    );

-- Set ownership (Optional, change 'user' to your actual database user)
ALTER TABLE public."contact-info"
    OWNER TO "user";

-- Insert Sample Contact Data
INSERT INTO public."contact-info" (website, phone, email, address) VALUES
                                                                       ('https://example1.com', '123-456-7890', 'info@example1.com', '123 Main St, City, Country'),
                                                                       ('https://example2.com', NULL, 'contact@example2.com', '456 Elm St, City, Country'),
                                                                       ('https://example3.com', '987-654-3210', NULL, '789 Oak St, City, Country'),
                                                                       ('https://example4.com', '555-666-7777', 'hello@example4.com', NULL),
                                                                       ('https://example5.com', NULL, NULL, '101 Pine St, City, Country');
