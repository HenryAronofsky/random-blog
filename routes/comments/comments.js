const express = require('express')
const router = express.Router();
const Post = require('../../models/Post');
const { v4: uuidv4 } = require('uuid');

router.post('/:userName/posts/:id', isAuthenticated, async (req, res) => {
    // let all = await Post.findOne({author: req.params.userName})
    // console.log(all.comments)
    const dateReference = new Date()

    const newComment = {
        content: req.body.content,
        author: req.user.userName,
        date: `${String(dateReference.getMonth() + 1).padStart(2, '0')}/${String(dateReference.getDate()).padStart(2, '0')}/${dateReference.getFullYear()}`,
        postId: req.params.id,
        _id: uuidv4(),
        replies: []
    }
    
    try {
        let post = await Post.find({_id: req.params.id, author: req.params.userName})
        post[0].comments.push(JSON.stringify(newComment))
        await post[0].save()
    } catch {
        res.redirect(`/account/${req.params.userName}/posts`)
    }
})

router.delete('/:userName/posts/:postId/comments/:commentId', isAuthenticated, async (req, res) => {
    try {
        let post = await Post.find({_id: req.params.postId, author: req.params.userName})
        let postComments = post[0].comments
        postComments.forEach((comment, index) => {
            let commentId = JSON.parse(comment)._id
            if (commentId == req.params.commentId) {
                postComments.splice(index, 1)
            }
        })

        post[0].comments = postComments
        await post[0].save()
    } catch (e) {
        console.log(e)
        res.redirect(`/account/${req.params.userName}/posts`)
    }
})

router.put('/:userName/posts/:postId/comments/:commentId', isAuthenticated, async (req, res) => {
    try {
        let post = await Post.find({_id: req.params.postId, author: req.params.userName})
        let postComments = post[0].comments
        postComments.forEach((comment, index) => {
            let commentId = JSON.parse(comment)._id
            if (commentId == req.params.commentId) {
                let updatedComment = JSON.parse(postComments[index])
                updatedComment.content = req.body.updatedComment
                postComments[index] = JSON.stringify(updatedComment)
            }
        })
        post[0].comments = postComments
        post[0].markModified('comments')
        await post[0].save()
    } catch (e) {
        console.log(e)
        res.redirect(`/account/${req.params.userName}/posts`)
    }
})

router.post('/:userName/posts/:postId/comments/:commentId/reply', isAuthenticated, async (req, res) => {
    const dateReference = new Date()

    const newReply = {
        content: req.body.reply,
        author: req.user.userName,
        date: `${String(dateReference.getMonth() + 1).padStart(2, '0')}/${String(dateReference.getDate()).padStart(2, '0')}/${dateReference.getFullYear()}`,
        _id: uuidv4(),
        commentId: req.params.commentId
    }
    
    try {
        let post = await Post.find({_id: req.params.postId, author: req.params.userName})
        let postComments = post[0].comments
        postComments.forEach((comment, index) => {
            let thisComment = JSON.parse(comment)
            if (thisComment._id == req.params.commentId) {
                thisComment.replies.push(JSON.stringify(newReply))
                postComments[index] = JSON.stringify(thisComment)
            }
        })
        
        post[0].comments = postComments
        post[0].markModified('comments')
        await post[0].save()
    } catch (e) {
        console.log(e)
        res.redirect(`/account/${req.params.userName}/posts`)
    }
})

router.delete('/:userName/posts/:postId/comments/:commentId/reply/:replyId', isAuthenticated, async (req, res) => {
    try {
        let post = await Post.find({_id: req.params.postId, author: req.params.userName})
        let postComments = post[0].comments
        postComments.forEach((comment, index) => {
            let thisComment = JSON.parse(comment)
            let commentId = thisComment._id
            if (commentId == req.params.commentId) {
                thisComment.replies.forEach((reply, index) => {
                    let thisReply = JSON.parse(reply)
                    let replyId = thisReply._id
                    if (replyId == req.params.replyId) {
                        thisComment.replies.splice(index, 1)
                    }
                })
                postComments[index] = JSON.stringify(thisComment)
            }
        })

        post[0].comments = postComments
        post[0].markModified('comments')
        await post[0].save()
    } catch (e) {
        console.log(e)
        res.redirect(`/account/${req.params.userName}/posts`)
    }
})

router.put('/:userName/posts/:postId/comments/:commentId/reply/:replyId', isAuthenticated, async (req, res) => {
    let updatedReply
    try {
        let post = await Post.find({_id: req.params.postId, author: req.params.userName})
        let postComments = post[0].comments
        postComments.forEach((comment, index) => {
            let thisComment = JSON.parse(comment)
            let commentId = thisComment._id
            if (commentId == req.params.commentId) {
                thisComment.replies.forEach((reply) => {
                    let thisReply = JSON.parse(reply)
                    let replyId = thisReply._id
                    if (replyId == req.params.replyId) {
                        updatedReply = JSON.parse(reply)
                        updatedReply.content = req.body.updatedReply
                    }
                })
                thisComment.replies[index] = JSON.stringify(updatedReply)
                postComments[index] = JSON.stringify(thisComment)
            }
        })
        post[0].comments = postComments
        post[0].markModified('comments')
        await post[0].save()
    } catch (e) {
        console.log(e)
        res.redirect(`/account/${req.params.userName}/posts`)
    }
})

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/account')
    }
}

module.exports = router;