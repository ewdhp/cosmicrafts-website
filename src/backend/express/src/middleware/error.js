app.use((err, req, res, next) => {
  if (err.isAxiosError) {
    console.error('API Error:', err.response.data);
    res.status(500).send('External API Error');
  } else {
    next(err);
  }
});