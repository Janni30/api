const multer = require('multer');
const path = require('path');
const Blog = require('../models/blogModel');

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Save files with unique names
    },
});

// Initialize multer middleware
const upload = multer({ storage });

// Add a new blog
const addBlog = async (req, res) => {
    try {
        const { title, content, author, image  } = req.body;

        // Validate required fields
        if (!title || !content || !author) {
            return res.status(400).json({ error: 'Title, content, and author are required' });
        }

        // Handle image upload
      // const image = null; // Retrieve the image path if file is uploaded

        // Create a new blog entry
        const newBlog = new Blog({ title, content, author, image });
        console.log("newBlog",newBlog);
        const savedBlog = await newBlog.save();

        res.status(201).json({ success: true, blog: savedBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add blog' });
    }
};

// List all blogs
const listBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to list blogs' });
    }
};

// Update a blog by ID
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, content, author },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json(updatedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update blog' });
    }
};

// Delete a blog by ID
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json(deletedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete blog' });
    }
};

// Export middleware and handlers
module.exports = {
    addBlog: [upload.single('image'), addBlog], // apply multer as middleware to handle file uploads
    listBlogs,
    updateBlog,
    deleteBlog
};
