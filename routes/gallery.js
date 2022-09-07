const express = require('express')
const router = express.Router()

const Item = require('../models/item')
const User = require('../models/user')
const Bid = require('../models/bid')

const { isLoggedIn, isAdmin } = require('../controllers/authFunctions')

//IMG UPLOAD TO CLOUDINARY
const { storage, cloudinary } = require('../config/index')
const multer = require('multer')
const upload = multer({
    storage: storage,
})

//GALLERY GET-------------------------------------------------------------------
router.get('/', async (req, res) => {
    const items = await Item.find({})
    res.render('gallery', { items })
})

//ITEM NEW GET AND POST----------------------------------------------------------------------------
router.post('/', isLoggedIn, isAdmin, upload.single('img'), async (req, res) => {
    console.log(req.body, req.file)
    const item = new Item(req.body)
    item.filename = req.file.filename
    item.url = req.file.path
    await item.save()
    res.redirect(`/gallery/${item._id}`);
})

router.get('/new', isLoggedIn, isAdmin, (req, res) => {
    res.render('new')
})

//SHOW GET--------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
    const item = await Item.findById(req.params.id)
    const user = req.user
    let hasBid = false
    let bidAmount = null
    let itemBids = []
    if (user) {
        const populatedUser = await User.findById(user.id).populate({
            path: 'bids',
            populate: { path: 'item' }
        })
        for (let bid of populatedUser.bids) {
            const userItem = bid.item._id
            if (userItem.equals(item._id)) {
                hasBid = true
                bidAmount = bid.amount.toLocaleString('en-US')
            }
        }
    }
    const populatedItem = await item.populate({
        path: 'bids',
        populate: { path: 'user' }
    })
    for (let bid of populatedItem.bids) {
        let bidUserUsername = bid.user.username
        let bidUserAmount = bid.amount
        itemBids.push({ bidUserUsername, bidUserAmount })
    }

    itemBids.sort(function (a, b) {
        return b.bidUserAmount - a.bidUserAmount;
    })

    res.render('show', { item, user, bidAmount, hasBid, itemBids })
})

//ITEM EDIT GET---------------------------------------------------------------------------
router.get('/:id/edit', isLoggedIn, isAdmin, async (req, res) => {
    const item = await Item.findById(req.params.id)
    res.render('edit', { item })
})

//BID POST PUT DELETE--------------------------------------------------------------------------------
router.post('/:id/bid', isLoggedIn, async (req, res) => {
    const item = await Item.findById(req.params.id)
    const user = req.user
    const bid = new Bid(req.body)
    bid.item = item._id
    bid.user = user._id
    await bid.save()
    user.bids.push(bid._id)
    await user.save()
    item.bids.push(bid._id)
    await item.save()
    res.redirect(`/gallery/${item._id}`)
})
router.put('/:id/bid', isLoggedIn, async (req, res) => {
    const item = await Item.findById(req.params.id)
    const itemID = item.id
    const userID = req.user.id
    const bid = await Bid.findOne({ user: userID, item: itemID })
    bid.amount = req.body.amount
    await bid.save()
    res.redirect(`/gallery/${item._id}`)
})
router.delete('/:id/bid', isLoggedIn, async (req, res) => {
    const item = await Item.findById(req.params.id)
    const itemID = item.id
    const user = req.user
    const userID = user.id
    const bid = await Bid.findOne({ user: userID, item: itemID })
    const bidID = bid.id
    await item.updateOne({ $pull: { bids: bidID } })
    await item.save()
    await user.updateOne({ $pull: { bids: bidID } })
    await user.save()
    await Bid.findOneAndDelete({ user: userID, item: itemID })
    res.redirect(`/gallery/${item._id}`)
})

//ITEM PUT--------------------------------------------------------------
router.put('/:id', isLoggedIn, isAdmin, upload.single('img'), async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, { ...req.body })
    if (req.file) {
        await cloudinary.uploader.destroy(item.filename);
        item.url = req.file.path
        item.filename = req.file.filename
        await item.save()
    }
    res.redirect(`/gallery/${item._id}`);
})

//ITEM DELETE------------------------------------------------------------
router.delete('/:id', isLoggedIn, isAdmin, async (req, res) => {
    const item = await Item.findById(req.params.id)
    await cloudinary.uploader.destroy(item.filename);
    await Item.findByIdAndDelete(req.params.id)
    res.redirect('/gallery')
})

module.exports = router