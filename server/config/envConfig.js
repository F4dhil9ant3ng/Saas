import dotenv from 'dotenv';
dotenv.config();

const config = {
		db: process.env.DATABASE_URL,
		secret: process.env.SECRET
};

export default config;