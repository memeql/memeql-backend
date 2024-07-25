const getDemo = (req, res) => {
    console.log('in getDemo')
    if (!req.userData.id) {
        res.status(401).json({ message: 'User unauthenticated' })
    } else {
        res.status(200).json({ message: "This is a demo message from the backend." })
    }
}

module.exports = {
    getDemo,
}