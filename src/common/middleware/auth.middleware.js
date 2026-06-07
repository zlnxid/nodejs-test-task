const authMiddleware = (req, res, next) => {

    if (req.path === '/api-docs' || req.path.startsWith('/api-docs/')) {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send("Unauthorized");
    }

    const token = authHeader.split(' ')[1];

    if (token !== process.env.AUTH_TOKEN) {
        return res.status(403).send("Forbidden");
    }

    next();
};

module.exports = authMiddleware;