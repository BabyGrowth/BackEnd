const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


// (RUTE) API
app.use('/api/users', userRoutes);

// Memulai Server
app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
});