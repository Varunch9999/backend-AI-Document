export const errorHandler = (err, req, res, next) => {

  console.error(err);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "File too large. Maximum allowed size is 30MB."
    });
  }

  res.status(500).json({
    error: "Something went wrong"
  });

};