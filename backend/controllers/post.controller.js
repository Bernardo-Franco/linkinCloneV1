import cloudinary from '../lib/cloudinary.js';
import Post from '../models/post.model.js';
import Notification from '../models/notificacion.model.js';
import { sendCommentNotificationEmail } from '../emails/emailHandlers.js';

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: { $in: req.user.connections } })
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error in getFeedPosts controller: ', error);
    res.status(500).json({ mesage: 'Server error' });
  }
};

export const getMyPosts = async (req, res) => {
  const userId = req.user._id;
  try {
    const myPosts = await Post.find({ author: userId })
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json(myPosts);
  } catch (error) {
    console.error('Error in getMyPosts controller: ', error);
    res.status(500).json({ mesage: 'Server error' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    let newPost;

    if (image) {
      const imgResult = await cloudinary.uploader.upload(image);

      newPost = new Post({
        author: req.user._id,
        content,
        image: imgResult.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content,
      });
    }

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating newPost controller: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // check if the current user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "you're not authorized to delete the post" });
    }

    if (post.image) {
      // deleting image of cloudinary
      await cloudinary.uploader.destroy(
        post.image.split('/').pop().split('.')[0]
      );
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'post deleted successfully' });
  } catch (error) {
    console.log('error in deletePost controller: ', error);
    res.status(500).json({ message: 'server error' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name profilePicture username headline');

    res.status(200).json(post);
  } catch (error) {
    console.error('error in getPostById controller: ', error);
    res.status(500).json({ message: 'server error' });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: { user: req.user._id, content },
        },
      },
      { new: true }
    ).populate('author', 'name email username headline profilePicture');

    // create a notification if the comment owner is not the post owner
    if (post.author._id.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: 'comment',
        relatedUser: req.user._id,
        relatedPost: postId,
      });

      await newNotification.save();

      // send email notification
      try {
        const postUrl = process.env.CLIENT_URL + 'post/' + postId;
        await sendCommentNotificationEmail(
          post.author.email,
          post.author.name,
          req.user.name,
          postUrl,
          content
        );
      } catch (error) {
        console.error('Error in sending comment notification email: ', error);
      }
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error in creating comment controller: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
      // create a notification if the post owner is not the user who liked
      if (post.author.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: post.author,
          type: 'like',
          relatedUser: userId,
          relatedPost: postId,
        });
        await newNotification.save();
      }
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Error in liking a post controller: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};
