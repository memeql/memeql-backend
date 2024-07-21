const getDemo = (req, res) => {
    res.status(200).json({ message: "This is a demo message from the backend." })
}

module.exports = {
    getDemo,
}