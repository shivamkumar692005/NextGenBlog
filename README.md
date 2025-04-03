# Project Title

A Medium-like blogging platform built with React, Cloudflare Hono, and PostgreSQL (Prisma). It supports user authentication, article publishing, comments, and rich text editing.

## Features

- Fully authenticated and authorized user sign-in and sign-up.
- Users can create, update, and view blogs.
- View blogs published by other users.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shivamkumar692005/NextGenBlog
   ```
2. Navigate to the project directories:
   ```bash
   cd backend
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   *Replace `npm` with the appropriate package manager if needed.*

4. Add environment variables:
   - In the backend, add the environment variables `DATABASE_URL` and `SECRET` in `.env` and `wrangler.jsonc`.
   - In the frontend, add the environment variables `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET`.

## Usage

1. Start the application:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
   *Adjust the port or URL as necessary.*

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a meaningful commit message"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## Contact

For questions or feedback, please contact:

- **Name:** Shivam Kumar
- **Email:** shivamkumar692005@gmail.com
- **GitHub:** [shivamkumar692005](https://github.com/shivamkumar692005)
