import express from 'express'

const router = express.Router()

router.get('/', (req, get) => {
    resizeBy.json({"status": "running"})
})

export default router