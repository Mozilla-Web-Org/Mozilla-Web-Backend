const express = require('express');
const router = express.Router();
const { uploadImageToR2 } = require('../utils/imageUpload');

// Route handler for image uploads
router.post('/', async (req, res) => {
  console.log("Upload endpoint hit");
  
  try {
    // Validate request
    if (!req.body || !req.body.base64Image) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: base64Image"
      });
    }
    
    const { base64Image, folder = 'Mozilla_Web' } = req.body;
    
    // Log size for debugging
    const sizeInMB = (base64Image.length * 0.75) / (1024 * 1024);
    console.log(`Uploading image of size: ${sizeInMB.toFixed(2)}MB to folder: ${folder}`);
    
    // Upload to R2
    const imageUrl = await uploadImageToR2(base64Image, folder);
    console.log("Upload successful, URL:", imageUrl);
    
    // Success response
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: imageUrl 
    });
  }
  catch (error) {
    console.error("Error uploading image:", error);
    
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message || 'Unknown error'
    });
  }
});

module.exports = router;