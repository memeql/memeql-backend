const router = require("express").Router()
const demoRoute = require("./demoRoutes.js")

router.use('/demo', demoRoute)

module.exports = router