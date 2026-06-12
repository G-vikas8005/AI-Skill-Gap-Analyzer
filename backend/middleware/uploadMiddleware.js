import multer from "multer";
// Storage Configuration
const storage = multer.diskStorage({

  // Upload Folder
  destination: (req, file, cb) => {

    cb(null, "uploads/");

  },


  // File Name
  filename: (req, file, cb) => {

    cb(

      null,

      Date.now() + "-" + file.originalname

    );

  },

});


// Multer Upload
const upload = multer({

  storage,

});

export default upload;